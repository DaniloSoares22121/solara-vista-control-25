
import { useState } from 'react';
import { toast } from 'sonner';

interface ExtractionResult {
  data: any;
  apiUsed: 'primary' | 'fallback';
}

export const useInvoiceExtractionFallback = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const extractWithFallback = async (file: File): Promise<ExtractionResult> => {
    setIsExtracting(true);
    setExtractionError(null);

    try {
      console.log('🔄 Tentando API primária...');
      
      // Primeira tentativa - API atual
      const primaryResult = await tryPrimaryAPI(file);
      if (primaryResult) {
        console.log('✅ API primária funcionou');
        return { data: primaryResult, apiUsed: 'primary' };
      }
      
      console.log('❌ API primária falhou, tentando API alternativa...');
      toast.info('Tentando API alternativa para fatura GD2...');
      
      // Segunda tentativa - API alternativa
      const fallbackResult = await tryFallbackAPI(file);
      if (fallbackResult) {
        console.log('✅ API alternativa funcionou');
        toast.success('Dados extraídos usando API alternativa (GD2)');
        return { data: fallbackResult, apiUsed: 'fallback' };
      }
      
      throw new Error('Ambas as APIs falharam na extração');
      
    } catch (error) {
      console.error('❌ Erro na extração com fallback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setExtractionError(errorMessage);
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  const tryPrimaryAPI = async (file: File): Promise<any | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

      const response = await fetch("https://extrator.wattio.com.br/extrator/equatorial/montlhy/", {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Origin": "https://zip.wattio.com.br",
          "Referer": "https://zip.wattio.com.br/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar se a resposta é válida
      if (!data || !data.legal_name) {
        throw new Error('Resposta inválida da API primária');
      }

      return data;
    } catch (error) {
      console.log('🔄 API primária falhou:', error);
      return null;
    }
  };

  const tryFallbackAPI = async (file: File): Promise<any | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://extrator.wattio.com.br/extrator/equatorial/montlhy/", {
        method: "POST",
        headers: {
          "accept": "application/json, text/plain, */*",
          "content-type": "multipart/form-data",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "origin": "https://zip.wattio.com.br",
          "referer": "https://zip.wattio.com.br/",
          "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP na API alternativa: ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar se a resposta é válida
      if (!data || !data.legal_name) {
        throw new Error('Resposta inválida da API alternativa');
      }

      return data;
    } catch (error) {
      console.log('🔄 API alternativa falhou:', error);
      return null;
    }
  };

  return {
    isExtracting,
    extractionError,
    extractWithFallback
  };
};
