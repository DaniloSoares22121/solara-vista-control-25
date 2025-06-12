
import { useState, useCallback, useEffect } from 'react';
import { SubscriberFormData } from '@/types/subscriber';
import { useCepConsistency } from '@/hooks/useCepConsistency';
import { useSubscriberFormValidation } from '@/hooks/useSubscriberFormValidation';
import { useSubscriberFormActions } from '@/hooks/useSubscriberFormActions';
import { useSubscriberDataMapping } from '@/hooks/useSubscriberDataMapping';
import { initialFormData } from '@/constants/subscriberFormDefaults';
import { toast } from 'sonner';

export const useSubscriberForm = (existingData?: any) => {
  const [formData, setFormData] = useState<SubscriberFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(!!existingData);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { handleCepLookup: handleCepLookupConsistent } = useCepConsistency();
  const { validateStep } = useSubscriberFormValidation();
  const { isSubmitting, addContact: addContactAction, removeContact: removeContactAction, submitForm: submitFormAction } = useSubscriberFormActions();
  const { mapAddress, determineSubscriberType, performAutoFill } = useSubscriberDataMapping();

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
      
      const subscriberType = determineSubscriberType(subscriber, energyAccount);
      console.log('📋 Tipo de assinante detectado:', subscriberType);
      
      const loadedData: SubscriberFormData = {
        concessionaria: existingData.concessionaria || 'equatorial-goias',
        subscriberType,
        
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
        
        notificationSettings: notifications || initialFormData.notificationSettings,
        attachments: attachments || {},
      };
      
      console.log('✅ Dados processados para carregamento:', loadedData);
      setFormData(loadedData);
      setIsEditing(true);
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }
  }, [existingData, mapAddress, determineSubscriberType]);

  // Auto-fill quando dados mudam
  useEffect(() => {
    if (isLoaded && !isEditing) {
      const newFormData = performAutoFill(formData);
      if (newFormData !== formData) {
        setFormData(newFormData);
      }
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
    await handleCepLookupConsistent(cep, (cepData) => {
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
    });
  }, [handleCepLookupConsistent]);

  const addContact = useCallback((type: 'personal' | 'company') => {
    addContactAction(formData, setFormData, type);
  }, [formData, addContactAction]);

  const removeContact = useCallback((type: 'personal' | 'company', contactId: string) => {
    removeContactAction(formData, setFormData, type, contactId);
  }, [formData, removeContactAction]);

  const autoFillEnergyAccount = useCallback(() => {
    console.log('🔄 Executando preenchimento automático manual');
    const newFormData = performAutoFill(formData);
    setFormData(newFormData);
    toast.success('Dados da conta de energia preenchidos automaticamente!', { duration: 1000 });
  }, [formData, performAutoFill]);

  const submitForm = useCallback(async (subscriberId?: string) => {
    const result = await submitFormAction(formData, subscriberId);
    
    if (result.success && !subscriberId) {
      setFormData(initialFormData);
      setCurrentStep(1);
      setIsEditing(false);
    }
    
    return result;
  }, [formData, submitFormAction]);

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
    validateStep: (step: number) => validateStep(step, formData, isEditing),
    submitForm,
    resetForm,
  };
};
