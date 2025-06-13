
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorAutoFill = () => {
  const autoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('🔄 [GENERATOR AUTO-FILL] Executando auto-fill para usina:', plantIndex);
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    const plant = updatedFormData.plants[plantIndex];
    
    if (plant) {
      // Dados básicos do proprietário
      plant.ownerType = owner.type;
      plant.ownerCpfCnpj = owner.cpfCnpj || '';
      plant.ownerName = owner.name || '';
      plant.ownerNumeroParceiroNegocio = owner.numeroParceiroNegocio || '';
      
      // Data de nascimento para pessoa física
      if (owner.type === 'fisica' && owner.dataNascimento) {
        plant.ownerDataNascimento = owner.dataNascimento;
      }

      // Endereço completo
      if (owner.address && owner.address.cep) {
        plant.address = {
          cep: owner.address.cep,
          endereco: owner.address.endereco,
          numero: owner.address.numero,
          complemento: owner.address.complemento,
          bairro: owner.address.bairro,
          cidade: owner.address.cidade,
          estado: owner.address.estado
        };
      }

      // Contatos básicos
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

      // Apelido da usina
      if (!plant.apelido && owner.name) {
        const firstName = owner.name.split(' ')[0];
        plant.apelido = `Usina ${firstName} ${plantIndex + 1}`;
      }
    }

    return updatedFormData;
  }, []);

  const autoFillDistributorLogin = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [GENERATOR AUTO-FILL] Executando auto-fill para distribuidora');
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    
    // Login da distribuidora
    if (owner.cpfCnpj && !updatedFormData.distributorLogin.cpfCnpj) {
      updatedFormData.distributorLogin.cpfCnpj = owner.cpfCnpj;
    }
    
    // Data de nascimento
    if (owner.type === 'fisica' && owner.dataNascimento && !updatedFormData.distributorLogin.dataNascimento) {
      updatedFormData.distributorLogin.dataNascimento = owner.dataNascimento;
    }

    // UC da primeira usina
    if (formData.plants && formData.plants.length > 0 && formData.plants[0].uc && !updatedFormData.distributorLogin.uc) {
      updatedFormData.distributorLogin.uc = formData.plants[0].uc;
    }
    
    return updatedFormData;
  }, []);

  const autoFillPaymentData = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [GENERATOR AUTO-FILL] Executando auto-fill para pagamento');
    
    const owner = formData.owner;
    if (!owner) return formData;

    const updatedFormData = { ...formData };
    
    // PIX = CPF/CNPJ do proprietário
    if (owner.cpfCnpj && !updatedFormData.paymentData.pix) {
      updatedFormData.paymentData.pix = owner.cpfCnpj;
    }
    
    return updatedFormData;
  }, []);

  const autoFillAdministrator = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🔄 [GENERATOR AUTO-FILL] Executando auto-fill para administrador');
    
    const owner = formData.owner;
    if (!owner || owner.type !== 'juridica') return formData;

    const updatedFormData = { ...formData };
    
    // Endereço do administrador
    if (owner.address && owner.address.cep && (!updatedFormData.administrator?.address || !updatedFormData.administrator.address.cep)) {
      if (!updatedFormData.administrator) {
        updatedFormData.administrator = {
          cpf: '',
          nome: '',
          dataNascimento: '',
          address: {
            cep: owner.address.cep,
            endereco: owner.address.endereco,
            numero: owner.address.numero,
            complemento: owner.address.complemento,
            bairro: owner.address.bairro,
            cidade: owner.address.cidade,
            estado: owner.address.estado
          },
          telefone: '',
          email: ''
        };
      } else if (!updatedFormData.administrator.address || !updatedFormData.administrator.address.cep) {
        updatedFormData.administrator.address = {
          cep: owner.address.cep,
          endereco: owner.address.endereco,
          numero: owner.address.numero,
          complemento: owner.address.complemento,
          bairro: owner.address.bairro,
          cidade: owner.address.cidade,
          estado: owner.address.estado
        };
      }
    }
    
    return updatedFormData;
  }, []);

  const executeAllAutoFills = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('🚀 [GENERATOR AUTO-FILL] Executando TODAS as automações');
    
    let updatedData = { ...formData };
    
    // Auto-fill para todas as usinas
    if (updatedData.plants && updatedData.plants.length > 0) {
      updatedData.plants.forEach((_, index) => {
        updatedData = autoFillPlant(updatedData, index);
      });
    }
    
    // Auto-fill para outros formulários
    updatedData = autoFillDistributorLogin(updatedData);
    updatedData = autoFillPaymentData(updatedData);
    updatedData = autoFillAdministrator(updatedData);
    
    return updatedData;
  }, [autoFillPlant, autoFillDistributorLogin, autoFillPaymentData, autoFillAdministrator]);

  return {
    autoFillPlant,
    autoFillDistributorLogin,
    autoFillPaymentData,
    autoFillAdministrator,
    executeAllAutoFills
  };
};
