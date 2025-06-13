
import { useCallback } from 'react';

export const useGeneratorValidations = () => {
  const validateCPF = useCallback((cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false; // Sequências iguais
    
    // Validação do primeiro dígito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
    
    // Validação do segundo dígito
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
    
    return true;
  }, []);

  const validateCNPJ = useCallback((cnpj: string): boolean => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleanCnpj)) return false; // Sequências iguais
    
    // Validação do primeiro dígito
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cleanCnpj.charAt(12))) return false;
    
    // Validação do segundo dígito
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cleanCnpj.charAt(13))) return false;
    
    return true;
  }, []);

  const validateUC = useCallback((uc: string, concessionaria: string): { isValid: boolean; message: string } => {
    const cleanUc = uc.replace(/\D/g, '');
    
    // Validações básicas por concessionária
    const validationRules: Record<string, { length: number; format: RegExp }> = {
      'equatorial-goias': { length: 14, format: /^\d{14}$/ },
      'celg': { length: 14, format: /^\d{14}$/ },
      'enel-goias': { length: 14, format: /^\d{14}$/ }
    };
    
    const rule = validationRules[concessionaria];
    if (!rule) {
      return { isValid: true, message: '' }; // Concessionária não mapeada
    }
    
    if (cleanUc.length !== rule.length) {
      return { 
        isValid: false, 
        message: `UC deve ter ${rule.length} dígitos para esta concessionária.` 
      };
    }
    
    if (!rule.format.test(cleanUc)) {
      return { 
        isValid: false, 
        message: 'Formato de UC inválido para esta concessionária.' 
      };
    }
    
    return { isValid: true, message: 'UC válida.' };
  }, []);

  const generatePixSuggestion = useCallback((cpfCnpj: string, ownerType: 'fisica' | 'juridica'): string => {
    const cleanDoc = cpfCnpj.replace(/\D/g, '');
    
    if (ownerType === 'fisica' && cleanDoc.length === 11) {
      // Formatar CPF para PIX
      return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (ownerType === 'juridica' && cleanDoc.length === 14) {
      // Formatar CNPJ para PIX
      return cleanDoc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return cleanDoc;
  }, []);

  return {
    validateCPF,
    validateCNPJ,
    validateUC,
    generatePixSuggestion
  };
};
