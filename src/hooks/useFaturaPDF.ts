
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
      // Verificar se já existe PDF salvo
      const faturaExistente = await getFaturaPDF(uc);
      if (faturaExistente) {
        window.open(faturaExistente.pdf_combinado_url, '_blank');
        toast({
          title: "PDF encontrado",
          description: "Abrindo PDF salvo anteriormente.",
        });
        return faturaExistente.pdf_combinado_url;
      }

      // Gerar PDF customizado do layout
      const customPdfBytes = await generateCustomPDF('invoice-layout');
      
      // Chamar API para baixar fatura original
      const response = await supabase.functions.invoke('baixar-fatura', {
        body: {
          uc,
          documento,
          data_nascimento: dataNascimento
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { fatura_url, message } = response.data;

      // Combinar PDFs (customizado + original)
      const combinedPdfBytes = await combinePDFs(fatura_url, customPdfBytes);
      
      // Upload para storage
      const fileName = `fatura_${uc}_${Date.now()}.pdf`;
      const pdfUrl = await uploadPDFToStorage(combinedPdfBytes, fileName);
      
      // Salvar no banco
      await saveFaturaPDF({
        numero_fatura: uc,
        pdf_original_url: fatura_url,
        pdf_customizado_url: null,
        pdf_combinado_url: pdfUrl
      });

      // Se for de assinante cadastrado, salvar em validação
      if (tipoConsulta === 'select' && subscriberId) {
        try {
          await faturaValidacaoService.createFaturaValidacao({
            subscriber_id: subscriberId,
            uc: uc,
            documento: documento,
            data_nascimento: dataNascimento,
            tipo_pessoa: dataNascimento ? 'fisica' : 'juridica',
            fatura_url: pdfUrl, // Usar o PDF combinado
            pdf_path: fileName,
            message: message
          });
          
          toast({
            title: "Fatura processada com sucesso!",
            description: "PDF gerado e salvo em 'Faturas em Validação'.",
          });
        } catch (error) {
          console.error('Erro ao salvar em validação:', error);
          toast({
            title: "PDF gerado com sucesso!",
            description: "Mas houve erro ao salvar em validação.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "PDF gerado com sucesso!",
          description: "O PDF combinado foi criado e está sendo exibido.",
        });
      }

      // Abrir PDF na tela
      window.open(pdfUrl, '_blank');
      
      return pdfUrl;

    } catch (error) {
      console.error('Erro ao processar fatura:', error);
      toast({
        title: "Erro ao processar fatura",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
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
