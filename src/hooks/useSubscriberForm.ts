import { useState, useCallback } from 'react';
import { SubscriberFormData, Contact, Address } from '@/types/subscriber';
import { useCepLookup } from '@/hooks/useCepLookup';
import { subscriberService } from '@/services/supabaseSubscriberService';
import { toast } from 'sonner';

const defaultNotificationSettings = {
  whatsapp: {
    sendInvoices: true,
    paymentReceived: false,
    createCharge: true,
    changeValueOrDate: true,
    oneDayBefore: true,
    onVencimentoDay: true,
    oneDayAfter: true,
    threeDaysAfter: true,
    fiveDaysAfter: true,
    sevenDaysAfter: true,
    fifteenDaysAfter: true,
    twentyDaysAfter: true,
    twentyFiveDaysAfter: true,
    thirtyDaysAfter: true,
    afterThirtyDays: true,
  },
  email: {
    createCharge: true,
    changeValueOrDate: true,
    oneDayBefore: true,
    onVencimentoDay: true,
    oneDayAfter: true,
    threeDaysAfter: true,
    fiveDaysAfter: true,
    sevenDaysAfter: true,
    fifteenDaysAfter: true,
    twentyDaysAfter: true,
    twentyFiveDaysAfter: true,
    thirtyDaysAfter: true,
    afterThirtyDays: true,
  },
};

const initialFormData: SubscriberFormData = {
  concessionaria: 'equatorial-goias',
  subscriberType: 'person',
  energyAccount: {
    holderType: 'person',
    cpfCnpj: '',
    holderName: '',
    uc: '',
    partnerNumber: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  },
  titleTransfer: {
    willTransfer: false,
  },
  planContract: {
    selectedPlan: '',
    compensationMode: 'autoConsumption',
    adhesionDate: '',
    informedKwh: 0,
    contractedKwh: 0,
    loyalty: 'none',
  },
  planDetails: {
    paysPisAndCofins: true,
    paysWireB: false,
    addDistributorValue: false,
    exemptFromPayment: false,
  },
  notificationSettings: defaultNotificationSettings,
  attachments: {},
};

export const useSubscriberForm = () => {
  const [formData, setFormData] = useState<SubscriberFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lookupCep } = useCepLookup();

  const updateFormData = useCallback((section: keyof SubscriberFormData, data: any) => {
    setFormData(prev => {
      const currentSectionData = prev[section];
      
      // Ensure we're only spreading object types
      if (typeof data === 'object' && data !== null && typeof currentSectionData === 'object' && currentSectionData !== null) {
        return {
          ...prev,
          [section]: { ...currentSectionData, ...data }
        };
      } else {
        return {
          ...prev,
          [section]: data
        };
      }
    });
  }, []);

  const handleCepLookup = useCallback(async (cep: string, addressType: 'personal' | 'company' | 'administrator' | 'energy') => {
    // Remove any non-digit characters from CEP
    const cleanCep = cep.replace(/\D/g, '');
    
    // Only lookup if we have a complete CEP (8 digits)
    if (cleanCep.length === 8) {
      const cepData = await lookupCep(cleanCep);
      if (cepData) {
        const addressUpdate = {
          cep: cepData.cep,
          street: cepData.logradouro,
          neighborhood: cepData.bairro,
          city: cepData.localidade,
          state: cepData.uf,
        };

        switch (addressType) {
          case 'personal':
            if (formData.personalData?.address) {
              const currentAddress = formData.personalData.address;
              const newAddress: Address = { ...currentAddress, ...addressUpdate };
              updateFormData('personalData', {
                address: newAddress
              });
            }
            break;
          case 'company':
            if (formData.companyData?.address) {
              const currentAddress = formData.companyData.address;
              const newAddress: Address = { ...currentAddress, ...addressUpdate };
              updateFormData('companyData', {
                address: newAddress
              });
            }
            break;
          case 'administrator':
            if (formData.administratorData?.address) {
              const currentAddress = formData.administratorData.address;
              const newAddress: Address = { ...currentAddress, ...addressUpdate };
              updateFormData('administratorData', {
                address: newAddress
              });
            }
            break;
          case 'energy':
            if (formData.energyAccount.address) {
              const currentEnergyAddress = formData.energyAccount.address;
              const newAddress: Address = { ...currentEnergyAddress, ...addressUpdate };
              updateFormData('energyAccount', {
                address: newAddress
              });
            }
            break;
        }
      }
    }
  }, [formData, lookupCep, updateFormData]);

  const addContact = useCallback((type: 'personal' | 'company') => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      role: '',
    };

    if (type === 'personal' && formData.personalData) {
      const contacts = [...(formData.personalData.contacts || []), newContact];
      if (contacts.length <= 5) {
        updateFormData('personalData', { contacts });
      } else {
        toast.error('Máximo de 5 contatos permitidos');
      }
    } else if (type === 'company' && formData.companyData) {
      const contacts = [...(formData.companyData.contacts || []), newContact];
      if (contacts.length <= 5) {
        updateFormData('companyData', { contacts });
      } else {
        toast.error('Máximo de 5 contatos permitidos');
      }
    }
  }, [formData, updateFormData]);

  const removeContact = useCallback((type: 'personal' | 'company', contactId: string) => {
    if (type === 'personal' && formData.personalData) {
      const contacts = formData.personalData.contacts?.filter(c => c.id !== contactId) || [];
      updateFormData('personalData', { contacts });
    } else if (type === 'company' && formData.companyData) {
      const contacts = formData.companyData.contacts?.filter(c => c.id !== contactId) || [];
      updateFormData('companyData', { contacts });
    }
  }, [formData, updateFormData]);

  const autoFillEnergyAccount = useCallback(() => {
    if (formData.subscriberType === 'person' && formData.personalData) {
      updateFormData('energyAccount', {
        holderType: 'person',
        cpfCnpj: formData.personalData.cpf,
        holderName: formData.personalData.fullName,
        birthDate: formData.personalData.birthDate,
        partnerNumber: formData.personalData.partnerNumber,
        address: formData.personalData.address ? { 
          ...formData.personalData.address,
          // Ensure all required fields are present
          cep: formData.personalData.address.cep || '',
          street: formData.personalData.address.street || '',
          number: formData.personalData.address.number || '',
          complement: formData.personalData.address.complement || '',
          neighborhood: formData.personalData.address.neighborhood || '',
          city: formData.personalData.address.city || '',
          state: formData.personalData.address.state || '',
        } : {
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
        },
      });
      toast.success('Dados da conta de energia preenchidos automaticamente!');
    } else if (formData.subscriberType === 'company' && formData.companyData) {
      updateFormData('energyAccount', {
        holderType: 'company',
        cpfCnpj: formData.companyData.cnpj,
        holderName: formData.companyData.companyName,
        partnerNumber: formData.companyData.partnerNumber,
        address: formData.companyData.address ? { 
          ...formData.companyData.address,
          // Ensure all required fields are present
          cep: formData.companyData.address.cep || '',
          street: formData.companyData.address.street || '',
          number: formData.companyData.address.number || '',
          complement: formData.companyData.address.complement || '',
          neighborhood: formData.companyData.address.neighborhood || '',
          city: formData.companyData.address.city || '',
          state: formData.companyData.address.state || '',
        } : {
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
        },
      });
      toast.success('Dados da conta de energia preenchidos automaticamente!');
    } else {
      toast.error('Preencha primeiro os dados do assinante para poder usar o preenchimento automático.');
    }
  }, [formData, updateFormData]);

  // Enhanced CEP auto-lookup that triggers when CEP is complete
  const handleCepChange = useCallback(async (cep: string, addressType: 'personal' | 'company' | 'administrator' | 'energy') => {
    const cleanCep = cep.replace(/\D/g, '');
    
    // Update the CEP field first
    switch (addressType) {
      case 'personal':
        if (formData.personalData?.address) {
          updateFormData('personalData', {
            address: { ...formData.personalData.address, cep }
          });
        }
        break;
      case 'company':
        if (formData.companyData?.address) {
          updateFormData('companyData', {
            address: { ...formData.companyData.address, cep }
          });
        }
        break;
      case 'administrator':
        if (formData.administratorData?.address) {
          updateFormData('administratorData', {
            address: { ...formData.administratorData.address, cep }
          });
        }
        break;
      case 'energy':
        if (formData.energyAccount.address) {
          updateFormData('energyAccount', {
            address: { ...formData.energyAccount.address, cep }
          });
        }
        break;
    }

    // Auto-lookup if CEP is complete
    if (cleanCep.length === 8) {
      await handleCepLookup(cep, addressType);
    }
  }, [formData, updateFormData, handleCepLookup]);

  const validateStep = useCallback((step: number): boolean => {
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
        return true; // Troca de titularidade é opcional
      case 6:
        return !!(formData.planContract.selectedPlan && formData.planContract.informedKwh && formData.planContract.contractedKwh);
      case 7:
        return true; // Detalhes do plano têm padrões
      case 8:
        return true; // Notificações têm padrões
      case 9:
        const requiredAttachments = ['contract', 'bill'];
        if (formData.subscriberType === 'person') requiredAttachments.push('cnh');
        if (formData.subscriberType === 'company') requiredAttachments.push('companyContract');
        if (formData.titleTransfer.willTransfer) requiredAttachments.push('procuration');
        
        return requiredAttachments.every(key => formData.attachments[key as keyof typeof formData.attachments]);
      default:
        return false;
    }
  }, [formData]);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await subscriberService.createSubscriber(formData);
      toast.success('Assinante cadastrado com sucesso!');
      
      // Reset form
      setFormData(initialFormData);
      setCurrentStep(1);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Erro ao cadastrar assinante. Tente novamente.');
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return {
    formData,
    currentStep,
    isSubmitting,
    setCurrentStep,
    updateFormData,
    handleCepLookup,
    handleCepChange,
    addContact,
    removeContact,
    autoFillEnergyAccount,
    validateStep,
    submitForm,
  };
};
