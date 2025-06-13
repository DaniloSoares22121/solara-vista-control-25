
import { useState } from 'react';
import { generateCustomPDF, combinePDFs, uploadPDFToStorage, saveFaturaPDF, getFaturaPDF } from '@/services/pdfService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { faturaValidacaoService } from '@/services/faturaValidacaoService';

export const useFaturaPDF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processarFaturaCompleta = async (
    uc: string, 
    documento: string, 
    dataNascimento?: string,
    subscriberId?: string,
    tipoConsulta: 'select' | 'manual' = 'manual'
  ) => {
    setIsLoading(true);
    try {
      console.log('🔍 [FATURA] Iniciando processamento para UC:', uc);
      
      // Verificar se já existe PDF salvo
      const faturaExistente = await getFaturaPDF(uc);
      if (faturaExistente) {
        console.log('📄 [FATURA] PDF existente encontrado, abrindo...');
        window.open(faturaExistente.pdf_combinado_url, '_blank');
        toast({
          title: "PDF encontrado",
          description: "Abrindo PDF salvo anteriormente.",
        });
        return faturaExistente.pdf_combinado_url;
      }

      console.log('🌐 [FATURA] Chamando API para baixar fatura original...');
      
      // Chamar API para baixar fatura original PRIMEIRO
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

      let finalPdfUrl = fatura_url;

      // Tentar gerar PDF customizado apenas se o elemento existir
      try {
        console.log('🎨 [FATURA] Tentando gerar PDF customizado...');
        const customPdfBytes = await generateCustomPDF('invoice-layout');
        console.log('✅ [FATURA] PDF customizado gerado, combinando...');
        
        // Combinar PDFs (customizado + original)
        const combinedPdfBytes = await combinePDFs(fatura_url, customPdfBytes);
        
        // Upload para storage
        const fileName = `fatura_${uc}_${Date.now()}.pdf`;
        finalPdfUrl = await uploadPDFToStorage(combinedPdfBytes, fileName);
        console.log('📤 [FATURA] PDF combinado enviado para storage:', finalPdfUrl);
        
        // Salvar no banco
        await saveFaturaPDF({
          numero_fatura: uc,
          pdf_original_url: fatura_url,
          pdf_customizado_url: null,
          pdf_combinado_url: finalPdfUrl
        });
        console.log('💾 [FATURA] PDF salvo no banco de dados');
        
      } catch (pdfError) {
        console.warn('⚠️ [FATURA] Erro ao gerar PDF customizado, usando original:', pdfError);
        // Se não conseguir gerar o PDF customizado, usa apenas o original
        finalPdfUrl = fatura_url;
      }

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
            pdf_path: `fatura_${uc}_${Date.now()}.pdf`,
            message: message
          });
          
          toast({
            title: "Fatura processada com sucesso!",
            description: "PDF gerado e salvo em 'Faturas em Validação'.",
          });
        } catch (error) {
          console.error('❌ [FATURA] Erro ao salvar em validação:', error);
          toast({
            title: "PDF gerado com sucesso!",
            description: "Mas houve erro ao salvar em validação.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "PDF gerado com sucesso!",
          description: "O PDF foi criado e está sendo exibido.",
        });
      }

      // Abrir PDF na tela
      console.log('🖥️ [FATURA] Abrindo PDF na tela:', finalPdfUrl);
      window.open(finalPdfUrl, '_blank');
      
      return finalPdfUrl;

    } catch (error) {
      console.error('❌ [FATURA] Erro ao processar fatura:', error);
      toast({
        title: "Erro ao processar fatura",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o PDF. Tente novamente.",
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

  return {
    processarFatura,
    processarFaturaCompleta,
    isLoading
  };
};
