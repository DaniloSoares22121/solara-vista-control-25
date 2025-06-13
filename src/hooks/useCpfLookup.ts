
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
      
      // Usando API ReceitaWS para consulta de CPF
      const response = await fetch(`https://www.receitaws.com.br/v1/cpf/${cleanCpf}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar se houve erro na resposta
      if (data.status === 'ERROR') {
        console.error('❌ Erro na consulta CPF:', data.message);
        toast.error(data.message || 'Erro ao consultar CPF');
        return null;
      }

      // Mapear dados da API para nossa interface
      const cpfData: CpfData = {
        cpf: cleanCpf,
        nome: data.nome || '',
        situacao: data.situacao || 'regular',
        nascimento: data.nascimento || ''
      };
      
      console.log('✅ Dados do CPF encontrados:', cpfData);
      toast.success('Dados do CPF carregados com sucesso!');
      
      return cpfData;
    } catch (error) {
      console.error('❌ Erro ao buscar CPF:', error);
      
      // Fallback para API alternativa se a primeira falhar
      try {
        console.log('🔄 Tentando API alternativa...');
        
        const fallbackResponse = await fetch(`https://api.cpfcnpj.com.br/${cleanCpf}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          
          const cpfData: CpfData = {
            cpf: cleanCpf,
            nome: fallbackData.name || '',
            situacao: fallbackData.status || 'regular',
            nascimento: fallbackData.birthdate || ''
          };
          
          console.log('✅ Dados do CPF encontrados (API alternativa):', cpfData);
          toast.success('Dados do CPF carregados com sucesso!');
          
          return cpfData;
        }
      } catch (fallbackError) {
        console.error('❌ Erro na API alternativa:', fallbackError);
      }
      
      toast.error('Erro ao consultar CPF. Tente novamente em alguns instantes.');
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
