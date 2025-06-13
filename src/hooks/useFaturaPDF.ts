
import { useState } from 'react';
import { generateCustomPDF, combinePDFs, uploadPDFToStorage, saveFaturaPDF, getFaturaPDF } from '@/services/pdfService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useFaturaPDF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processarFatura = async (uc: string, documento: string, dataNascimento?: string) => {
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
        return;
      }

      // Gerar PDF customizado
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

      const { fatura_url } = response.data;

      // Combinar PDFs
      const combinedPdfBytes = await combinePDFs(fatura_url, customPdfBytes);
      
      // Upload para storage
      const fileName = `fatura_${uc}_${Date.now()}.pdf`;
      const pdfUrl = await uploadPDFToStorage(combinedPdfBytes, fileName);
      
      // Salvar no banco
      await saveFaturaPDF({
        numero_fatura: uc,
        pdf_original_url: fatura_url,
        pdf_customizado_url: '', // Poderia salvar separadamente se necessário
        pdf_combinado_url: pdfUrl
      });

      // Abrir PDF
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O PDF foi salvo e está sendo exibido.",
      });

    } catch (error) {
      console.error('Erro ao processar fatura:', error);
      toast({
        title: "Erro ao processar fatura",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processarFatura,
    isLoading
  };
};
