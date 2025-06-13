
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorFormMapping = () => {
  const performAutoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL PLANT] Executando auto-fill COMPLETO para usina:', plantIndex);
    
    const owner = formData.owner;
    if (!owner) {
      console.log('❌ [AUTO-FILL PLANT] Nenhum proprietário encontrado');
      return formData;
    }

    const updatedFormData = { ...formData };
    const plant = updatedFormData.plants[plantIndex];
    
    if (plant) {
      console.log('📋 [AUTO-FILL PLANT] Aplicando TODAS as automações disponíveis');
      
      // AUTOMAÇÃO 1: Dados básicos do proprietário
      plant.ownerType = owner.type;
      plant.ownerCpfCnpj = owner.cpfCnpj || '';
      plant.ownerName = owner.name || '';
      plant.ownerNumeroParceiroNegocio = owner.numeroParceiroNegocio || '';
      
      // AUTOMAÇÃO 2: Data de nascimento para pessoa física
      if (owner.type === 'fisica' && owner.dataNascimento) {
        plant.ownerDataNascimento = owner.dataNascimento;
      }

      // AUTOMAÇÃO 3: Endereço completo da usina = endereço do proprietário
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
      }

      // AUTOMAÇÃO 4: Contatos básicos (telefone e email do proprietário)
      if (!plant.contacts || plant.contacts.length === 0) {
        const contacts = [];
        
        if (owner.telefone || owner.email) {
          contacts.push({
            nome: owner.name || 'Proprietário',
            telefone: owner.telefone || '',
            funcao: 'Proprietário'
          });
        }
        
        plant.contacts = contacts;
      }

      // AUTOMAÇÃO 5: Apelido da usina baseado no nome do proprietário
      if (!plant.apelido && owner.name) {
        const firstName = owner.name.split(' ')[0];
        plant.apelido = `Usina ${firstName} ${plantIndex + 1}`;
      }

      console.log('✅ [AUTO-FILL PLANT] TODAS as automações aplicadas:', plant);
    }

    return updatedFormData;
  }, []);

  const performAutoFillDistributorLogin = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL DISTRIBUTOR] Executando auto-fill COMPLETO para distribuidora');
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO 6: Login da distribuidora = dados do proprietário
    if (owner.cpfCnpj && !updatedFormData.distributorLogin.cpfCnpj) {
      updatedFormData.distributorLogin.cpfCnpj = owner.cpfCnpj;
    }
    
    // AUTOMAÇÃO 7: Data de nascimento para login (pessoa física)
    if (owner.type === 'fisica' && owner.dataNascimento && !updatedFormData.distributorLogin.dataNascimento) {
      updatedFormData.distributorLogin.dataNascimento = owner.dataNascimento;
    }

    // AUTOMAÇÃO 8: UC da primeira usina se existir
    if (formData.plants && formData.plants.length > 0 && formData.plants[0].uc && !updatedFormData.distributorLogin.uc) {
      updatedFormData.distributorLogin.uc = formData.plants[0].uc;
    }
    
    console.log('✅ [AUTO-FILL DISTRIBUTOR] Automações aplicadas');
    return updatedFormData;
  }, []);

  const performAutoFillPaymentData = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL PAYMENT] Executando auto-fill para dados de pagamento');
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO 9: PIX = CPF/CNPJ do proprietário (se não estiver preenchido)
    if (owner.cpfCnpj && !updatedFormData.paymentData.pix) {
      updatedFormData.paymentData.pix = owner.cpfCnpj;
      console.log('✅ [AUTO-FILL PAYMENT] PIX preenchido automaticamente com CPF/CNPJ');
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillAdministrator = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL ADMINISTRATOR] Executando auto-fill para administrador');
    
    const owner = formData.owner;
    if (!owner || owner.type !== 'juridica') return formData;

    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO 10: Endereço do administrador = endereço da empresa (se não preenchido)
    if (owner.address && (!updatedFormData.administrator?.address || !updatedFormData.administrator.address.cep)) {
      if (!updatedFormData.administrator) {
        updatedFormData.administrator = {
          cpf: '',
          nome: '',
          dataNascimento: '',
          address: owner.address,
          telefone: '',
          email: ''
        };
      } else if (!updatedFormData.administrator.address || !updatedFormData.administrator.address.cep) {
        updatedFormData.administrator.address = owner.address;
      }
      console.log('✅ [AUTO-FILL ADMINISTRATOR] Endereço do administrador preenchido');
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillFromUC = useCallback((formData: GeneratorFormData, plantIndex: number, uc: string): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL UC] Sincronizando UC com login da distribuidora');
    
    const updatedFormData = { ...formData };
    
    // AUTOMAÇÃO 11: Sincronizar UC da usina com login da distribuidora
    if (uc && plantIndex === 0 && !updatedFormData.distributorLogin.uc) {
      updatedFormData.distributorLogin.uc = uc;
      console.log('✅ [AUTO-FILL UC] UC sincronizada com login da distribuidora');
    }
    
    return updatedFormData;
  }, []);

  const performAutoFillAllPlants = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [AUTO-FILL ALL] Aplicando automações em TODAS as usinas');
    
    let updatedFormData = { ...formData };
    
    // Aplicar automações em todas as usinas existentes
    if (updatedFormData.plants && updatedFormData.plants.length > 0) {
      updatedFormData.plants.forEach((_, index) => {
        updatedFormData = performAutoFillPlant(updatedFormData, index);
      });
    }
    
    // Aplicar automações nos outros formulários
    updatedFormData = performAutoFillDistributorLogin(updatedFormData);
    updatedFormData = performAutoFillPaymentData(updatedFormData);
    updatedFormData = performAutoFillAdministrator(updatedFormData);
    
    return updatedFormData;
  }, [performAutoFillPlant, performAutoFillDistributorLogin, performAutoFillPaymentData, performAutoFillAdministrator]);

  return {
    performAutoFillPlant,
    performAutoFillDistributorLogin,
    performAutoFillPaymentData,
    performAutoFillAdministrator,
    performAutoFillFromUC,
    performAutoFillAllPlants
  };
};
