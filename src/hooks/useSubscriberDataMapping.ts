
import { useCallback } from 'react';
import { SubscriberFormData, Address, SubscriberDataFromDB } from '@/types/subscriber';

export const useSubscriberDataMapping = () => {
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

  const performAutoFill = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL] Executando auto-fill para:', formData.subscriberType);
    
    if (formData.subscriberType === 'person' && formData.personalData) {
      const { cpf, fullName, birthDate, partnerNumber, address } = formData.personalData;
      
      console.log('📋 [AUTO-FILL] Dados PF encontrados:', { cpf, fullName, partnerNumber });
      
      if (cpf && fullName) {
        const updatedFormData = {
          ...formData,
          energyAccount: {
            ...formData.energyAccount,
            holderType: 'person' as const,
            cpfCnpj: cpf,
            holderName: fullName,
            birthDate: birthDate || '',
            partnerNumber: partnerNumber || '',
            address: address.cep ? { ...address } : formData.energyAccount.address,
          }
        };
        
        console.log('✅ [AUTO-FILL] PF - Dados preenchidos automaticamente');
        return updatedFormData;
      }
    } else if (formData.subscriberType === 'company' && formData.companyData) {
      const { cnpj, companyName, partnerNumber, address } = formData.companyData;
      
      console.log('📋 [AUTO-FILL] Dados PJ encontrados:', { cnpj, companyName, partnerNumber });
      
      if (cnpj && companyName) {
        const updatedFormData = {
          ...formData,
          energyAccount: {
            ...formData.energyAccount,
            holderType: 'company' as const,
            cpfCnpj: cnpj,
            holderName: companyName,
            birthDate: '', // PJ não tem data de nascimento
            partnerNumber: partnerNumber || '',
            address: address.cep ? { ...address } : formData.energyAccount.address,
          }
        };
        
        console.log('✅ [AUTO-FILL] PJ - Dados preenchidos automaticamente');
        return updatedFormData;
      }
    }
    
    console.log('⚠️ [AUTO-FILL] Nenhum dado para auto-fill encontrado');
    return formData;
  }, []);

  return {
    mapAddress,
    determineSubscriberType,
    performAutoFill
  };
};
