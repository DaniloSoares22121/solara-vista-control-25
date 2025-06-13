
import { useState } from 'react';
import { toast } from 'sonner';

interface CpfData {
  cpf: string;
  nome: string;
  situacao: string;
  nascimento?: string;
}

export const useCpfLookup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const lookupCpf = async (cpf: string, birthDate?: string): Promise<CpfData | null> => {
    // Se já estiver carregando, não fazer nova requisição
    if (isLoading) {
      console.log('🚫 Requisição CPF já em andamento, cancelando...');
      return null;
    }

    // Remove formatação do CPF
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Validação básica do CPF
    if (cleanCpf.length !== 11) {
      toast.error('CPF deve ter 11 dígitos');
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('🔍 Buscando dados do CPF:', cleanCpf);
      
      // Monta a URL com os parâmetros necessários
      let url = `https://ws.hubdodesenvolvedor.com.br/v2/cpf/?cpf=${cleanCpf}&token=178010265xyYpNHjZEU321392136`;
      
      // Se a data de nascimento for fornecida, adiciona à consulta
      if (birthDate) {
        // Converte a data do formato YYYY-MM-DD para DD/MM/YYYY
        const formattedDate = birthDate.split('-').reverse().join('/');
        url += `&data=${formattedDate}`;
      }
      
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
      
      console.log('📋 Resposta da API CPF:', data);
      
      // Verificar se houve erro na resposta
      if (data.return !== 'OK') {
        console.error('❌ Erro na consulta CPF:', data.message || 'Erro desconhecido');
        
        // Mensagens de erro específicas
        const errorMessages: { [key: string]: string } = {
          'Parametro Invalido.': 'Parâmetros inválidos. Verifique o CPF.',
          'CPF Inválido.': 'CPF não encontrado na Receita Federal.',
          'Data Nascimento Inválida': 'Data de nascimento inválida.',
          'Token Inválido ou sem saldo para a consulta.': 'Token sem saldo ou inválido.',
          'Limite Excedido': 'Limite de consultas excedido. Tente novamente em alguns minutos.',
          'Timeout.': 'Timeout na consulta. Tente novamente.',
        };
        
        const errorMessage = errorMessages[data.message] || data.message || 'Erro ao consultar CPF';
        toast.error(errorMessage);
        return null;
      }

      // Mapear dados da API para nossa interface
      const cpfData: CpfData = {
        cpf: data.result.numero_de_cpf || cleanCpf,
        nome: data.result.nome_da_pf || '',
        situacao: data.result.situacao_cadastral?.toLowerCase() || 'regular',
        nascimento: data.result.data_nascimento || ''
      };
      
      console.log('✅ Dados do CPF encontrados:', cpfData);
      toast.success(`Dados do CPF carregados! Consumidos ${data.consumed} crédito(s).`);
      
      return cpfData;
    } catch (error) {
      console.error('❌ Erro ao buscar CPF:', error);
      toast.error('Erro ao consultar CPF. Verifique sua conexão e tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupCpf,
    isLoading,
  };
};
