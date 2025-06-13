
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

    // Auto-fill dos dados da nova usina
    setTimeout(() => {
      const formData = form.getValues();
      const updatedFormData = performAutoFillPlant(formData, plantIndex);
      if (updatedFormData.plants[plantIndex] !== formData.plants[plantIndex]) {
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

    switch (step) {
      case 1: // Concessionária e Proprietário
        if (!formData.concessionaria) errors.push('Selecione uma concessionária');
        if (!formData.owner.cpfCnpj) errors.push('CPF/CNPJ é obrigatório');
        if (!formData.owner.numeroParceiroNegocio) errors.push('Número Parceiro de Negócio é obrigatório');
        if (!formData.owner.name) errors.push('Nome é obrigatório');
        if (!formData.owner.address.cep) errors.push('CEP é obrigatório');
        if (!formData.owner.address.endereco) errors.push('Endereço é obrigatório');
        if (!formData.owner.address.numero) errors.push('Número é obrigatório');
        if (!formData.owner.address.bairro) errors.push('Bairro é obrigatório');
        if (!formData.owner.address.cidade) errors.push('Cidade é obrigatória');
        if (!formData.owner.address.estado) errors.push('Estado é obrigatório');
        if (!formData.owner.telefone) errors.push('Telefone é obrigatório');
        if (!formData.owner.email) errors.push('E-mail é obrigatório');
        
        if (formData.owner.type === 'fisica' && !formData.owner.dataNascimento) {
          errors.push('Data de nascimento é obrigatória');
        }
        break;

      case 2: // Usinas
        if (!formData.plants || formData.plants.length === 0) {
          errors.push('Cadastre pelo menos uma usina');
        } else {
          formData.plants.forEach((plant, index) => {
            if (!plant.apelido) errors.push(`Usina ${index + 1}: Apelido é obrigatório`);
            if (!plant.uc) errors.push(`Usina ${index + 1}: UC é obrigatória`);
            if (!plant.ownerCpfCnpj) errors.push(`Usina ${index + 1}: CPF/CNPJ é obrigatório`);
            if (!plant.ownerName) errors.push(`Usina ${index + 1}: Nome é obrigatório`);
            if (!plant.marcaModulo) errors.push(`Usina ${index + 1}: Marca do módulo é obrigatória`);
            if (!plant.potenciaModulo) errors.push(`Usina ${index + 1}: Potência do módulo é obrigatória`);
            if (!plant.quantidadeModulos) errors.push(`Usina ${index + 1}: Quantidade de módulos é obrigatória`);
            if (!plant.geracaoProjetada) errors.push(`Usina ${index + 1}: Geração projetada é obrigatória`);
            
            if (!plant.inversores || plant.inversores.length === 0) {
              errors.push(`Usina ${index + 1}: Cadastre pelo menos um inversor`);
            } else {
              plant.inversores.forEach((inv, invIndex) => {
                if (!inv.marca) errors.push(`Usina ${index + 1}, Inversor ${invIndex + 1}: Marca é obrigatória`);
                if (!inv.potencia) errors.push(`Usina ${index + 1}, Inversor ${invIndex + 1}: Potência é obrigatória`);
                if (!inv.quantidade) errors.push(`Usina ${index + 1}, Inversor ${invIndex + 1}: Quantidade é obrigatória`);
              });
            }
          });
        }
        break;

      case 3: // Login da Distribuidora
        if (!formData.distributorLogin.uc) errors.push('UC é obrigatória');
        if (!formData.distributorLogin.cpfCnpj) errors.push('CPF/CNPJ é obrigatório');
        break;
    }

    return { isValid: errors.length === 0, errors };
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
