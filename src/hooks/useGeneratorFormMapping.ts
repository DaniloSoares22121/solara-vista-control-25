
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorFormMapping = () => {
  const performAutoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL PLANT] Executando auto-fill AGRESSIVO para usina:', plantIndex);
    
    const owner = formData.owner;
    if (!owner) {
      console.log('❌ [AUTO-FILL PLANT] Nenhum proprietário encontrado');
      return formData;
    }

    const updatedFormData = { ...formData };
    const plant = updatedFormData.plants[plantIndex];
    
    if (plant) {
      console.log('📋 [AUTO-FILL PLANT] Dados do proprietário:', owner);
      console.log('📋 [AUTO-FILL PLANT] Usina ANTES do preenchimento:', plant);
      
      // FORÇAR preenchimento de TODOS os dados da usina
      plant.ownerType = owner.type;
      plant.ownerCpfCnpj = owner.cpfCnpj || '';
      plant.ownerName = owner.name || '';
      plant.ownerNumeroParceiroNegocio = owner.numeroParceiroNegocio || '';
      
      // Data de nascimento para pessoa física
      if (owner.type === 'fisica' && owner.dataNascimento) {
        plant.ownerDataNascimento = owner.dataNascimento;
      }

      // FORÇAR cópia completa do endereço
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
        console.log('📋 [AUTO-FILL PLANT] Endereço FORÇADAMENTE copiado:', plant.address);
      }

      // Garantir que contatos existam
      if (!plant.contacts || plant.contacts.length === 0) {
        plant.contacts = [];
      }

      console.log('✅ [AUTO-FILL PLANT] Usina APÓS preenchimento AGRESSIVO:', plant);
    } else {
      console.log('❌ [AUTO-FILL PLANT] Usina não encontrada no índice:', plantIndex);
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
      
      console.log('✅ [AUTO-FILL DISTRIBUTOR] Dados preenchidos automaticamente');
    }

    return updatedFormData;
  }, []);

  return {
    performAutoFillPlant,
    performAutoFillDistributorLogin
  };
};
