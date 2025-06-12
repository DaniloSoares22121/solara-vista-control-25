
import { useState, useCallback, useEffect } from 'react';
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

export const useSubscriberForm = (existingData?: any) => {
  const [formData, setFormData] = useState<SubscriberFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!!existingData);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lookupCep } = useCepLookup();

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
      
      // Determinar tipo de assinante baseado nos dados - priorizar CNPJ para empresa
      const subscriberType = subscriber?.cnpj || energyAccount?.holderType === 'company' ? 'company' : 'person';
      console.log('📋 Tipo de assinante detectado:', subscriberType);
      
      // Função melhorada para mapear endereços com múltiplos formatos possíveis
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
      
      const loadedData: SubscriberFormData = {
        concessionaria: existingData.concessionaria || 'equatorial-goias',
        subscriberType,
        personalData: subscriberType === 'person' && subscriber ? {
          cpf: subscriber.cpf || '',
          partnerNumber: subscriber.partnerNumber || '',
          fullName: subscriber.fullName || subscriber.nome || '',
          birthDate: subscriber.birthDate || subscriber.dataNascimento || '',
          maritalStatus: subscriber.maritalStatus || subscriber.estadoCivil || '',
          profession: subscriber.profession || subscriber.profissao || '',
          phone: subscriber.phone || subscriber.telefone || '',
          email: subscriber.email || '',
          observations: subscriber.observations || subscriber.observacoes || '',
          address: mapAddress(subscriber.address),
          contacts: subscriber.contacts || [],
        } : initialFormData.personalData!,
        companyData: subscriberType === 'company' && subscriber ? {
          cnpj: subscriber.cnpj || '',
          partnerNumber: subscriber.partnerNumber || '',
          companyName: subscriber.companyName || subscriber.razaoSocial || '',
          fantasyName: subscriber.fantasyName || subscriber.nomeFantasia || '',
          phone: subscriber.phone || subscriber.telefone || '',
          email: subscriber.email || '',
          observations: subscriber.observations || subscriber.observacoes || '',
          address: mapAddress(subscriber.address),
          contacts: subscriber.contacts || [],
        } : initialFormData.companyData!,
        administratorData: administrator ? {
          cpf: administrator.cpf || '',
          fullName: administrator.fullName || administrator.nome || '',
          birthDate: administrator.birthDate || administrator.dataNascimento || '',
          maritalStatus: administrator.maritalStatus || administrator.estadoCivil || '',
          profession: administrator.profession || administrator.profissao || '',
          phone: administrator.phone || administrator.telefone || '',
          email: administrator.email || '',
          address: mapAddress(administrator.address),
        } : initialFormData.administratorData!,
        energyAccount: energyAccount ? {
          holderType: energyAccount.holderType || (energyAccount.cpfCnpj && energyAccount.cpfCnpj.includes('/') ? 'company' : 'person'),
          cpfCnpj: energyAccount.cpfCnpj || '',
          holderName: energyAccount.holderName || energyAccount.nome || '',
          birthDate: energyAccount.birthDate || energyAccount.dataNascimento || '',
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
          addDistributorValue: planDetails.addDistributorValue !== undefined ? planDetails.addDistributorValue : false,
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

  // Preenchimento automático da conta de energia quando os dados do assinante estão disponíveis
  useEffect(() => {
    if (currentStep === 4) { // Quando estiver na etapa da conta de energia
      if (formData.subscriberType === 'person' && formData.personalData) {
        const { cpf, fullName, birthDate, partnerNumber, address } = formData.personalData;
        
        if (cpf && fullName && address?.cep) {
          console.log('Preenchendo automaticamente os dados da conta de energia (Pessoa Física)');
          setFormData(prev => ({
            ...prev,
            energyAccount: {
              ...prev.energyAccount,
              holderType: 'person',
              cpfCnpj: cpf,
              holderName: fullName,
              birthDate: birthDate || '',
              partnerNumber: partnerNumber || '',
              address: { ...address },
            }
          }));
        }
      } else if (formData.subscriberType === 'company' && formData.companyData) {
        const { cnpj, companyName, partnerNumber, address } = formData.companyData;
        
        if (cnpj && companyName && address?.cep) {
          console.log('Preenchendo automaticamente os dados da conta de energia (Pessoa Jurídica)');
          setFormData(prev => ({
            ...prev,
            energyAccount: {
              ...prev.energyAccount,
              holderType: 'company',
              cpfCnpj: cnpj,
              holderName: companyName,
              partnerNumber: partnerNumber || '',
              address: { ...address },
            }
          }));
        }
      }
    }
  }, [currentStep, formData.subscriberType, formData.personalData, formData.companyData]);

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
    console.log('🔄 Executando preenchimento automático');
    console.log('📊 Dados atuais do formulário:', formData);
    
    setFormData(prev => {
      console.log('📋 Estado anterior:', prev);
      
      if (prev.subscriberType === 'person' && prev.personalData) {
        console.log('👤 Preenchendo com dados de pessoa física');
        
        const newFormData = {
          ...prev,
          energyAccount: {
            ...prev.energyAccount,
            holderType: 'person' as const,
            cpfCnpj: prev.personalData.cpf || '',
            holderName: prev.personalData.fullName || '',
            birthDate: prev.personalData.birthDate || '',
            partnerNumber: prev.personalData.partnerNumber || '',
            address: {
              ...prev.personalData.address
            },
          }
        };
        
        console.log('✅ Novos dados após preenchimento:', newFormData.energyAccount);
        toast.success('Dados da conta de energia preenchidos automaticamente!');
        return newFormData;
        
      } else if (prev.subscriberType === 'company' && prev.companyData) {
        console.log('🏢 Preenchendo com dados de pessoa jurídica');
        
        const newFormData = {
          ...prev,
          energyAccount: {
            ...prev.energyAccount,
            holderType: 'company' as const,
            cpfCnpj: prev.companyData.cnpj || '',
            holderName: prev.companyData.companyName || '',
            partnerNumber: prev.companyData.partnerNumber || '',
            address: {
              ...prev.companyData.address
            },
          }
        };
        
        console.log('✅ Novos dados após preenchimento:', newFormData.energyAccount);
        toast.success('Dados da conta de energia preenchidos automaticamente!');
        return newFormData;
        
      } else {
        console.log('❌ Não foi possível preencher - dados insuficientes');
        toast.error('Preencha primeiro os dados do assinante para poder usar o preenchimento automático.');
        return prev;
      }
    });
  }, [formData]);

  const validateStep = useCallback((step: number): boolean => {
    console.log('🔍 Validando passo:', step, 'com dados:', formData);
    
    switch (step) {
      case 1:
        const step1Valid = !!formData.concessionaria;
        console.log('✅ Passo 1 válido:', step1Valid, 'concessionaria:', formData.concessionaria);
        return step1Valid;
        
      case 2:
        const step2Valid = !!formData.subscriberType;
        console.log('✅ Passo 2 válido:', step2Valid, 'subscriberType:', formData.subscriberType);
        return step2Valid;
        
      case 3:
        if (formData.subscriberType === 'person') {
          const step3PersonValid = !!(formData.personalData?.cpf && formData.personalData?.fullName && formData.personalData?.email);
          console.log('✅ Passo 3 (pessoa) válido:', step3PersonValid, 'dados:', {
            cpf: formData.personalData?.cpf,
            fullName: formData.personalData?.fullName,
            email: formData.personalData?.email
          });
          return step3PersonValid;
        } else {
          const step3CompanyValid = !!(formData.companyData?.cnpj && formData.companyData?.companyName && formData.administratorData?.cpf);
          console.log('✅ Passo 3 (empresa) válido:', step3CompanyValid, 'dados:', {
            cnpj: formData.companyData?.cnpj,
            companyName: formData.companyData?.companyName,
            adminCpf: formData.administratorData?.cpf
          });
          return step3CompanyValid;
        }
        
      case 4:
        const step4Valid = !!(formData.energyAccount.uc && formData.energyAccount.cpfCnpj && formData.energyAccount.holderName);
        console.log('✅ Passo 4 válido:', step4Valid, 'dados:', {
          uc: formData.energyAccount.uc,
          cpfCnpj: formData.energyAccount.cpfCnpj,
          holderName: formData.energyAccount.holderName
        });
        return step4Valid;
        
      case 5:
        console.log('✅ Passo 5 sempre válido');
        return true;
        
      case 6:
        const step6Valid = !!(formData.planContract.selectedPlan && formData.planContract.informedKwh && formData.planContract.contractedKwh);
        console.log('✅ Passo 6 válido:', step6Valid, 'dados:', {
          selectedPlan: formData.planContract.selectedPlan,
          informedKwh: formData.planContract.informedKwh,
          contractedKwh: formData.planContract.contractedKwh
        });
        return step6Valid;
        
      case 7:
        console.log('✅ Passo 7 sempre válido');
        return true;
        
      case 8:
        console.log('✅ Passo 8 sempre válido');
        return true;
        
      case 9:
        if (isEditing) {
          console.log('✅ Passo 9 válido (modo edição)');
          return true;
        }
        
        const requiredAttachments = ['contract', 'bill'];
        if (formData.subscriberType === 'person') requiredAttachments.push('cnh');
        if (formData.subscriberType === 'company') requiredAttachments.push('companyContract');
        if (formData.titleTransfer.willTransfer) requiredAttachments.push('procuration');
        
        const step9Valid = requiredAttachments.every(key => formData.attachments[key as keyof typeof formData.attachments]);
        console.log('✅ Passo 9 válido:', step9Valid, 'anexos requeridos:', requiredAttachments);
        return step9Valid;
        
      default:
        return false;
    }
  }, [formData, isEditing]);

  const submitForm = useCallback(async (subscriberId?: string) => {
    setIsSubmitting(true);
    try {
      console.log('📤 Enviando dados do formulário:', formData);
      
      if (subscriberId) {
        // Update existing subscriber
        await subscriberService.updateSubscriber(subscriberId, formData);
        toast.success('Assinante atualizado com sucesso!');
      } else {
        // Create new subscriber
        await subscriberService.createSubscriber(formData);
        toast.success('Assinante cadastrado com sucesso!');
      }
      
      if (!subscriberId) {
        setFormData(initialFormData);
        setCurrentStep(1);
        setIsEditing(false);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar formulário:', error);
      toast.error(subscriberId ? 'Erro ao atualizar assinante. Tente novamente.' : 'Erro ao cadastrar assinante. Tente novamente.');
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
