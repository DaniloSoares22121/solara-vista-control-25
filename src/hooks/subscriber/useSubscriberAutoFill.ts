
import { useCallback } from 'react';
import { SubscriberFormData } from '@/types/subscriber';

export const useSubscriberAutoFill = () => {
  const autoFillEnergyAccount = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL ENERGY] Executando auto-fill para conta de energia');
    
    if (formData.subscriberType === 'person' && formData.personalData) {
      const { cpf, fullName, birthDate, partnerNumber, address } = formData.personalData;
      
      if (cpf && fullName) {
        return {
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
      }
    } else if (formData.subscriberType === 'company' && formData.companyData) {
      const { cnpj, companyName, partnerNumber, address } = formData.companyData;
      
      if (cnpj && companyName) {
        return {
          ...formData,
          energyAccount: {
            ...formData.energyAccount,
            holderType: 'company' as const,
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

  const autoFillAdministrator = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL ADMINISTRATOR] Executando auto-fill para administrador');
    
    if (formData.subscriberType !== 'company' || !formData.companyData) {
      return formData;
    }

    if (formData.companyData.address && (!formData.administratorData?.address || !formData.administratorData.address.cep)) {
      return {
        ...formData,
        administratorData: {
          ...formData.administratorData,
          cpf: formData.administratorData?.cpf || '',
          fullName: formData.administratorData?.fullName || '',
          birthDate: formData.administratorData?.birthDate || '',
          maritalStatus: formData.administratorData?.maritalStatus || '',
          profession: formData.administratorData?.profession || '',
          phone: formData.administratorData?.phone || '',
          email: formData.administratorData?.email || '',
          address: formData.companyData.address,
        }
      };
    }
    
    return formData;
  }, []);

  const autoFillTitleTransfer = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL TITLE] Executando auto-fill para transferência');
    
    if (!formData.titleTransfer?.willTransfer || !formData.energyAccount.uc) {
      return formData;
    }

    return {
      ...formData,
      titleTransfer: {
        ...formData.titleTransfer,
        uc: formData.energyAccount.uc,
      }
    };
  }, []);

  const autoFillPlanContract = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL PLAN] Executando auto-fill para contrato');
    
    const updatedFormData = { ...formData };
    
    // Data de adesão automática
    if (!updatedFormData.planContract.adhesionDate) {
      const today = new Date().toISOString().split('T')[0];
      updatedFormData.planContract.adhesionDate = today;
    }
    
    // Modalidade padrão
    if (!updatedFormData.planContract.compensationMode) {
      updatedFormData.planContract.compensationMode = 'autoConsumption';
    }
    
    // Cálculo de desconto baseado no kWh
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
      }
    }
    
    return updatedFormData;
  }, []);

  const autoFillNotifications = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🔄 [AUTO-FILL NOTIFICATIONS] Executando auto-fill para notificações');
    
    const hasContact = (formData.subscriberType === 'person' && formData.personalData?.phone) ||
                      (formData.subscriberType === 'company' && formData.companyData?.phone);
    
    if (hasContact && !formData.notificationSettings.whatsapp.sendInvoices) {
      return {
        ...formData,
        notificationSettings: {
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
        }
      };
    }
    
    return formData;
  }, []);

  const executeAllAutoFills = useCallback((formData: SubscriberFormData): SubscriberFormData => {
    console.log('🚀 [SUBSCRIBER AUTO-FILL] Executando TODAS as automações');
    
    let updatedData = formData;
    updatedData = autoFillEnergyAccount(updatedData);
    updatedData = autoFillAdministrator(updatedData);
    updatedData = autoFillTitleTransfer(updatedData);
    updatedData = autoFillPlanContract(updatedData);
    updatedData = autoFillNotifications(updatedData);
    
    return updatedData;
  }, [autoFillEnergyAccount, autoFillAdministrator, autoFillTitleTransfer, autoFillPlanContract, autoFillNotifications]);

  return {
    autoFillEnergyAccount,
    autoFillAdministrator,
    autoFillTitleTransfer,
    autoFillPlanContract,
    autoFillNotifications,
    executeAllAutoFills
  };
};
