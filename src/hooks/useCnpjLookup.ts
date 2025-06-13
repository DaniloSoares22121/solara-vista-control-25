
import { useState } from 'react';
import { toast } from 'sonner';

interface CnpjData {
  cnpj: string;
  nome: string;
  fantasia?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone?: string;
  email?: string;
}

export const useCnpjLookup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const lookupCnpj = async (cnpj: string): Promise<CnpjData | null> => {
    // Se já estiver carregando, não fazer nova requisição
    if (isLoading) {
      console.log('🚫 Requisição já em andamento, cancelando...');
      return null;
    }

    // Remove formatação do CNPJ
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    // Validação básica do CNPJ
    if (cleanCnpj.length !== 14) {
      toast.error('CNPJ deve ter 14 dígitos');
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('🔍 Buscando dados do CNPJ:', cleanCnpj);
      
      // Usando API alternativa que suporta CORS
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cleanCnpj}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Muitas consultas realizadas. Aguarde alguns minutos.');
          return null;
        }
        throw new Error('Erro na consulta do CNPJ');
      }
      
      const data = await response.json();
      
      if (data.status === 400 || data.erro) {
        toast.error('CNPJ não encontrado ou inválido');
        return null;
      }
      
      console.log('✅ Dados do CNPJ encontrados:', data);
      toast.success('CNPJ encontrado! Dados preenchidos automaticamente.');
      
      // Mapeamento dos dados da API publica.cnpj.ws
      return {
        cnpj: data.estabelecimento?.cnpj || cleanCnpj,
        nome: data.razao_social || '',
        fantasia: data.estabelecimento?.nome_fantasia || '',
        logradouro: data.estabelecimento?.logradouro || '',
        numero: data.estabelecimento?.numero || '',
        complemento: data.estabelecimento?.complemento || '',
        bairro: data.estabelecimento?.bairro || '',
        municipio: data.estabelecimento?.cidade?.nome || '',
        uf: data.estabelecimento?.estado?.sigla || '',
        cep: data.estabelecimento?.cep || '',
        telefone: data.estabelecimento?.telefone1 || '',
        email: data.estabelecimento?.email || '',
      };
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      
      // Fallback para API BrasilAPI apenas se não for erro de rate limit
      try {
        console.log('🔄 Tentando API alternativa...');
        const fallbackResponse = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
        
        if (!fallbackResponse.ok) {
          throw new Error('Erro na consulta do CNPJ - API alternativa');
        }
        
        const fallbackData = await fallbackResponse.json();
        console.log('✅ Dados encontrados via API alternativa:', fallbackData);
        toast.success('CNPJ encontrado! Dados preenchidos automaticamente.');
        
        return {
          cnpj: fallbackData.cnpj || cleanCnpj,
          nome: fallbackData.razao_social || '',
          fantasia: fallbackData.nome_fantasia || '',
          logradouro: fallbackData.logradouro || '',
          numero: fallbackData.numero || '',
          complemento: fallbackData.complemento || '',
          bairro: fallbackData.bairro || '',
          municipio: fallbackData.municipio || '',
          uf: fallbackData.uf || '',
          cep: fallbackData.cep || '',
          telefone: fallbackData.ddd_telefone_1 || '',
          email: fallbackData.email || '',
        };
      } catch (fallbackError) {
        console.error('Erro na API alternativa:', fallbackError);
        toast.error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.');
        return null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupCnpj,
    isLoading,
  };
};
