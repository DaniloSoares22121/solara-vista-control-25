
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorFormMapping = () => {
  const performAutoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL PLANT] Executando auto-fill para usina:', plantIndex);
    
    const owner = formData.owner;
    if (!owner) {
      console.log('❌ [AUTO-FILL PLANT] Dados do proprietário não encontrados');
      return formData;
    }

    const updatedFormData = { ...formData };
    const plant = updatedFormData.plants[plantIndex];
    
    if (plant) {
      console.log('📋 [AUTO-FILL PLANT] Preenchendo dados da usina com dados do proprietário');
      
      // Dados básicos do proprietário
      plant.ownerType = owner.type;
      plant.ownerCpfCnpj = owner.cpfCnpj || '';
      plant.ownerName = owner.name || '';
      plant.ownerNumeroParceiroNegocio = owner.numeroParceiroNegocio || '';
      
      // Data de nascimento apenas para pessoa física
      if (owner.type === 'fisica' && owner.dataNascimento) {
        plant.ownerDataNascimento = owner.dataNascimento;
      }

      // Copiar endereço completo do proprietário
      if (owner.address) {
        plant.address = {
          cep: owner.address.cep || '',
          endereco: owner.address.endereco || '',
          numero: owner.address.numero || '',
          complemento: owner.address.complemento || '',
          bairro: owner.address.bairro || '',
          cidade: owner.address.cidade || '',
          estado: owner.address.estado || ''
        };
        console.log('📍 [AUTO-FILL PLANT] Endereço copiado:', plant.address);
      }

      console.log('✅ [AUTO-FILL PLANT] Dados da usina preenchidos automaticamente');
    }

    return updatedFormData;
  }, []);

  const performAutoFillDistributorLogin = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL DISTRIBUTOR] Executando auto-fill para login da distribuidora');
    
    const owner = formData.owner;
    if (!owner || !owner.cpfCnpj) {
      console.log('❌ [AUTO-FILL DISTRIBUTOR] Dados do proprietário incompletos');
      return formData;
    }

    const updatedFormData = { ...formData };
    
    // Sempre preencher o CPF/CNPJ
    updatedFormData.distributorLogin.cpfCnpj = owner.cpfCnpj;
    
    // Preencher data de nascimento apenas para pessoa física
    if (owner.type === 'fisica' && owner.dataNascimento) {
      updatedFormData.distributorLogin.dataNascimento = owner.dataNascimento;
    }
    
    console.log('✅ [AUTO-FILL DISTRIBUTOR] Dados do login preenchidos automaticamente:', updatedFormData.distributorLogin);

    return updatedFormData;
  }, []);

  return {
    performAutoFillPlant,
    performAutoFillDistributorLogin
  };
};
