import { useState, useCallback, useEffect } from 'react';
import { SubscriberFormData, SubscriberDataFromDB } from '@/types/subscriber';
import { useCepConsistency } from '@/hooks/useCepConsistency';
import { useSubscriberFormValidation } from '@/hooks/useSubscriberFormValidation';
import { useSubscriberFormActions } from '@/hooks/useSubscriberFormActions';
import { useSubscriberDataMapping } from '@/hooks/useSubscriberDataMapping';
import { initialFormData } from '@/constants/subscriberFormDefaults';
import { toast } from 'sonner';

export const useSubscriberForm = (existingData?: SubscriberDataFromDB) => {
  const [formData, setFormData] = useState<SubscriberFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(!!existingData);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { handleCepLookup: handleCepLookupConsistent } = useCepConsistency();
  const { validateStep } = useSubscriberFormValidation();
  const { isSubmitting, addContact: addContactAction, removeContact: removeContactAction, submitForm: submitFormAction } = useSubscriberFormActions();
  const { mapAddress, determineSubscriberType, performAutoFill } = useSubscriberDataMapping();

  // Load existing data if editing - APENAS UMA VEZ
  useEffect(() => {
    if (existingData && !isLoaded) {
      console.log('🔄 Carregando dados existentes:', existingData);
      
      const subscriber = existingData.subscriber;
      const administrator = existingData.administrator;
      const energyAccount = existingData.energy_account;
      const planContract = existingData.plan_contract;
      const planDetails = existingData.plan_details;
      const notifications = existingData.notifications;
      const attachments = existingData.attachments;
      const titleTransfer = existingData.title_transfer;
      
      const subscriberType = determineSubscriberType(subscriber, energyAccount);
      
      const loadedData: SubscriberFormData = {
        concessionaria: existingData.concessionaria || 'equatorial-goias',
        subscriberType,
        
        personalData: subscriberType === 'person' && subscriber ? {
          cpf: (subscriber.cpf as string) || '',
          partnerNumber: (subscriber.partnerNumber as string) || '',
          fullName: (subscriber.fullName as string) || '',
          birthDate: (subscriber.birthDate as string) || '',
          maritalStatus: (subscriber.maritalStatus as string) || '',
          profession: (subscriber.profession as string) || '',
          phone: (subscriber.phone as string) || '',
          email: (subscriber.email as string) || '',
          observations: (subscriber.observations as string) || '',
          address: mapAddress(subscriber.address as Record<string, unknown>),
          contacts: Array.isArray(subscriber.contacts) ? (subscriber.contacts as any[]) : [],
        } : initialFormData.personalData!,
        
        companyData: subscriberType === 'company' && subscriber ? {
          cnpj: (subscriber.cnpj as string) || '',
          partnerNumber: (subscriber.partnerNumber as string) || '',
          companyName: (subscriber.companyName as string) || (subscriber.razaoSocial as string) || '',
          fantasyName: (subscriber.fantasyName as string) || (subscriber.nomeFantasia as string) || '',
          phone: (subscriber.phone as string) || '',
          email: (subscriber.email as string) || '',
          observations: (subscriber.observations as string) || '',
          address: mapAddress(subscriber.address as Record<string, unknown>),
          contacts: Array.isArray(subscriber.contacts) ? (subscriber.contacts as any[]) : [],
        } : initialFormData.companyData!,
        
        administratorData: administrator ? {
          cpf: (administrator.cpf as string) || '',
          fullName: (administrator.fullName as string) || '',
          birthDate: (administrator.birthDate as string) || '',
          maritalStatus: (administrator.maritalStatus as string) || '',
          profession: (administrator.profession as string) || '',
          phone: (administrator.phone as string) || '',
          email: (administrator.email as string) || '',
          address: mapAddress(administrator.address as Record<string, unknown>),
        } : initialFormData.administratorData!,
        
        energyAccount: energyAccount ? {
          holderType: (energyAccount.holderType as 'person' | 'company') || subscriberType,
          cpfCnpj: (energyAccount.cpfCnpj as string) || '',
          holderName: (energyAccount.holderName as string) || '',
          birthDate: (energyAccount.birthDate as string) || '',
          uc: (energyAccount.uc as string) || '',
          partnerNumber: (energyAccount.partnerNumber as string) || '',
          address: mapAddress(energyAccount.address as Record<string, unknown>),
        } : initialFormData.energyAccount,
        
        titleTransfer: (titleTransfer as any) || initialFormData.titleTransfer,
        
        planContract: planContract ? {
          selectedPlan: (planContract.selectedPlan as string) || '',
          compensationMode: (planContract.compensationMode as 'autoConsumption' | 'sharedGeneration') || 'autoConsumption',
          adhesionDate: (planContract.adhesionDate as string) || '',
          informedKwh: typeof planContract.informedKwh === 'number' ? planContract.informedKwh : undefined,
          contractedKwh: typeof planContract.contractedKwh === 'number' ? planContract.contractedKwh : undefined,
          loyalty: (planContract.loyalty as 'none' | 'oneYear' | 'twoYears') || 'none',
          discountPercentage: typeof planContract.discountPercentage === 'number' ? planContract.discountPercentage : undefined,
        } : initialFormData.planContract,
        
        planDetails: planDetails ? {
          paysPisAndCofins: (planDetails.paysPisAndCofins as boolean) !== undefined ? (planDetails.paysPisAndCofins as boolean) : true,
          paysWireB: (planDetails.paysWireB as boolean) !== undefined ? (planDetails.paysWireB as boolean) : false,
          addDistributorValue: (planDetails.addDistributorValue as boolean) !== undefined ? (planDetails.addDistributorValue as boolean) : true,
          exemptFromPayment: (planDetails.exemptFromPayment as boolean) !== undefined ? (planDetails.exemptFromPayment as boolean) : false,
        } : initialFormData.planDetails,
        
        notificationSettings: (notifications as any) || initialFormData.notificationSettings,
        attachments: (attachments as any) || {},
      };
      
      console.log('✅ Dados carregados com sucesso:', loadedData);
      console.log('📋 Plan Contract carregado:', loadedData.planContract);
      console.log('🎯 Discount Percentage carregado:', loadedData.planContract.discountPercentage);
      setFormData(loadedData);
      setIsEditing(true);
      setIsLoaded(true);
    } else if (!existingData) {
      setIsLoaded(true);
    }
  }, [existingData, mapAddress, determineSubscriberType, isLoaded]);

  // Auto-fill para novos assinantes - EXECUTAR SEMPRE QUE OS DADOS MUDAREM
  useEffect(() => {
    if (isLoaded && !isEditing && !existingData) {
      console.log('🔄 [AUTO-FILL] Verificando necessidade de auto-fill...');
      
      // Executar auto-fill quando dados pessoais ou da empresa mudarem
      const hasPersonalData = formData.subscriberType === 'person' && 
        formData.personalData?.cpf && formData.personalData?.fullName;
      
      const hasCompanyData = formData.subscriberType === 'company' && 
        formData.companyData?.cnpj && formData.companyData?.companyName;
      
      if (hasPersonalData || hasCompanyData) {
        console.log('🔄 [AUTO-FILL] Executando auto-fill...');
        const newFormData = performAutoFill(formData);
        
        // Apenas atualizar se houver mudanças
        if (JSON.stringify(newFormData.energyAccount) !== JSON.stringify(formData.energyAccount)) {
          console.log('✅ [AUTO-FILL] Atualizando dados da conta de energia');
          setFormData(newFormData);
        }
      }
    }
  }, [
    formData.personalData?.cpf,
    formData.personalData?.fullName,
    formData.personalData?.partnerNumber,
    formData.companyData?.cnpj,
    formData.companyData?.companyName,
    formData.companyData?.partnerNumber,
    formData.subscriberType,
    isLoaded,
    isEditing,
    performAutoFill,
    existingData
  ]);

  const updateFormData = useCallback((section: keyof SubscriberFormData, data: unknown) => {
    console.log('🔄 Atualizando formData:', section, data);
    
    // Log específico para planContract
    if (section === 'planContract') {
      console.log('📋 Atualizando Plan Contract:', data);
      console.log('🎯 Discount no update:', (data as any)?.discountPercentage);
    }
    
    setFormData(prev => {
      const currentSectionData = prev[section];
      
      if (typeof data === 'object' && data !== null && typeof currentSectionData === 'object' && currentSectionData !== null) {
        const updatedData = {
          ...prev,
          [section]: { ...currentSectionData, ...data }
        };
        
        // Log específico para verificar se o desconto foi salvo
        if (section === 'planContract') {
          console.log('📋 Plan Contract após update:', updatedData.planContract);
          console.log('🎯 Discount após update:', (updatedData.planContract as any)?.discountPercentage);
        }
        
        return updatedData;
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
    console.log('🔄 [MANUAL AUTO-FILL] Executando preenchimento manual...');
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
