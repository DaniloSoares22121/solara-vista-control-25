
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorFormMapping = () => {
  const performAutoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL PLANT] Executando auto-fill para usina:', plantIndex);
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    const plant = updatedFormData.plants[plantIndex];
    
    if (plant) {
      console.log('📋 [AUTO-FILL PLANT] Dados do proprietário encontrados:', owner);
      console.log('📋 [AUTO-FILL PLANT] Usina antes do preenchimento:', plant);
      
      // Preencher TODOS os dados básicos da usina com dados do proprietário
      plant.ownerType = owner.type;
      plant.ownerCpfCnpj = owner.cpfCnpj || '';
      plant.ownerName = owner.name || '';
      plant.ownerNumeroParceiroNegocio = owner.numeroParceiroNegocio || '';
      
      // Preencher data de nascimento se for pessoa física
      if (owner.type === 'fisica') {
        plant.ownerDataNascimento = owner.dataNascimento || '';
      }

      // Copiar endereço COMPLETO do proprietário para a usina
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
        console.log('📋 [AUTO-FILL PLANT] Endereço completo copiado:', plant.address);
      }

      // Inicializar contatos vazios se não existirem
      if (!plant.contacts || plant.contacts.length === 0) {
        plant.contacts = [];
      }

      // Forçar atualização dos campos que podem estar vazios
      if (!plant.apelido) plant.apelido = '';
      if (!plant.uc) plant.uc = '';
      if (!plant.observacoes) plant.observacoes = '';
      if (!plant.observacoesInstalacao) plant.observacoesInstalacao = '';

      console.log('✅ [AUTO-FILL PLANT] Todos os dados da usina preenchidos automaticamente:', plant);
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
