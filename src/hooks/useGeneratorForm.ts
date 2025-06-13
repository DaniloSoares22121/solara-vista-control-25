
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { useGenerators } from '@/hooks/useGenerators';
import { useGeneratorFormMapping } from '@/hooks/useGeneratorFormMapping';
import { useGeneratorCalculations } from '@/hooks/useGeneratorCalculations';
import { useGeneratorValidations } from '@/hooks/useGeneratorValidations';
import { useGeneratorAutoSave } from '@/hooks/useGeneratorAutoSave';
import { useGeneratorSuggestions } from '@/hooks/useGeneratorSuggestions';
import { toast } from 'sonner';

export const useGeneratorForm = () => {
  const { createGenerator, generators } = useGenerators();
  const [isLoading, setIsLoading] = useState(false);
  const { performAutoFillPlant, performAutoFillDistributorLogin } = useGeneratorFormMapping();
  const { 
    calculateTotalPower, 
    calculateInverterTotalPower, 
    estimateGeneration, 
    suggestPlantType,
    validateInverterCompatibility 
  } = useGeneratorCalculations();
  const { validateCPF, validateCNPJ, validateUC, generatePixSuggestion } = useGeneratorValidations();
  const { 
    generateAutoContact, 
    generateAutoObservations, 
    suggestInverterBrand, 
    suggestModulePower,
    generateDefaultPaymentData 
  } = useGeneratorSuggestions();

  const form = useForm<GeneratorFormData>({
    defaultValues: {
      concessionaria: 'equatorial-goias',
      owner: {
        type: 'fisica',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        name: '',
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
        email: '',
        observacoes: ''
      },
      plants: [],
      distributorLogin: {
        uc: '',
        cpfCnpj: '',
        dataNascimento: ''
      },
      paymentData: {
        banco: '',
        agencia: '',
        conta: '',
        pix: ''
      },
      attachments: {}
    }
  });

  // Configurar auto-save
  const autoSave = useGeneratorAutoSave(form);

  // Watchers para automações
  const ownerCpfCnpj = form.watch('owner.cpfCnpj');
  const ownerDataNascimento = form.watch('owner.dataNascimento');
  const ownerType = form.watch('owner.type');
  const ownerName = form.watch('owner.name');
  const ownerAddress = form.watch('owner.address');
  const ownerTelefone = form.watch('owner.telefone');
  const plants = form.watch('plants');

  // Auto-fill para login da distribuidora
  useEffect(() => {
    if (ownerCpfCnpj) {
      console.log('🔄 [GENERATOR FORM] Auto-fill do login da distribuidora');
      const currentFormData = form.getValues();
      const updatedFormData = performAutoFillDistributorLogin(currentFormData);
      
      if (JSON.stringify(updatedFormData.distributorLogin) !== JSON.stringify(currentFormData.distributorLogin)) {
        form.setValue('distributorLogin', updatedFormData.distributorLogin);
      }
    }
  }, [ownerCpfCnpj, ownerDataNascimento, ownerType, form, performAutoFillDistributorLogin]);

  // Auto-fill para usinas existentes
  useEffect(() => {
    if (plants.length > 0 && (ownerCpfCnpj || ownerName || ownerAddress)) {
      console.log('🔄 [GENERATOR FORM] Atualizando usinas existentes');
      
      plants.forEach((_, index) => {
        const currentFormData = form.getValues();
        const updatedFormData = performAutoFillPlant(currentFormData, index);
        
        if (JSON.stringify(updatedFormData.plants[index]) !== JSON.stringify(currentFormData.plants[index])) {
          form.setValue(`plants.${index}`, updatedFormData.plants[index]);
        }
      });
    }
  }, [ownerCpfCnpj, ownerName, ownerAddress, ownerDataNascimento, ownerType, form, performAutoFillPlant, plants]);

  // Automação de cálculos para cada usina
  useEffect(() => {
    plants.forEach((plant, index) => {
      // Calcular potência total da usina
      if (plant.potenciaModulo && plant.quantidadeModulos) {
        const potenciaTotal = calculateTotalPower(plant.potenciaModulo, plant.quantidadeModulos);
        if (plant.potenciaTotalUsina !== potenciaTotal) {
          form.setValue(`plants.${index}.potenciaTotalUsina`, potenciaTotal);
          
          // Sugerir tipo de usina baseado na potência
          const tipoSugerido = suggestPlantType(potenciaTotal);
          if (plant.tipoUsina !== tipoSugerido) {
            form.setValue(`plants.${index}.tipoUsina`, tipoSugerido);
          }
        }
      }

      // Calcular potência total dos inversores
      if (plant.inversores && plant.inversores.length > 0) {
        const potenciaInversores = calculateInverterTotalPower(plant.inversores);
        if (plant.potenciaTotalInversores !== potenciaInversores) {
          form.setValue(`plants.${index}.potenciaTotalInversores`, potenciaInversores);
        }
      }

      // Estimar geração baseada na potência e localização
      if (plant.potenciaTotalUsina && plant.address?.estado) {
        const generation = estimateGeneration(plant.potenciaTotalUsina, plant.address.estado);
        if (plant.geracaoProjetada !== generation.estimatedGeneration) {
          form.setValue(`plants.${index}.geracaoProjetada`, generation.estimatedGeneration);
          
          // Gerar observações automáticas
          const autoObservations = generateAutoObservations(plant, generation);
          if (!plant.observacoes && autoObservations) {
            form.setValue(`plants.${index}.observacoes`, autoObservations);
          }
        }
      }

      // Sugerir marca de inversor baseada na marca do módulo
      if (plant.marcaModulo && plant.inversores?.length > 0) {
        plant.inversores.forEach((inversor, invIndex) => {
          if (!inversor.marca) {
            const marcaSugerida = suggestInverterBrand(plant.marcaModulo);
            form.setValue(`plants.${index}.inversores.${invIndex}.marca`, marcaSugerida);
          }
        });
      }
    });
  }, [plants, form, calculateTotalPower, calculateInverterTotalPower, estimateGeneration, suggestPlantType, generateAutoObservations, suggestInverterBrand]);

  // Auto-preenchimento de dados de pagamento
  useEffect(() => {
    if (ownerCpfCnpj && generators.length > 0) {
      const currentPaymentData = form.getValues('paymentData');
      const hasEmptyPaymentData = !currentPaymentData.banco && !currentPaymentData.conta;
      
      if (hasEmptyPaymentData) {
        const suggestedPaymentData = generateDefaultPaymentData(generators, ownerCpfCnpj);
        const pixSuggestion = generatePixSuggestion(ownerCpfCnpj, ownerType);
        
        form.setValue('paymentData', {
          ...suggestedPaymentData,
          pix: suggestedPaymentData.pix || pixSuggestion
        });
        
        if (suggestedPaymentData.banco) {
          console.log('💳 [GENERATOR FORM] Dados de pagamento preenchidos automaticamente');
        }
      }
    }
  }, [ownerCpfCnpj, ownerType, generators, form, generateDefaultPaymentData, generatePixSuggestion]);

  const handleCepLookup = async (cep: string, type: string, index?: number) => {
    console.log('🔍 [CEP LOOKUP] Buscando CEP:', { cep, type, index });
  };

  const addPlant = useCallback(() => {
    const currentPlants = form.getValues('plants');
    const owner = form.getValues('owner');
    
    console.log('🌱 [ADD PLANT] Adicionando nova usina com automações');
    
    const suggestedModulePower = suggestModulePower();
    const autoContact = owner.name ? generateAutoContact(owner) : undefined;
    
    const newPlant = {
      apelido: '',
      uc: '',
      tipoUsina: 'micro' as const,
      modalidadeCompensacao: 'autoconsumo' as const,
      ownerType: owner.type,
      ownerCpfCnpj: owner.cpfCnpj || '',
      ownerName: owner.name || '',
      ownerDataNascimento: owner.dataNascimento || '',
      ownerNumeroParceiroNegocio: owner.numeroParceiroNegocio || '',
      address: {
        cep: owner.address?.cep || '',
        endereco: owner.address?.endereco || '',
        numero: owner.address?.numero || '',
        complemento: owner.address?.complemento || '',
        bairro: owner.address?.bairro || '',
        cidade: owner.address?.cidade || '',
        estado: owner.address?.estado || ''
      },
      contacts: autoContact ? [autoContact] : [],
      observacoes: '',
      marcaModulo: '',
      potenciaModulo: suggestedModulePower,
      quantidadeModulos: 0,
      potenciaTotalUsina: 0,
      inversores: [{
        marca: '',
        potencia: 0,
        quantidade: 0,
      }],
      potenciaTotalInversores: 0,
      geracaoProjetada: 0,
      observacoesInstalacao: ''
    };

    const updatedPlants = [...currentPlants, newPlant];
    form.setValue('plants', updatedPlants);
    
    const currentFormData = form.getValues();
    const updatedFormData = performAutoFillPlant(currentFormData, updatedPlants.length - 1);
    
    if (JSON.stringify(updatedFormData.plants[updatedPlants.length - 1]) !== JSON.stringify(newPlant)) {
      form.setValue('plants', updatedFormData.plants);
    }
    
    toast("Nova usina adicionada com automações aplicadas.");
  }, [form, performAutoFillPlant, suggestModulePower, generateAutoContact]);

  const removePlant = (index: number) => {
    const currentPlants = form.getValues('plants');
    form.setValue('plants', currentPlants.filter((_, i) => i !== index));
  };

  const validateStep = useCallback((step: number): { isValid: boolean; errors: string[] } => {
    const formData = form.getValues();
    const errors: string[] = [];

    console.log('🔍 [VALIDATION] Validando step:', step);

    switch (step) {
      case 1:
        // Validar CPF/CNPJ
        if (formData.owner.cpfCnpj) {
          const isValidDoc = formData.owner.type === 'fisica' 
            ? validateCPF(formData.owner.cpfCnpj)
            : validateCNPJ(formData.owner.cpfCnpj);
          
          if (!isValidDoc) {
            errors.push(`${formData.owner.type === 'fisica' ? 'CPF' : 'CNPJ'} inválido.`);
          }
        }
        break;

      case 2:
        // Validar UCs e compatibilidade de inversores
        formData.plants?.forEach((plant, index) => {
          if (plant.uc && formData.concessionaria) {
            const ucValidation = validateUC(plant.uc, formData.concessionaria);
            if (!ucValidation.isValid) {
              errors.push(`Usina ${index + 1}: ${ucValidation.message}`);
            }
          }

          if (plant.potenciaTotalUsina && plant.potenciaTotalInversores) {
            const compatibility = validateInverterCompatibility(
              plant.potenciaTotalUsina,
              plant.potenciaTotalInversores
            );
            if (!compatibility.isValid) {
              errors.push(`Usina ${index + 1}: ${compatibility.message}`);
            }
          }
        });
        break;

      case 3:
        // Validar login da distribuidora
        if (formData.distributorLogin.cpfCnpj) {
          const isValidDoc = formData.owner.type === 'fisica' 
            ? validateCPF(formData.distributorLogin.cpfCnpj)
            : validateCNPJ(formData.distributorLogin.cpfCnpj);
          
          if (!isValidDoc) {
            errors.push('CPF/CNPJ do login da distribuidora inválido.');
          }
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  }, [form, validateCPF, validateCNPJ, validateUC, validateInverterCompatibility]);

  const saveGenerator = async (data: GeneratorFormData) => {
    setIsLoading(true);
    try {
      await createGenerator(data);
      
      // Limpar auto-save após salvar com sucesso
      autoSave.clearAutoSave();
      
      form.reset({
        concessionaria: 'equatorial-goias',
        owner: {
          type: 'fisica',
          cpfCnpj: '',
          numeroParceiroNegocio: '',
          name: '',
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
          email: '',
          observacoes: ''
        },
        plants: [],
        distributorLogin: {
          uc: '',
          cpfCnpj: '',
          dataNascimento: ''
        },
        paymentData: {
          banco: '',
          agencia: '',
          conta: '',
          pix: ''
        },
        attachments: {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleCepLookup,
    addPlant,
    removePlant,
    validateStep,
    saveGenerator,
    isLoading,
    autoSave,
    // Exposer funções de validação para uso nos componentes
    validateCPF,
    validateCNPJ,
    validateUC,
    validateInverterCompatibility
  };
};
