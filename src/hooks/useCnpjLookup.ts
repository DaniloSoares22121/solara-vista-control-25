
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
  situacao?: string;
  tipo?: string;
  abertura?: string;
  atividade_principal?: {
    code: string;
    text: string;
  };
}

export const useCnpjLookup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const lookupCnpj = async (cnpj: string): Promise<CnpjData | null> => {
    // Se já estiver carregando, não fazer nova requisição
    if (isLoading) {
      console.log('🚫 Requisição CNPJ já em andamento, cancelando...');
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
      
      // Monta a URL com o token fornecido
      const url = `https://ws.hubdodesenvolvedor.com.br/v2/cnpj/?cnpj=${cleanCnpj}&token=178010265xyYpNHjZEU321392136`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📋 Resposta da API CNPJ:', data);
      
      // Verificar se houve erro na resposta
      if (data.return !== 'OK') {
        console.error('❌ Erro na consulta CNPJ:', data.message || 'Erro desconhecido');
        
        // Mensagens de erro específicas
        const errorMessages: { [key: string]: string } = {
          'Parametro Invalido.': 'Parâmetros inválidos. Verifique o CNPJ.',
          'CNPJ Nao existe.': 'CNPJ não encontrado na Receita Federal.',
          'Token Inválido ou sem saldo para a consulta.': 'Token sem saldo ou inválido.',
          'Limite Excedido': 'Limite de consultas excedido. Tente novamente em alguns minutos.',
          'Timeout.': 'Timeout na consulta. Tente novamente.',
          'Consulta não retornou': 'Serviço temporariamente indisponível.',
        };
        
        const errorMessage = errorMessages[data.message] || data.message || 'Erro ao consultar CNPJ';
        toast.error(errorMessage);
        return null;
      }

      // Mapear dados da API para nossa interface
      const cnpjData: CnpjData = {
        cnpj: data.result.numero_de_inscricao || cleanCnpj,
        nome: data.result.nome || '',
        fantasia: data.result.fantasia || '',
        logradouro: data.result.logradouro || '',
        numero: data.result.numero || '',
        complemento: data.result.complemento || '',
        bairro: data.result.bairro || '',
        municipio: data.result.municipio || '',
        uf: data.result.uf || '',
        cep: data.result.cep?.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2') || '',
        telefone: data.result.telefone || '',
        email: data.result.email || '',
        situacao: data.result.situacao || '',
        tipo: data.result.tipo || '',
        abertura: data.result.abertura || '',
        atividade_principal: data.result.atividade_principal || undefined,
      };
      
      console.log('✅ Dados do CNPJ encontrados:', cnpjData);
      toast.success(`Dados do CNPJ carregados! Consumidos ${data.consumed} crédito(s).`);
      
      return cnpjData;
    } catch (error) {
      console.error('❌ Erro ao buscar CNPJ:', error);
      toast.error('Erro ao consultar CNPJ. Verifique sua conexão e tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupCnpj,
    isLoading,
  };
};
