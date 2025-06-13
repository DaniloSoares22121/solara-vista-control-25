
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

  const lookupCpf = async (cpf: string): Promise<CpfData | null> => {
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
      
      // Usando API pública para consulta de CPF (simulada - APIs reais de CPF são restritas)
      // Em produção, você precisaria de uma API autorizada para consultar dados de CPF
      
      // Por enquanto, vamos simular uma resposta baseada no CPF
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da API
      
      // Simulação de dados (em produção seria uma API real autorizada)
      const mockData = {
        cpf: cleanCpf,
        nome: 'Nome será preenchido manualmente',
        situacao: 'regular',
        nascimento: ''
      };
      
      console.log('✅ Dados do CPF simulados:', mockData);
      toast.info('Funcionalidade de CPF preparada. Em produção seria integrada com API autorizada.');
      
      return mockData;
    } catch (error) {
      console.error('Erro ao buscar CPF:', error);
      toast.error('Serviço de consulta CPF temporariamente indisponível.');
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
