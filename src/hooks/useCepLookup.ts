
import { useState } from 'react';
import { toast } from 'sonner';

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const useCepLookup = () => {
  const [loading, setLoading] = useState(false);

  const lookupCep = async (cep: string): Promise<CepResponse | null> => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return null;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return null;
      }
      
      toast.success('CEP encontrado! Endereço preenchido automaticamente.');
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar CEP. Verifique sua conexão.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatCep = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{5})(\d{3})$/);
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return cleaned;
  };

  return { lookupCep, loading, formatCep };
};
