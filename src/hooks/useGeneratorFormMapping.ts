
import { useCallback } from 'react';
import { GeneratorFormData } from '@/types/generator';

export const useGeneratorFormMapping = () => {
  // Manter funções para compatibilidade com código existente
  const performAutoFillPlant = useCallback((formData: GeneratorFormData, plantIndex: number): GeneratorFormData => {
    console.log('⚠️ [DEPRECATED] Use useGeneratorAutoFill hook instead');
    return formData;
  }, []);

  const performAutoFillDistributorLogin = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('⚠️ [DEPRECATED] Use useGeneratorAutoFill hook instead');
    return formData;
  }, []);

  const performAutoFillPaymentData = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('⚠️ [DEPRECATED] Use useGeneratorAutoFill hook instead');
    return formData;
  }, []);

  const performAutoFillAdministrator = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('⚠️ [DEPRECATED] Use useGeneratorAutoFill hook instead');
    return formData;
  }, []);

  const performAutoFillFromUC = useCallback((formData: GeneratorFormData, plantIndex: number, uc: string): GeneratorFormData => {
    console.log('⚠️ [DEPRECATED] Use useGeneratorAutoFill hook instead');
    return formData;
  }, []);

  const performAutoFillAllPlants = useCallback((formData: GeneratorFormData): GeneratorFormData => {
    console.log('⚠️ [DEPRECATED] Use useGeneratorAutoFill hook instead');
    return formData;
  }, []);

  return {
    performAutoFillPlant,
    performAutoFillDistributorLogin,
    performAutoFillPaymentData,
    performAutoFillAdministrator,
    performAutoFillFromUC,
    performAutoFillAllPlants
  };
};
