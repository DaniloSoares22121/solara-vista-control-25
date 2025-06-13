
import { useState, useCallback, useEffect } from 'react';
import { GeneratorFormData } from '@/types/generator';
import { useCepConsistency } from '@/hooks/useCepConsistency';
import { useGeneratorAutoFill } from '@/hooks/generator/useGeneratorAutoFill';
import { toast } from 'sonner';

const initialGeneratorData: GeneratorFormData = {
  concessionaria: 'equatorial-goias',
  owner: {
    type: 'fisica',
    cpfCnpj: '',
    name: '',
    numeroParceiroNegocio: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    address: {
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  },
  plants: [{
    apelido: '',
    uc: '',
    endereco: '',
    ownerType: 'fisica',
    ownerCpfCnpj: '',
    ownerName: '',
    ownerNumeroParceiroNegocio: '',
    ownerDataNascimento: '',
    potenciaTotalUsina: 0,
    geracaoProjetada: 0,
    address: {
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    contacts: []
  }],
  distributorLogin: {
    cpfCnpj: '',
    dataNascimento: '',
    uc: '',
    senha: ''
  },
  paymentData: {
    pix: '',
    bankData: {
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente'
    }
  },
  administrator: {
    cpf: '',
    nome: '',
    dataNascimento: '',
    address: {
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    telefone: '',
    email: ''
  },
  attachments: {}
};

export const useGeneratorForm = (existingData?: any) => {
  const [formData, setFormData] = useState<GeneratorFormData>(initialGeneratorData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!!existingData);
  const [isLoaded, setIsLoaded] = useState(false);

  const { handleCepLookup: handleCepLookupConsistent } = useCepConsistency();
  const { executeAllAutoFills } = useGeneratorAutoFill();

  // Load existing data if editing
  useEffect(() => {
    if (existingData && !isLoaded) {
      console.log('🔄 Carregando dados existentes da geradora:', existingData);
      setFormData(existingData);
      setIsLoaded(true);
    } else if (!existingData) {
      setIsLoaded(true);
    }
  }, [existingData, isLoaded]);

  // Auto-fill automation when data changes
  useEffect(() => {
    if (isLoaded && !isEditing) {
      console.log('🚀 [GENERATOR FORM] Executando automações...');
      
      const hasOwnerData = formData.owner?.cpfCnpj || formData.owner?.name;
      
      if (hasOwnerData) {
        const automatedData = executeAllAutoFills(formData);
        
        if (JSON.stringify(formData) !== JSON.stringify(automatedData)) {
          console.log('📝 [GENERATOR FORM] Aplicando automações');
          setFormData(automatedData);
        }
      }
    }
  }, [
    formData.owner?.cpfCnpj,
    formData.owner?.name,
    formData.owner?.numeroParceiroNegocio,
    formData.owner?.dataNascimento,
    formData.owner?.address?.cep,
    formData.owner?.telefone,
    formData.owner?.email,
    formData.plants?.[0]?.uc,
    isLoaded,
    isEditing,
    executeAllAutoFills
  ]);

  const updateFormData = useCallback((section: keyof GeneratorFormData, data: unknown) => {
    console.log('🔄 Atualizando formData da geradora:', section, data);
    setFormData(prev => {
      if (section === 'plants' && Array.isArray(data)) {
        return { ...prev, [section]: data };
      }
      
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

  const handleCepLookup = useCallback(async (cep: string, addressType: 'owner' | 'plant' | 'administrator', plantIndex?: number) => {
    await handleCepLookupConsistent(cep, (cepData) => {
      const addressUpdate = {
        cep: cepData.cep,
        endereco: cepData.logradouro,
        bairro: cepData.bairro,
        cidade: cepData.localidade,
        estado: cepData.uf,
      };

      setFormData(prev => {
        const newFormData = { ...prev };
        
        switch (addressType) {
          case 'owner':
            if (newFormData.owner?.address) {
              newFormData.owner.address = { ...newFormData.owner.address, ...addressUpdate };
            }
            break;
          case 'plant':
            if (plantIndex !== undefined && newFormData.plants?.[plantIndex]?.address) {
              newFormData.plants[plantIndex].address = { ...newFormData.plants[plantIndex].address, ...addressUpdate };
            }
            break;
          case 'administrator':
            if (newFormData.administrator?.address) {
              newFormData.administrator.address = { ...newFormData.administrator.address, ...addressUpdate };
            }
            break;
        }
        
        return newFormData;
      });
    });
  }, [handleCepLookupConsistent]);

  const addPlant = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      plants: [...prev.plants, {
        apelido: '',
        uc: '',
        endereco: '',
        ownerType: prev.owner?.type || 'fisica',
        ownerCpfCnpj: prev.owner?.cpfCnpj || '',
        ownerName: prev.owner?.name || '',
        ownerNumeroParceiroNegocio: prev.owner?.numeroParceiroNegocio || '',
        ownerDataNascimento: prev.owner?.dataNascimento || '',
        potenciaTotalUsina: 0,
        geracaoProjetada: 0,
        address: prev.owner?.address ? { ...prev.owner.address } : {
          cep: '',
          endereco: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: ''
        },
        contacts: []
      }]
    }));
  }, []);

  const removePlant = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      plants: prev.plants.filter((_, i) => i !== index)
    }));
  }, []);

  const autoFillAll = useCallback(() => {
    console.log('🔄 [MANUAL AUTO-FILL] Executando preenchimento manual completo...');
    const automatedData = executeAllAutoFills(formData);
    setFormData(automatedData);
    toast.success('Todos os dados foram preenchidos automaticamente!', { duration: 2000 });
  }, [formData, executeAllAutoFills]);

  const submitForm = useCallback(async (generatorId?: string) => {
    setIsSubmitting(true);
    try {
      console.log('📤 Enviando dados da geradora:', formData);
      toast.success('Geradora salva com sucesso!', { duration: 1000 });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar formulário da geradora:', error);
      toast.error('Erro ao salvar geradora. Tente novamente.', { duration: 3000 });
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialGeneratorData);
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
    addPlant,
    removePlant,
    autoFillAll,
    submitForm,
    resetForm,
  };
};
