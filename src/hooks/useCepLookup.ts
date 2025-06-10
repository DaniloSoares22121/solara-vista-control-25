
import { useState, useEffect } from 'react';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
}

export const useCepLookup = (cep?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  useEffect(() => {
    if (!cep || cep.length !== 8) {
      setAddressData(null);
      return;
    }

    const lookupCep = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data: CepData = await response.json();

        if (data.erro) {
          setError('CEP não encontrado');
          setAddressData(null);
          return;
        }

        setAddressData({
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          complemento: data.complemento || '',
        });
      } catch (err) {
        setError('Erro ao buscar CEP');
        setAddressData(null);
      } finally {
        setLoading(false);
      }
    };

    lookupCep();
  }, [cep]);

  return { addressData, loading, error };
};
