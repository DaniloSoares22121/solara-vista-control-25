
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { useGenerators } from '@/hooks/useGenerators';
import { useGeneratorFormMapping } from '@/hooks/useGeneratorFormMapping';
import { toast } from 'sonner';

export const useGeneratorForm = () => {
  const { createGenerator } = useGenerators();
  const [isLoading, setIsLoading] = useState(false);
  const { performAutoFillPlant, performAutoFillDistributorLogin } = useGeneratorFormMapping();

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

  // Auto-fill para login da distribuidora quando os dados do proprietário mudarem
  const ownerCpfCnpj = form.watch('owner.cpfCnpj');
  const ownerDataNascimento = form.watch('owner.dataNascimento');
  const ownerType = form.watch('owner.type');
  const ownerName = form.watch('owner.name');
  const ownerAddress = form.watch('owner.address');

  useEffect(() => {
    if (ownerCpfCnpj) {
      console.log('🔄 [GENERATOR FORM] Dados do proprietário mudaram, executando auto-fill do login');
      const currentFormData = form.getValues();
      const updatedFormData = performAutoFillDistributorLogin(currentFormData);
      
      if (JSON.stringify(updatedFormData.distributorLogin) !== JSON.stringify(currentFormData.distributorLogin)) {
        form.setValue('distributorLogin', updatedFormData.distributorLogin);
      }
    }
  }, [ownerCpfCnpj, ownerDataNascimento, ownerType, form, performAutoFillDistributorLogin]);

  // Auto-fill para usinas existentes quando dados do proprietário mudarem
  useEffect(() => {
    const plants = form.getValues('plants');
    if (plants.length > 0 && (ownerCpfCnpj || ownerName || ownerAddress)) {
      console.log('🔄 [GENERATOR FORM] Atualizando usinas existentes com novos dados do proprietário');
      
      plants.forEach((_, index) => {
        const currentFormData = form.getValues();
        const updatedFormData = performAutoFillPlant(currentFormData, index);
        
        if (JSON.stringify(updatedFormData.plants[index]) !== JSON.stringify(currentFormData.plants[index])) {
          form.setValue(`plants.${index}`, updatedFormData.plants[index]);
          console.log(`✅ [GENERATOR FORM] Usina ${index + 1} atualizada com dados do proprietário`);
        }
      });
    }
  }, [ownerCpfCnpj, ownerName, ownerAddress, ownerDataNascimento, ownerType, form, performAutoFillPlant]);

  const handleCepLookup = async (cep: string, type: string, index?: number) => {
    // TODO: Implementar lookup de CEP
    console.log('CEP lookup:', { cep, type, index });
  };

  const addPlant = useCallback(() => {
    const currentPlants = form.getValues('plants');
    const owner = form.getValues('owner');
    
    console.log('🌱 [ADD PLANT] Dados do proprietário para auto-fill:', owner);
    
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
      contacts: [],
      observacoes: '',
      marcaModulo: '',
      potenciaModulo: 0,
      quantidadeModulos: 0,
      potenciaTotalUsina: 0,
      inversores: [],
      potenciaTotalInversores: 0,
      geracaoProjetada: 0,
      observacoesInstalacao: ''
    };

    console.log('✅ [ADD PLANT] Nova usina criada com auto-fill:', newPlant);
    
    const updatedPlants = [...currentPlants, newPlant];
    form.setValue('plants', updatedPlants);
    
    // Aplicar auto-fill adicional usando o hook de mapeamento
    const currentFormData = form.getValues();
    const updatedFormData = performAutoFillPlant(currentFormData, updatedPlants.length - 1);
    
    // Atualizar apenas se houve mudanças
    if (JSON.stringify(updatedFormData.plants[updatedPlants.length - 1]) !== JSON.stringify(newPlant)) {
      form.setValue('plants', updatedFormData.plants);
      console.log('✅ [ADD PLANT] Auto-fill adicional aplicado pela função de mapeamento');
    }
    
    toast("Nova usina adicionada com dados do proprietário preenchidos automaticamente.");
  }, [form, performAutoFillPlant]);

  const removePlant = (index: number) => {
    const currentPlants = form.getValues('plants');
    form.setValue('plants', currentPlants.filter((_, i) => i !== index));
  };

  const validateStep = useCallback((step: number): { isValid: boolean; errors: string[] } => {
    const formData = form.getValues();
    const errors: string[] = [];

    console.log('🔍 Validando step:', step, 'Dados:', formData);

    // Permitir navegar entre todas as etapas sem validações restritivas
    switch (step) {
      case 1: // Concessionária e Proprietário
        // Permitir navegar mesmo com campos vazios
        break;

      case 2: // Usinas
        // Permitir navegar mesmo sem usinas cadastradas
        break;

      case 3: // Login da Distribuidora
        // Permitir navegar mesmo sem dados completos
        break;

      case 4: // Pagamento (opcional)
        // Sempre permitir
        break;

      case 5: // Anexos (opcional)
        // Sempre permitir
        break;
    }

    console.log('📋 Resultado da validação:', { isValid: true, errors: [] });
    return { isValid: true, errors: [] };
  }, [form]);

  const saveGenerator = async (data: GeneratorFormData) => {
    setIsLoading(true);
    try {
      await createGenerator(data);
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
    isLoading
  };
};
