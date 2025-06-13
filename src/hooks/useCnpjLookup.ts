
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
      
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCnpj}`);
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CNPJ');
      }
      
      const data = await response.json();
      
      if (data.status === 'ERROR') {
        toast.error(data.message || 'CNPJ não encontrado');
        return null;
      }
      
      console.log('✅ Dados do CNPJ encontrados:', data);
      
      return {
        cnpj: data.cnpj,
        nome: data.nome,
        fantasia: data.fantasia,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep,
        telefone: data.telefone,
        email: data.email,
      };
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      toast.error('Erro ao consultar CNPJ. Tente novamente.');
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
