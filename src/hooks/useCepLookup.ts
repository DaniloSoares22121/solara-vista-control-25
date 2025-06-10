
import { useState } from 'react';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useCepLookup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCep = async (cep: string) => {
    if (!cep || cep.length !== 9) return null;

    setLoading(true);
    setError(null);

    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: CepData = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return {
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento || '',
      };
    } catch (err) {
      setError('Erro ao buscar CEP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookupCep, loading, error };
};
