
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorFormMapping = () => {
  const performAutoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL PLANT] Executando auto-fill para usina:', plantIndex);
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    const plant = updatedFormData.plants[plantIndex];
    
    if (plant && owner.cpfCnpj && owner.name) {
      console.log('📋 [AUTO-FILL PLANT] Preenchendo dados da usina com dados do proprietário');
      
      plant.ownerType = owner.type;
      plant.ownerCpfCnpj = owner.cpfCnpj;
      plant.ownerName = owner.name;
      plant.ownerNumeroParceiroNegocio = owner.numeroParceiroNegocio;
      
      if (owner.type === 'fisica') {
        plant.ownerDataNascimento = owner.dataNascimento || '';
      }

      // Copiar endereço se a usina não tiver endereço preenchido
      if (!plant.address.cep && owner.address.cep) {
        plant.address = { ...owner.address };
      }

      console.log('✅ [AUTO-FILL PLANT] Dados da usina preenchidos automaticamente');
    }

    return updatedFormData;
  }, []);

  const performAutoFillDistributorLogin = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL DISTRIBUTOR] Executando auto-fill para login da distribuidora');
    
    const owner = formData.owner;
    if (!owner || !owner.cpfCnpj) return formData;

    const updatedFormData = { ...formData };
    
    if (!updatedFormData.distributorLogin.cpfCnpj) {
      updatedFormData.distributorLogin.cpfCnpj = owner.cpfCnpj;
      
      if (owner.type === 'fisica' && owner.dataNascimento) {
        updatedFormData.distributorLogin.dataNascimento = owner.dataNascimento;
      }
      
      console.log('✅ [AUTO-FILL DISTRIBUTOR] Dados do login preenchidos automaticamente');
    }

    return updatedFormData;
  }, []);

  return {
    performAutoFillPlant,
    performAutoFillDistributorLogin
  };
};
