
import { useState } from 'react';

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
      console.log('❌ CPF deve ter 11 dígitos');
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
      
      return cpfData;
    } catch (error) {
      console.error('❌ Erro ao buscar CPF:', error);
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
