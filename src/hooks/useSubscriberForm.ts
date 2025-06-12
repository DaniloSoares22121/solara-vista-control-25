
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
  personalData: {
    cpf: '',
    partnerNumber: '',
    fullName: '',
    birthDate: '',
    maritalStatus: '',
    profession: '',
    phone: '',
    email: '',
    observations: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    contacts: [],
  },
  companyData: {
    cnpj: '',
    partnerNumber: '',
    companyName: '',
    fantasyName: '',
    phone: '',
    email: '',
    observations: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    contacts: [],
  },
  administratorData: {
    cpf: '',
    fullName: '',
    birthDate: '',
    maritalStatus: '',
    profession: '',
    phone: '',
    email: '',
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
  energyAccount: {
    holderType: 'person',
    cpfCnpj: '',
    holderName: '',
    birthDate: '',
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
    discountPercentage: 0,
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
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      console.log('Fazendo lookup do CEP:', cleanCep, 'para tipo:', addressType);
      try {
        const cepData = await lookupCep(cleanCep);
        console.log('Dados retornados do CEP:', cepData);
        
        if (cepData) {
          const addressUpdate = {
            cep: cepData.cep,
            street: cepData.logradouro,
            neighborhood: cepData.bairro,
            city: cepData.localidade,
            state: cepData.uf,
          };

          console.log('Atualizando endereço para:', addressType, addressUpdate);

          setFormData(prev => {
            const newFormData = { ...prev };
            
            switch (addressType) {
              case 'personal':
                if (newFormData.personalData?.address) {
                  newFormData.personalData.address = { ...newFormData.personalData.address, ...addressUpdate };
                }
                break;
              case 'company':
                if (newFormData.companyData?.address) {
                  newFormData.companyData.address = { ...newFormData.companyData.address, ...addressUpdate };
                }
                break;
              case 'administrator':
                if (newFormData.administratorData?.address) {
                  newFormData.administratorData.address = { ...newFormData.administratorData.address, ...addressUpdate };
                }
                break;
              case 'energy':
                if (newFormData.energyAccount.address) {
                  newFormData.energyAccount.address = { ...newFormData.energyAccount.address, ...addressUpdate };
                }
                break;
            }
            
            return newFormData;
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  }, [lookupCep]);

  const addContact = useCallback((type: 'personal' | 'company') => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      role: '',
    };

    setFormData(prev => {
      const newFormData = { ...prev };
      
      if (type === 'personal' && newFormData.personalData) {
        const contacts = [...(newFormData.personalData.contacts || []), newContact];
        if (contacts.length <= 5) {
          newFormData.personalData.contacts = contacts;
        } else {
          toast.error('Máximo de 5 contatos permitidos');
          return prev;
        }
      } else if (type === 'company' && newFormData.companyData) {
        const contacts = [...(newFormData.companyData.contacts || []), newContact];
        if (contacts.length <= 5) {
          newFormData.companyData.contacts = contacts;
        } else {
          toast.error('Máximo de 5 contatos permitidos');
          return prev;
        }
      }
      
      return newFormData;
    });
  }, []);

  const removeContact = useCallback((type: 'personal' | 'company', contactId: string) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      
      if (type === 'personal' && newFormData.personalData) {
        newFormData.personalData.contacts = newFormData.personalData.contacts?.filter(c => c.id !== contactId) || [];
      } else if (type === 'company' && newFormData.companyData) {
        newFormData.companyData.contacts = newFormData.companyData.contacts?.filter(c => c.id !== contactId) || [];
      }
      
      return newFormData;
    });
  }, []);

  const autoFillEnergyAccount = useCallback(() => {
    console.log('Preenchendo automaticamente conta de energia');
    console.log('Dados atuais:', formData);
    
    setFormData(prev => {
      const newFormData = { ...prev };
      
      if (prev.subscriberType === 'person' && prev.personalData) {
        console.log('Preenchendo com dados de pessoa física');
        newFormData.energyAccount = {
          ...newFormData.energyAccount,
          holderType: 'person',
          cpfCnpj: prev.personalData.cpf || '',
          holderName: prev.personalData.fullName || '',
          birthDate: prev.personalData.birthDate || '',
          partnerNumber: prev.personalData.partnerNumber || '',
          address: prev.personalData.address ? { 
            ...prev.personalData.address
          } : newFormData.energyAccount.address,
        };
        
        console.log('Dados preenchidos:', newFormData.energyAccount);
        toast.success('Dados da conta de energia preenchidos automaticamente!');
      } else if (prev.subscriberType === 'company' && prev.companyData) {
        console.log('Preenchendo com dados de pessoa jurídica');
        newFormData.energyAccount = {
          ...newFormData.energyAccount,
          holderType: 'company',
          cpfCnpj: prev.companyData.cnpj || '',
          holderName: prev.companyData.companyName || '',
          partnerNumber: prev.companyData.partnerNumber || '',
          address: prev.companyData.address ? { 
            ...prev.companyData.address
          } : newFormData.energyAccount.address,
        };
        
        console.log('Dados preenchidos:', newFormData.energyAccount);
        toast.success('Dados da conta de energia preenchidos automaticamente!');
      } else {
        toast.error('Preencha primeiro os dados do assinante para poder usar o preenchimento automático.');
        return prev;
      }
      
      return newFormData;
    });
  }, [formData]);

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
        return true;
      case 6:
        return !!(formData.planContract.selectedPlan && formData.planContract.informedKwh && formData.planContract.contractedKwh);
      case 7:
        return true;
      case 8:
        return true;
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
      console.log('Enviando dados do formulário:', formData);
      await subscriberService.createSubscriber(formData);
      toast.success('Assinante cadastrado com sucesso!');
      
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
    addContact,
    removeContact,
    autoFillEnergyAccount,
    validateStep,
    submitForm,
  };
};
