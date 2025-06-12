
import { useCallback } from 'react';
import { SubscriberFormData } from '@/types/subscriber';

const validateAttachments = (formData: SubscriberFormData): boolean => {
  const requiredAttachments = ['contract', 'bill'];
  
  if (formData.subscriberType === 'person') {
    requiredAttachments.push('cnh');
  }
  
  if (formData.subscriberType === 'company') {
    requiredAttachments.push('companyContract');
  }
  
  if (formData.titleTransfer.willTransfer) {
    requiredAttachments.push('procuration');
  }
  
  return requiredAttachments.every(key => 
    formData.attachments[key as keyof typeof formData.attachments]
  );
};

export const useSubscriberFormValidation = () => {
  const validateStep = useCallback((step: number, formData: SubscriberFormData, isEditing: boolean): boolean => {
    switch (step) {
      case 1:
        return !!formData.concessionaria;
        
      case 2:
        return !!formData.subscriberType;
        
      case 3:
        if (formData.subscriberType === 'person') {
          return !!(formData.personalData?.cpf && formData.personalData?.fullName && formData.personalData?.email);
        } else {
          return !!(formData.companyData?.cnpj && formData.companyData?.companyName && formData.administratorData?.cpf);
        }
        
      case 4:
        return !!(formData.energyAccount.uc && formData.energyAccount.cpfCnpj && formData.energyAccount.holderName);
        
      case 5:
        return true; // Transferência é opcional
        
      case 6:
        return !!(formData.planContract.selectedPlan && formData.planContract.contractedKwh > 0);
        
      case 7:
      case 8:
        return true; // Configurações são opcionais
        
      case 9:
        if (isEditing) return true; // Na edição, anexos são opcionais
        return validateAttachments(formData);
        
      default:
        return false;
    }
  }, []);

  return { validateStep };
};
