
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
      toast.error('CEP deve ter 8 dígitos');
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
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar CEP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookupCep, loading };
};
