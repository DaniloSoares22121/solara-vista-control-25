
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

  // Auto-fill FORÇADO para usinas sempre que houver mudanças nos dados do proprietário
  useEffect(() => {
    if (plants && plants.length > 0 && (ownerCpfCnpj || ownerName || ownerAddress)) {
      console.log('🔄 [GENERATOR FORM] Forçando auto-fill das usinas com todos os dados do proprietário');
      const currentFormData = form.getValues();
      
      // Executar auto-fill para TODAS as usinas
      plants.forEach((plant, index) => {
        console.log(`🔄 [GENERATOR FORM] Processando usina ${index + 1}:`, plant);
        const updatedFormData = performAutoFillPlant(currentFormData, index);
        
        // SEMPRE atualizar, mesmo se aparentemente igual
        console.log(`🔄 [GENERATOR FORM] Forçando atualização da usina ${index + 1}`);
        form.setValue(`plants.${index}`, updatedFormData.plants[index]);
        
        // Forçar re-render dos campos específicos
        setTimeout(() => {
          const updatedPlant = updatedFormData.plants[index];
          if (updatedPlant) {
            form.setValue(`plants.${index}.ownerType`, updatedPlant.ownerType);
            form.setValue(`plants.${index}.ownerCpfCnpj`, updatedPlant.ownerCpfCnpj);
            form.setValue(`plants.${index}.ownerName`, updatedPlant.ownerName);
            form.setValue(`plants.${index}.ownerNumeroParceiroNegocio`, updatedPlant.ownerNumeroParceiroNegocio);
            if (updatedPlant.ownerDataNascimento) {
              form.setValue(`plants.${index}.ownerDataNascimento`, updatedPlant.ownerDataNascimento);
            }
            form.setValue(`plants.${index}.address`, updatedPlant.address);
          }
        }, 50);
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

    // Auto-fill IMEDIATO e FORÇADO dos dados da nova usina
    console.log('🔄 [GENERATOR FORM] Nova usina adicionada, executando auto-fill FORÇADO imediatamente');
    setTimeout(() => {
      const formData = form.getValues();
      const updatedFormData = performAutoFillPlant(formData, plantIndex);
      if (updatedFormData.plants[plantIndex]) {
        console.log(`✅ [GENERATOR FORM] Auto-fill FORÇADO executado para nova usina ${plantIndex + 1}`);
        const updatedPlant = updatedFormData.plants[plantIndex];
        
        // Atualizar TODOS os campos individualmente para garantir que apareçam na tela
        form.setValue(`plants.${plantIndex}`, updatedPlant);
        form.setValue(`plants.${plantIndex}.ownerType`, updatedPlant.ownerType);
        form.setValue(`plants.${plantIndex}.ownerCpfCnpj`, updatedPlant.ownerCpfCnpj);
        form.setValue(`plants.${plantIndex}.ownerName`, updatedPlant.ownerName);
        form.setValue(`plants.${plantIndex}.ownerNumeroParceiroNegocio`, updatedPlant.ownerNumeroParceiroNegocio);
        if (updatedPlant.ownerDataNascimento) {
          form.setValue(`plants.${plantIndex}.ownerDataNascimento`, updatedPlant.ownerDataNascimento);
        }
        form.setValue(`plants.${plantIndex}.address`, updatedPlant.address);
        
        console.log(`✅ [GENERATOR FORM] Todos os campos da usina ${plantIndex + 1} preenchidos:`, updatedPlant);
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
