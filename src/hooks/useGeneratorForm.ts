
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { useGenerators } from '@/hooks/useGenerators';
import { useGeneratorFormMapping } from '@/hooks/useGeneratorFormMapping';
import { toast } from 'sonner';

export const useGeneratorForm = () => {
  const { createGenerator } = useGenerators();
  const [isLoading, setIsLoading] = useState(false);
  const { 
    performAutoFillPlant, 
    performAutoFillDistributorLogin, 
    performAutoFillPaymentData,
    performAutoFillAdministrator,
    performAutoFillFromUC,
    performAutoFillAllPlants
  } = useGeneratorFormMapping();

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

  // Watch de TODOS os dados para automação máxima
  const ownerData = form.watch('owner');
  const plants = form.watch('plants');
  const distributorLogin = form.watch('distributorLogin');

  // AUTOMAÇÃO MEGA AGRESSIVA: Aplicar todas as automações sempre que qualquer dado muda
  useEffect(() => {
    console.log('🚀 [GENERATOR FORM] MEGA AUTOMAÇÃO ATIVADA - Sincronizando TUDO');
    
    const currentFormData = form.getValues();
    const automatedFormData = performAutoFillAllPlants(currentFormData);
    
    // Verificar se algo mudou para evitar loops infinitos
    const currentDataString = JSON.stringify(currentFormData);
    const automatedDataString = JSON.stringify(automatedFormData);
    
    if (currentDataString !== automatedDataString) {
      console.log('📝 [GENERATOR FORM] Aplicando automações detectadas');
      
      // Atualizar distribuidora
      if (JSON.stringify(automatedFormData.distributorLogin) !== JSON.stringify(currentFormData.distributorLogin)) {
        form.setValue('distributorLogin', automatedFormData.distributorLogin);
      }
      
      // Atualizar pagamento
      if (JSON.stringify(automatedFormData.paymentData) !== JSON.stringify(currentFormData.paymentData)) {
        form.setValue('paymentData', automatedFormData.paymentData);
      }
      
      // Atualizar administrador
      if (JSON.stringify(automatedFormData.administrator) !== JSON.stringify(currentFormData.administrator)) {
        form.setValue('administrator', automatedFormData.administrator);
      }
      
      // Atualizar usinas uma por uma para forçar re-render
      automatedFormData.plants?.forEach((automatedPlant, index) => {
        const currentPlant = currentFormData.plants?.[index];
        
        if (JSON.stringify(automatedPlant) !== JSON.stringify(currentPlant)) {
          console.log(`🔧 [GENERATOR FORM] Atualizando usina ${index + 1} com automações`);
          
          // Atualizar TODOS os campos da usina
          form.setValue(`plants.${index}`, automatedPlant);
          
          // Forçar trigger para garantir atualização visual
          setTimeout(() => {
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
              `plants.${index}.address.estado`,
              `plants.${index}.apelido`,
              `plants.${index}.contacts`
            ]);
          }, 50);
        }
      });
    }
  }, [
    ownerData.cpfCnpj, 
    ownerData.name, 
    ownerData.type, 
    ownerData.address?.cep,
    ownerData.address?.endereco,
    ownerData.address?.numero,
    ownerData.address?.bairro,
    ownerData.address?.cidade,
    ownerData.address?.estado,
    ownerData.numeroParceiroNegocio, 
    ownerData.dataNascimento,
    ownerData.telefone,
    ownerData.email,
    plants?.length, 
    form, 
    performAutoFillAllPlants
  ]);

  // AUTOMAÇÃO ESPECIAL: Sincronizar UC da primeira usina com login da distribuidora
  useEffect(() => {
    if (plants && plants[0]?.uc) {
      const currentFormData = form.getValues();
      const updatedFormData = performAutoFillFromUC(currentFormData, 0, plants[0].uc);
      
      if (JSON.stringify(updatedFormData.distributorLogin) !== JSON.stringify(currentFormData.distributorLogin)) {
        form.setValue('distributorLogin', updatedFormData.distributorLogin);
      }
    }
  }, [plants?.[0]?.uc, form, performAutoFillFromUC]);

  const handleCepLookup = async (cep: string, type: string, index?: number) => {
    console.log('CEP lookup:', { cep, type, index });
  };

  const addPlant = useCallback(() => {
    const currentPlants = form.getValues('plants');
    const owner = form.getValues('owner');
    
    console.log('🔄 [GENERATOR FORM] Adicionando nova usina com MÁXIMA automação');
    
    // Criar nova usina PRÉ-PREENCHIDA com TODAS as automações
    const firstName = owner.name ? owner.name.split(' ')[0] : '';
    const newPlant = {
      apelido: firstName ? `Usina ${firstName} ${currentPlants.length + 1}` : '',
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
      contacts: owner.telefone || owner.email ? [{
        nome: owner.name || 'Proprietário',
        telefone: owner.telefone || '',
        funcao: 'Proprietário'
      }] : [],
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

    console.log('✅ [GENERATOR FORM] Nova usina TOTALMENTE automatizada:', newPlant);
    form.setValue('plants', [...currentPlants, newPlant]);
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
