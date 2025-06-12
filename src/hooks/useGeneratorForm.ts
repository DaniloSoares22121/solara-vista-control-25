
import { useState } from 'react';
import { GeneratorFormData } from '@/types/generator';
import { useGenerators } from '@/hooks/useGenerators';

export const useGeneratorForm = () => {
  const { createGenerator } = useGenerators();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<GeneratorFormData>({
    concessionaria: '',
    owner: {
      type: 'fisica',
      cpfCnpj: '',
      numeroParceiroNegocio: '',
      name: '',
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
      cpfCnpj: ''
    },
    paymentData: {
      banco: '',
      agencia: '',
      conta: '',
      pix: ''
    },
    attachments: {}
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCepLookup = async (cep: string, type: string, index?: number) => {
    // TODO: Implementar lookup de CEP
    console.log('CEP lookup:', { cep, type, index });
  };

  const addPlant = () => {
    const newPlant = {
      apelido: '',
      uc: '',
      tipoUsina: 'micro' as const,
      modalidadeCompensacao: 'autoconsumo' as const,
      ownerType: 'fisica' as const,
      ownerCpfCnpj: '',
      ownerName: '',
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

    setFormData(prev => ({
      ...prev,
      plants: [...prev.plants, newPlant]
    }));
  };

  const removePlant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      plants: prev.plants.filter((_, i) => i !== index)
    }));
  };

  const saveGenerator = async () => {
    setIsLoading(true);
    try {
      await createGenerator(formData);
      // Reset form after successful save
      setFormData({
        concessionaria: '',
        owner: {
          type: 'fisica',
          cpfCnpj: '',
          numeroParceiroNegocio: '',
          name: '',
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
          cpfCnpj: ''
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
    formData,
    updateFormData,
    handleCepLookup,
    addPlant,
    removePlant,
    saveGenerator,
    isLoading
  };
};
