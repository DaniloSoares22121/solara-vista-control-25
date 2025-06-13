
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

  const performAutoFillEnergyAccount = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL ENERGY] Executando auto-fill COMPLETO para conta de energia');
    
    if (formData.subscriberType === 'person' && formData.personalData) {
      const { cpf, fullName, birthDate, partnerNumber, address } = formData.personalData;
      
      console.log('📋 [AUTO-FILL ENERGY] Dados PF encontrados:', { cpf, fullName, partnerNumber });
      
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
        
        console.log('✅ [AUTO-FILL ENERGY] PF - Dados preenchidos automaticamente');
        return updatedFormData;
      }
    } else if (formData.subscriberType === 'company' && formData.companyData) {
      const { cnpj, companyName, partnerNumber, address } = formData.companyData;
      
      console.log('📋 [AUTO-FILL ENERGY] Dados PJ encontrados:', { cnpj, companyName, partnerNumber });
      
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
        
        console.log('✅ [AUTO-FILL ENERGY] PJ - Dados preenchidos automaticamente');
        return updatedFormData;
      }
    }
    
    console.log('⚠️ [AUTO-FILL ENERGY] Nenhum dado para auto-fill encontrado');
    return formData;
  }, []);

  const performAutoFillAdministrator = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL ADMINISTRATOR] Executando auto-fill para administrador');
    
    if (formData.subscriberType !== 'company' || !formData.companyData) {
      return formData;
    }

    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO: Endereço do administrador = endereço da empresa (se não preenchido)
    if (formData.companyData.address && (!updatedFormData.administratorData?.address || !updatedFormData.administratorData.address.cep)) {
      if (!updatedFormData.administratorData) {
        updatedFormData.administratorData = {
          cpf: '',
          fullName: '',
          birthDate: '',
          maritalStatus: '',
          profession: '',
          phone: '',
          email: '',
          address: formData.companyData.address,
        };
      } else if (!updatedFormData.administratorData.address || !updatedFormData.administratorData.address.cep) {
        updatedFormData.administratorData.address = formData.companyData.address;
      }
      console.log('✅ [AUTO-FILL ADMINISTRATOR] Endereço do administrador preenchido');
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillTitleTransfer = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL TITLE] Executando auto-fill para transferência de titularidade');
    
    if (!formData.titleTransfer?.willTransfer) {
      return formData;
    }

    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO: UC da transferência = UC da conta original
    if (formData.energyAccount.uc && !updatedFormData.titleTransfer.uc) {
      updatedFormData.titleTransfer.uc = formData.energyAccount.uc;
      console.log('✅ [AUTO-FILL TITLE] UC sincronizada para transferência');
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillPlanContract = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL PLAN] Executando auto-fill para contrato do plano');
    
    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO: Data de adesão automática (hoje) se não preenchida
    if (!updatedFormData.planContract.adhesionDate) {
      const today = new Date().toISOString().split('T')[0];
      updatedFormData.planContract.adhesionDate = today;
      console.log('✅ [AUTO-FILL PLAN] Data de adesão preenchida automaticamente');
    }
    
    // AUTOMAÇÃO: Modalidade padrão baseada no tipo
    if (!updatedFormData.planContract.compensationMode) {
      updatedFormData.planContract.compensationMode = 'autoConsumption';
      console.log('✅ [AUTO-FILL PLAN] Modalidade padrão definida');
    }
    
    // AUTOMAÇÃO: Cálculo automático de desconto baseado no kWh informado
    if (updatedFormData.planContract.informedKwh > 0 && !updatedFormData.planContract.discountPercentage) {
      const kwh = updatedFormData.planContract.informedKwh;
      const loyalty = updatedFormData.planContract.loyalty || 'none';
      
      let percentage = 0;
      if (kwh >= 7000) {
        percentage = loyalty === 'twoYears' ? 27 : loyalty === 'oneYear' ? 25 : 22;
      } else if (kwh >= 3100) {
        percentage = loyalty === 'twoYears' ? 25 : loyalty === 'oneYear' ? 22 : 20;
      } else if (kwh >= 1100) {
        percentage = loyalty === 'twoYears' ? 22 : loyalty === 'oneYear' ? 20 : 18;
      } else if (kwh >= 600) {
        percentage = loyalty === 'twoYears' ? 20 : loyalty === 'oneYear' ? 18 : 15;
      } else if (kwh >= 400) {
        percentage = loyalty === 'twoYears' ? 20 : loyalty === 'oneYear' ? 15 : 13;
      }
      
      if (percentage > 0) {
        updatedFormData.planContract.discountPercentage = percentage;
        console.log(`✅ [AUTO-FILL PLAN] Desconto calculado automaticamente: ${percentage}%`);
      }
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillNotifications = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL NOTIFICATIONS] Executando auto-fill para notificações');
    
    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO: Template padrão de notificações baseado no tipo de assinante
    const hasWhatsAppOrEmail = (formData.subscriberType === 'person' && formData.personalData?.phone) ||
                              (formData.subscriberType === 'company' && formData.companyData?.phone);
    
    if (hasWhatsAppOrEmail && !updatedFormData.notificationSettings.whatsapp.sendInvoices) {
      // Template padrão otimizado
      updatedFormData.notificationSettings = {
        whatsapp: {
          sendInvoices: true,
          paymentReceived: true,
          createCharge: true,
          changeValueOrDate: true,
          oneDayBefore: true,
          onVencimentoDay: true,
          oneDayAfter: true,
          threeDaysAfter: true,
          fiveDaysAfter: false,
          sevenDaysAfter: false,
          fifteenDaysAfter: false,
          twentyDaysAfter: false,
          twentyFiveDaysAfter: false,
          thirtyDaysAfter: false,
          afterThirtyDays: false,
        },
        email: {
          createCharge: true,
          changeValueOrDate: true,
          oneDayBefore: true,
          onVencimentoDay: true,
          oneDayAfter: true,
          threeDaysAfter: false,
          fiveDaysAfter: false,
          sevenDaysAfter: false,
          fifteenDaysAfter: false,
          twentyDaysAfter: false,
          twentyFiveDaysAfter: false,
          thirtyDaysAfter: false,
          afterThirtyDays: false,
        }
      };
      console.log('✅ [AUTO-FILL NOTIFICATIONS] Template padrão aplicado');
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillAll = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL ALL] Aplicando TODAS as automações de assinante');
    
    let updatedFormData = { ...formData };
    
    // Aplicar todas as automações em sequência
    updatedFormData = performAutoFillEnergyAccount(updatedFormData);
    updatedFormData = performAutoFillAdministrator(updatedFormData);
    updatedFormData = performAutoFillTitleTransfer(updatedFormData);
    updatedFormData = performAutoFillPlanContract(updatedFormData);
    updatedFormData = performAutoFillNotifications(updatedFormData);
    
    console.log('✅ [AUTO-FILL ALL] Todas as automações aplicadas');
    return updatedFormData;
  }, [
    performAutoFillEnergyAccount,
    performAutoFillAdministrator,
    performAutoFillTitleTransfer,
    performAutoFillPlanContract,
    performAutoFillNotifications
  ]);

  // Manter função antiga para compatibilidade
  const performAutoFill = performAutoFillEnergyAccount;

  return {
    mapAddress,
    determineSubscriberType,
    performAutoFill,
    performAutoFillEnergyAccount,
    performAutoFillAdministrator,
    performAutoFillTitleTransfer,
    performAutoFillPlanContract,
    performAutoFillNotifications,
    performAutoFillAll
  };
};
