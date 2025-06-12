
import { useCallback } from 'react';
import { SubscriberFormData, Address } from '@/types/subscriber';

export const useSubscriberDataMapping = () => {
  const mapAddress = useCallback((addr: any): Address => {
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
      cep: addr.cep || '',
      street: addr.street || addr.endereco || addr.logradouro || '',
      number: addr.number || addr.numero || '',
      complement: addr.complement || addr.complemento || '',
      neighborhood: addr.neighborhood || addr.bairro || '',
      city: addr.city || addr.cidade || addr.localidade || '',
      state: addr.state || addr.estado || addr.uf || '',
    };
  }, []);

  const determineSubscriberType = useCallback((subscriber: any, energyAccount: any): 'person' | 'company' => {
    if (subscriber?.cnpj) return 'company';
    if (energyAccount?.holderType === 'company') return 'company';
    if (energyAccount?.cpfCnpj && energyAccount.cpfCnpj.includes('/')) return 'company';
    return 'person';
  }, []);

  const performAutoFill = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    if (formData.subscriberType === 'person' && formData.personalData) {
      const { cpf, fullName, birthDate, partnerNumber, address } = formData.personalData;
      
      if (cpf && fullName) {
        console.log('🔄 Auto-preenchendo conta de energia (Pessoa Física)');
        return {
          ...formData,
          energyAccount: {
            ...formData.energyAccount,
            holderType: 'person',
            cpfCnpj: cpf,
            holderName: fullName,
            birthDate: birthDate || '',
            partnerNumber: partnerNumber || '',
            address: address.cep ? { ...address } : formData.energyAccount.address,
          }
        };
      }
    } else if (formData.subscriberType === 'company' && formData.companyData) {
      const { cnpj, companyName, partnerNumber, address } = formData.companyData;
      
      if (cnpj && companyName) {
        console.log('🔄 Auto-preenchendo conta de energia (Pessoa Jurídica)');
        return {
          ...formData,
          energyAccount: {
            ...formData.energyAccount,
            holderType: 'company',
            cpfCnpj: cnpj,
            holderName: companyName,
            birthDate: '',
            partnerNumber: partnerNumber || '',
            address: address.cep ? { ...address } : formData.energyAccount.address,
          }
        };
      }
    }
    
    return formData;
  }, []);

  return {
    mapAddress,
    determineSubscriberType,
    performAutoFill
  };
};
