
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
  const ownerName = form.watch('owner.name');
  const ownerType = form.watch('owner.type');
  const ownerAddress = form.watch('owner.address');
  const ownerNumeroParceiroNegocio = form.watch('owner.numeroParceiroNegocio');
  const plants = form.watch('plants');

  useEffect(() => {
    if (ownerCpfCnpj) {
      console.log('🔄 [GENERATOR FORM] Dados do proprietário mudaram, executando auto-fill do login');
      const currentFormData = form.getValues();
      const updatedFormData = performAutoFillDistributorLogin(currentFormData);
      
      if (JSON.stringify(updatedFormData.distributorLogin) !== JSON.stringify(currentFormData.distributorLogin)) {
        form.setValue('distributorLogin', updatedFormData.distributorLogin);
      }
    }
  }, [ownerCpfCnpj, ownerDataNascimento, form, performAutoFillDistributorLogin]);

  // Auto-fill para usinas quando os dados do proprietário mudarem ou quando usinas forem adicionadas
  useEffect(() => {
    if (plants && plants.length > 0) {
      console.log('🔄 [GENERATOR FORM] Executando auto-fill das usinas');
      const currentFormData = form.getValues();
      
      plants.forEach((plant, index) => {
        const updatedFormData = performAutoFillPlant(currentFormData, index);
        if (JSON.stringify(updatedFormData.plants[index]) !== JSON.stringify(currentFormData.plants[index])) {
          console.log(`🔄 [GENERATOR FORM] Atualizando usina ${index + 1} com dados do proprietário`);
          form.setValue(`plants.${index}`, updatedFormData.plants[index]);
        }
      });
    }
  }, [ownerCpfCnpj, ownerName, ownerType, ownerAddress, ownerNumeroParceiroNegocio, ownerDataNascimento, plants?.length, form, performAutoFillPlant]);

  const handleCepLookup = async (cep: string, type: string, index?: number) => {
    // TODO: Implementar lookup de CEP
    console.log('CEP lookup:', { cep, type, index });
  };

  const addPlant = useCallback(() => {
    const currentPlants = form.getValues('plants');
    const newPlant = {
      apelido: '',
      uc: '',
      tipoUsina: 'micro' as const,
      modalidadeCompensacao: 'autoconsumo' as const,
      ownerType: 'fisica' as const,
      ownerCpfCnpj: '',
      ownerName: '',
      ownerDataNascimento: '',
      ownerNumeroParceiroNegocio: '',
      address: {
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
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

    const plantIndex = currentPlants.length;
    form.setValue('plants', [...currentPlants, newPlant]);

    // Auto-fill imediato dos dados da nova usina
    console.log('🔄 [GENERATOR FORM] Nova usina adicionada, executando auto-fill imediatamente');
    setTimeout(() => {
      const formData = form.getValues();
      const updatedFormData = performAutoFillPlant(formData, plantIndex);
      if (updatedFormData.plants[plantIndex]) {
        console.log(`✅ [GENERATOR FORM] Auto-fill executado para nova usina ${plantIndex + 1}`);
        form.setValue(`plants.${plantIndex}`, updatedFormData.plants[plantIndex]);
      }
    }, 100);
  }, [form, performAutoFillPlant]);

  const removePlant = (index: number) => {
    const currentPlants = form.getValues('plants');
    form.setValue('plants', currentPlants.filter((_, i) => i !== index));
  };

  const validateStep = useCallback((step: number): { isValid: boolean; errors: string[] } => {
    const formData = form.getValues();
    const errors: string[] = [];

    console.log('🔍 Validando step:', step, 'Dados:', formData);

    // Remover todas as validações - permitir navegar entre etapas sem restrições
    switch (step) {
      case 1: // Concessionária e Proprietário
        // Sem validações obrigatórias
        break;

      case 2: // Usinas
        // Sem validações obrigatórias
        break;

      case 3: // Login da Distribuidora
        // Sem validações obrigatórias
        break;

      case 4: // Pagamento (opcional)
        // Sem validações obrigatórias
        break;

      case 5: // Anexos (opcional)
        // Sem validações obrigatórias
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
