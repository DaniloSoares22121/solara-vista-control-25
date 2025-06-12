
import { useState, useCallback, useEffect } from 'react';
import { SubscriberFormData, Contact, Address } from '@/types/subscriber';
import { useCepLookup } from '@/hooks/useCepLookup';
import { subscriberService } from '@/services/supabaseSubscriberService';
import { toast } from 'sonner';

const defaultNotificationSettings = {
  whatsapp: {
    sendInvoices: true,
    paymentReceived: false, // Desmarcado por padrão
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
  concessionaria: 'equatorial-goias', // Padrão Equatorial
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
    addDistributorValue: true, // Marcado como padrão
    exemptFromPayment: false,
  },
  notificationSettings: defaultNotificationSettings,
  attachments: {},
};

export const useSubscriberForm = (existingData?: any) => {
  const [formData, setFormData] = useState<SubscriberFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!!existingData);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lookupCep } = useCepLookup();

  // Função padronizada para mapear endereços
  const mapAddress = (addr: any): Address => {
    if (!addr) return initialFormData.personalData!.address;
    
    return {
      cep: addr.cep || '',
      street: addr.street || addr.endereco || addr.logradouro || '',
      number: addr.number || addr.numero || '',
      complement: addr.complement || addr.complemento || '',
      neighborhood: addr.neighborhood || addr.bairro || '',
      city: addr.city || addr.cidade || addr.localidade || '',
      state: addr.state || addr.estado || addr.uf || '',
    };
  };

  // Determinar tipo de assinante de forma consistente
  const determineSubscriberType = (subscriber: any, energyAccount: any): 'person' | 'company' => {
    // Prioridade: CNPJ no subscriber > tipo da conta de energia > padrão pessoa
    if (subscriber?.cnpj) return 'company';
    if (energyAccount?.holderType === 'company') return 'company';
    if (energyAccount?.cpfCnpj && energyAccount.cpfCnpj.includes('/')) return 'company';
    return 'person';
  };

  // Load existing data if editing
  useEffect(() => {
    if (existingData) {
      console.log('🔄 Carregando dados existentes para edição:', existingData);
      
      const subscriber = existingData.subscriber;
      const administrator = existingData.administrator;
      const energyAccount = existingData.energy_account;
      const planContract = existingData.plan_contract;
      const planDetails = existingData.plan_details;
      const notifications = existingData.notifications;
      const attachments = existingData.attachments;
      const titleTransfer = existingData.title_transfer;
      
      // Determinar tipo de assinante de forma consistente
      const subscriberType = determineSubscriberType(subscriber, energyAccount);
      console.log('📋 Tipo de assinante detectado:', subscriberType);
      
      const loadedData: SubscriberFormData = {
        concessionaria: existingData.concessionaria || 'equatorial-goias',
        subscriberType,
        
        // Dados de pessoa física - só preenche se for pessoa física
        personalData: subscriberType === 'person' && subscriber ? {
          cpf: subscriber.cpf || '',
          partnerNumber: subscriber.partnerNumber || '',
          fullName: subscriber.fullName || '',
          birthDate: subscriber.birthDate || '',
          maritalStatus: subscriber.maritalStatus || '',
          profession: subscriber.profession || '',
          phone: subscriber.phone || '',
          email: subscriber.email || '',
          observations: subscriber.observations || '',
          address: mapAddress(subscriber.address),
          contacts: subscriber.contacts || [],
        } : initialFormData.personalData!,
        
        // Dados de pessoa jurídica - só preenche se for empresa
        companyData: subscriberType === 'company' && subscriber ? {
          cnpj: subscriber.cnpj || '',
          partnerNumber: subscriber.partnerNumber || '',
          companyName: subscriber.companyName || subscriber.razaoSocial || '',
          fantasyName: subscriber.fantasyName || subscriber.nomeFantasia || '',
          phone: subscriber.phone || '',
          email: subscriber.email || '',
          observations: subscriber.observations || '',
          address: mapAddress(subscriber.address),
          contacts: subscriber.contacts || [],
        } : initialFormData.companyData!,
        
        // Dados do administrador - só para empresas
        administratorData: administrator ? {
          cpf: administrator.cpf || '',
          fullName: administrator.fullName || '',
          birthDate: administrator.birthDate || '',
          maritalStatus: administrator.maritalStatus || '',
          profession: administrator.profession || '',
          phone: administrator.phone || '',
          email: administrator.email || '',
          address: mapAddress(administrator.address),
        } : initialFormData.administratorData!,
        
        energyAccount: energyAccount ? {
          holderType: energyAccount.holderType || subscriberType,
          cpfCnpj: energyAccount.cpfCnpj || '',
          holderName: energyAccount.holderName || '',
          birthDate: energyAccount.birthDate || '',
          uc: energyAccount.uc || '',
          partnerNumber: energyAccount.partnerNumber || '',
          address: mapAddress(energyAccount.address),
        } : initialFormData.energyAccount,
        
        titleTransfer: titleTransfer || initialFormData.titleTransfer,
        
        planContract: planContract ? {
          selectedPlan: planContract.selectedPlan || '',
          compensationMode: planContract.compensationMode || 'autoConsumption',
          adhesionDate: planContract.adhesionDate || '',
          informedKwh: planContract.informedKwh || 0,
          contractedKwh: planContract.contractedKwh || 0,
          loyalty: planContract.loyalty || 'none',
          discountPercentage: planContract.discountPercentage || 0,
        } : initialFormData.planContract,
        
        planDetails: planDetails ? {
          paysPisAndCofins: planDetails.paysPisAndCofins !== undefined ? planDetails.paysPisAndCofins : true,
          paysWireB: planDetails.paysWireB !== undefined ? planDetails.paysWireB : false,
          addDistributorValue: planDetails.addDistributorValue !== undefined ? planDetails.addDistributorValue : true,
          exemptFromPayment: planDetails.exemptFromPayment !== undefined ? planDetails.exemptFromPayment : false,
        } : initialFormData.planDetails,
        
        notificationSettings: notifications || defaultNotificationSettings,
        attachments: attachments || {},
      };
      
      console.log('✅ Dados processados para carregamento:', loadedData);
      setFormData(loadedData);
      setIsEditing(true);
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }
  }, [existingData]);

  // Auto-fill melhorado que funciona em qualquer momento
  const performAutoFill = useCallback(() => {
    setFormData(prev => {
      if (prev.subscriberType === 'person' && prev.personalData) {
        const { cpf, fullName, birthDate, partnerNumber, address } = prev.personalData;
        
        if (cpf && fullName) {
          console.log('🔄 Auto-preenchendo conta de energia (Pessoa Física)');
          return {
            ...prev,
            energyAccount: {
              ...prev.energyAccount,
              holderType: 'person',
              cpfCnpj: cpf,
              holderName: fullName,
              birthDate: birthDate || '',
              partnerNumber: partnerNumber || '',
              address: address.cep ? { ...address } : prev.energyAccount.address,
            }
          };
        }
      } else if (prev.subscriberType === 'company' && prev.companyData) {
        const { cnpj, companyName, partnerNumber, address } = prev.companyData;
        
        if (cnpj && companyName) {
          console.log('🔄 Auto-preenchendo conta de energia (Pessoa Jurídica)');
          return {
            ...prev,
            energyAccount: {
              ...prev.energyAccount,
              holderType: 'company',
              cpfCnpj: cnpj,
              holderName: companyName,
              birthDate: '',
              partnerNumber: partnerNumber || '',
              address: address.cep ? { ...address } : prev.energyAccount.address,
            }
          };
        }
      }
      
      return prev;
    });
  }, []);

  // Auto-fill automático quando dados mudam
  useEffect(() => {
    if (isLoaded && !isEditing) {
      performAutoFill();
    }
  }, [formData.personalData, formData.companyData, isLoaded, isEditing, performAutoFill]);

  const updateFormData = useCallback((section: keyof SubscriberFormData, data: any) => {
    console.log('🔄 Atualizando seção:', section, 'com dados:', data);
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
      console.log('🔍 Fazendo lookup do CEP:', cleanCep, 'para tipo:', addressType);
      try {
        const cepData = await lookupCep(cleanCep);
        console.log('📍 Dados retornados do CEP:', cepData);
        
        if (cepData) {
          const addressUpdate = {
            cep: cepData.cep,
            street: cepData.logradouro,
            neighborhood: cepData.bairro,
            city: cepData.localidade,
            state: cepData.uf,
          };

          console.log('🏠 Atualizando endereço para:', addressType, addressUpdate);

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
        console.error('❌ Erro ao buscar CEP:', error);
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
          toast.error('Máximo de 5 contatos permitidos', { duration: 1000 });
          return prev;
        }
      } else if (type === 'company' && newFormData.companyData) {
        const contacts = [...(newFormData.companyData.contacts || []), newContact];
        if (contacts.length <= 5) {
          newFormData.companyData.contacts = contacts;
        } else {
          toast.error('Máximo de 5 contatos permitidos', { duration: 1000 });
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
    console.log('🔄 Executando preenchimento automático manual');
    performAutoFill();
    toast.success('Dados da conta de energia preenchidos automaticamente!', { duration: 1000 });
  }, [performAutoFill]);

  const validateStep = useCallback((step: number): boolean => {
    console.log('🔍 Validando passo:', step, 'com dados:', formData);
    
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
        
        const requiredAttachments = ['contract', 'bill'];
        if (formData.subscriberType === 'person') requiredAttachments.push('cnh');
        if (formData.subscriberType === 'company') requiredAttachments.push('companyContract');
        if (formData.titleTransfer.willTransfer) requiredAttachments.push('procuration');
        
        return requiredAttachments.every(key => formData.attachments[key as keyof typeof formData.attachments]);
        
      default:
        return false;
    }
  }, [formData, isEditing]);

  const submitForm = useCallback(async (subscriberId?: string) => {
    setIsSubmitting(true);
    try {
      console.log('📤 Enviando dados do formulário:', formData);
      
      if (subscriberId) {
        await subscriberService.updateSubscriber(subscriberId, formData);
        toast.success('Assinante atualizado com sucesso!', { duration: 1000 });
      } else {
        await subscriberService.createSubscriber(formData);
        toast.success('Assinante cadastrado com sucesso!', { duration: 1000 });
      }
      
      if (!subscriberId) {
        setFormData(initialFormData);
        setCurrentStep(1);
        setIsEditing(false);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar formulário:', error);
      toast.error(subscriberId ? 'Erro ao atualizar assinante. Tente novamente.' : 'Erro ao cadastrar assinante. Tente novamente.', { duration: 3000 });
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsEditing(false);
    setIsLoaded(false);
  }, []);

  return {
    formData,
    currentStep,
    isSubmitting,
    isEditing,
    isLoaded,
    setCurrentStep,
    updateFormData,
    handleCepLookup,
    addContact,
    removeContact,
    autoFillEnergyAccount,
    validateStep,
    submitForm,
    resetForm,
  };
};
