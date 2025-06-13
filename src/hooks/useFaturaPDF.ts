
import { useState } from 'react';
import { generateCustomPDF, combinePDFs, uploadPDFToStorage, saveFaturaPDF, getFaturaPDF } from '@/services/pdfService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { faturaValidacaoService } from '@/services/faturaValidacaoService';

export const useFaturaPDF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const processarFaturaCompleta = async (
    uc: string, 
    documento: string, 
    dataNascimento?: string,
    subscriberId?: string,
    tipoConsulta: 'select' | 'manual' = 'manual'
  ) => {
    setIsLoading(true);
    setProcessedPdfUrl(null);
    
    try {
      console.log('🔍 [FATURA] Iniciando processamento para UC:', uc);
      
      // Verificar se já existe PDF salvo
      const faturaExistente = await getFaturaPDF(uc);
      if (faturaExistente) {
        console.log('📄 [FATURA] PDF existente encontrado');
        setProcessedPdfUrl(faturaExistente.pdf_combinado_url);
        toast({
          title: "PDF encontrado",
          description: "Fatura processada anteriormente encontrada.",
        });
        return faturaExistente.pdf_combinado_url;
      }

      console.log('🌐 [FATURA] Chamando API para baixar fatura original...');
      
      // Chamar API para baixar fatura original
      const response = await supabase.functions.invoke('baixar-fatura', {
        body: {
          uc,
          documento,
          data_nascimento: dataNascimento
        }
      });

      if (response.error) {
        console.error('❌ [FATURA] Erro na API:', response.error);
        throw new Error(response.error.message);
      }

      const { fatura_url, message } = response.data;
      console.log('✅ [FATURA] Fatura original baixada:', fatura_url);

      // SEMPRE gerar PDF customizado e combinar
      console.log('🎨 [FATURA] Gerando PDF customizado...');
      const customPdfBytes = await generateCustomPDF('invoice-layout');
      console.log('✅ [FATURA] PDF customizado gerado, combinando com original...');
      
      // Combinar PDFs (customizado + original)
      const combinedPdfBytes = await combinePDFs(fatura_url, customPdfBytes);
      
      // Upload para storage
      const fileName = `fatura_combinada_${uc}_${Date.now()}.pdf`;
      const finalPdfUrl = await uploadPDFToStorage(combinedPdfBytes, fileName);
      console.log('📤 [FATURA] PDF combinado enviado para storage:', finalPdfUrl);
      
      // Salvar no banco
      await saveFaturaPDF({
        numero_fatura: uc,
        pdf_original_url: fatura_url,
        pdf_customizado_url: null,
        pdf_combinado_url: finalPdfUrl
      });
      console.log('💾 [FATURA] PDF salvo no banco de dados');

      // Se for de assinante cadastrado, salvar em validação
      if (tipoConsulta === 'select' && subscriberId) {
        try {
          console.log('👤 [FATURA] Salvando para assinante em validação...');
          await faturaValidacaoService.createFaturaValidacao({
            subscriber_id: subscriberId,
            uc: uc,
            documento: documento,
            data_nascimento: dataNascimento,
            tipo_pessoa: dataNascimento ? 'fisica' : 'juridica',
            fatura_url: finalPdfUrl,
            pdf_path: fileName,
            message: message
          });
          
          toast({
            title: "Fatura processada com sucesso!",
            description: "PDF combinado criado e salvo em 'Faturas em Validação'.",
          });
        } catch (error) {
          console.error('❌ [FATURA] Erro ao salvar em validação:', error);
          toast({
            title: "PDF combinado criado!",
            description: "Mas houve erro ao salvar em validação.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "PDF combinado criado!",
          description: "Fatura processada e combinada com sucesso.",
        });
      }

      setProcessedPdfUrl(finalPdfUrl);
      return finalPdfUrl;

    } catch (error) {
      console.error('❌ [FATURA] Erro ao processar fatura:', error);
      toast({
        title: "Erro ao processar fatura",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar a fatura. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const processarFatura = async (uc: string, documento: string, dataNascimento?: string) => {
    return processarFaturaCompleta(uc, documento, dataNascimento);
  };

  const resetProcessedPdf = () => {
    setProcessedPdfUrl(null);
  };

  return {
    processarFatura,
    processarFaturaCompleta,
    processedPdfUrl,
    resetProcessedPdf,
    isLoading
  };
};
