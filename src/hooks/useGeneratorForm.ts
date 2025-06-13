
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

  // Watch dos dados do proprietário
  const ownerCpfCnpj = form.watch('owner.cpfCnpj');
  const ownerDataNascimento = form.watch('owner.dataNascimento');
  const ownerName = form.watch('owner.name');
  const ownerType = form.watch('owner.type');
  const ownerAddress = form.watch('owner.address');
  const ownerNumeroParceiroNegocio = form.watch('owner.numeroParceiroNegocio');
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
  }, [ownerCpfCnpj, ownerDataNascimento, form, performAutoFillDistributorLogin]);

  // Auto-fill AGRESSIVO para todas as usinas sempre que houver mudanças nos dados do proprietário
  useEffect(() => {
    const owner = form.getValues('owner');
    const currentPlants = form.getValues('plants');
    
    if (currentPlants && currentPlants.length > 0 && (owner.cpfCnpj || owner.name)) {
      console.log('🔄 [GENERATOR FORM] FORÇANDO auto-fill de TODAS as usinas com dados do proprietário');
      
      currentPlants.forEach((plant, index) => {
        console.log(`🔄 [GENERATOR FORM] Processando usina ${index + 1}`);
        
        // Aplicar auto-fill
        const currentFormData = form.getValues();
        const updatedFormData = performAutoFillPlant(currentFormData, index);
        const updatedPlant = updatedFormData.plants[index];
        
        if (updatedPlant) {
          console.log(`✅ [GENERATOR FORM] Atualizando usina ${index + 1} com dados:`, updatedPlant);
          
          // Atualizar TODOS os campos da usina individualmente para forçar re-render
          form.setValue(`plants.${index}.ownerType`, updatedPlant.ownerType);
          form.setValue(`plants.${index}.ownerCpfCnpj`, updatedPlant.ownerCpfCnpj);
          form.setValue(`plants.${index}.ownerName`, updatedPlant.ownerName);
          form.setValue(`plants.${index}.ownerNumeroParceiroNegocio`, updatedPlant.ownerNumeroParceiroNegocio);
          
          if (updatedPlant.ownerDataNascimento) {
            form.setValue(`plants.${index}.ownerDataNascimento`, updatedPlant.ownerDataNascimento);
          }
          
          // Atualizar endereço campo por campo
          form.setValue(`plants.${index}.address.cep`, updatedPlant.address.cep);
          form.setValue(`plants.${index}.address.endereco`, updatedPlant.address.endereco);
          form.setValue(`plants.${index}.address.numero`, updatedPlant.address.numero);
          form.setValue(`plants.${index}.address.complemento`, updatedPlant.address.complemento);
          form.setValue(`plants.${index}.address.bairro`, updatedPlant.address.bairro);
          form.setValue(`plants.${index}.address.cidade`, updatedPlant.address.cidade);
          form.setValue(`plants.${index}.address.estado`, updatedPlant.address.estado);
          
          // Forçar trigger dos campos para garantir que apareçam na tela
          form.trigger([
            `plants.${index}.ownerType`,
            `plants.${index}.ownerCpfCnpj`,
            `plants.${index}.ownerName`,
            `plants.${index}.ownerNumeroParceiroNegocio`,
            `plants.${index}.ownerDataNascimento`,
            `plants.${index}.address.cep`,
            `plants.${index}.address.endereco`,
            `plants.${index}.address.numero`,
            `plants.${index}.address.complemento`,
            `plants.${index}.address.bairro`,
            `plants.${index}.address.cidade`,
            `plants.${index}.address.estado`
          ]);
        }
      });
    }
  }, [ownerCpfCnpj, ownerName, ownerType, ownerAddress, ownerNumeroParceiroNegocio, ownerDataNascimento, plants?.length, form, performAutoFillPlant]);

  const handleCepLookup = async (cep: string, type: string, index?: number) => {
    console.log('CEP lookup:', { cep, type, index });
  };

  const addPlant = useCallback(() => {
    const currentPlants = form.getValues('plants');
    const owner = form.getValues('owner');
    
    // Criar nova usina já com dados do proprietário
    const newPlant = {
      apelido: '',
      uc: '',
      tipoUsina: 'micro' as const,
      modalidadeCompensacao: 'autoconsumo' as const,
      ownerType: owner.type || 'fisica' as const,
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

    const plantIndex = currentPlants.length;
    console.log('🔄 [GENERATOR FORM] Adicionando nova usina PRÉ-PREENCHIDA:', newPlant);
    
    // Adicionar a nova usina
    form.setValue('plants', [...currentPlants, newPlant]);
    
    // Garantir que os dados apareçam na tela imediatamente
    setTimeout(() => {
      console.log(`✅ [GENERATOR FORM] Forçando atualização da nova usina ${plantIndex + 1}`);
      
      // Trigger todos os campos para garantir que apareçam
      form.trigger([
        `plants.${plantIndex}.ownerType`,
        `plants.${plantIndex}.ownerCpfCnpj`,
        `plants.${plantIndex}.ownerName`,
        `plants.${plantIndex}.ownerNumeroParceiroNegocio`,
        `plants.${plantIndex}.ownerDataNascimento`,
        `plants.${plantIndex}.address.cep`,
        `plants.${plantIndex}.address.endereco`,
        `plants.${plantIndex}.address.numero`,
        `plants.${plantIndex}.address.complemento`,
        `plants.${plantIndex}.address.bairro`,
        `plants.${plantIndex}.address.cidade`,
        `plants.${plantIndex}.address.estado`
      ]);
    }, 100);
  }, [form]);

  const removePlant = (index: number) => {
    const currentPlants = form.getValues('plants');
    form.setValue('plants', currentPlants.filter((_, i) => i !== index));
  };

  const validateStep = useCallback((step: number): { isValid: boolean; errors: string[] } => {
    console.log('🔍 Validando step:', step);
    return { isValid: true, errors: [] };
  }, []);

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
