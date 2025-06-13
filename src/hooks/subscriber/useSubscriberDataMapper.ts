
import { useCallback } from 'react';
import { Address, SubscriberDataFromDB } from '@/types/subscriber';

export const useSubscriberDataMapper = () => {
  const mapAddress = useCallback((addr: Record<string, unknown> | null | undefined): Address => {
    if (!addr) return {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };
    
    return {
      cep: (addr.cep as string) || '',
      street: (addr.street as string) || (addr.endereco as string) || (addr.logradouro as string) || '',
      number: (addr.number as string) || (addr.numero as string) || '',
      complement: (addr.complement as string) || (addr.complemento as string) || '',
      neighborhood: (addr.neighborhood as string) || (addr.bairro as string) || '',
      city: (addr.city as string) || (addr.cidade as string) || (addr.localidade as string) || '',
      state: (addr.state as string) || (addr.estado as string) || (addr.uf as string) || '',
    };
  }, []);

  const determineSubscriberType = useCallback((subscriber: Record<string, unknown>, energyAccount: Record<string, unknown>): 'person' | 'company' => {
    if (subscriber?.cnpj) return 'company';
    if (energyAccount?.holderType === 'company') return 'company';
    if (energyAccount?.cpfCnpj && typeof energyAccount.cpfCnpj === 'string' && energyAccount.cpfCnpj.includes('/')) return 'company';
    return 'person';
  }, []);

  return {
    mapAddress,
    determineSubscriberType
  };
};
