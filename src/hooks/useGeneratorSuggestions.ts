
import { useCallback } from 'react';
import { GeneratorFormData, Contact } from '@/types/generator';

export const useGeneratorSuggestions = () => {
  const generateAutoContact = useCallback((owner: GeneratorFormData['owner']): Contact => {
    return {
      nome: owner.name || '',
      telefone: owner.telefone || '',
      funcao: 'Proprietário'
    };
  }, []);

  const generateAutoObservations = useCallback((
    plantData: any,
    calculations: any
  ): string => {
    const observations = [];
    
    if (plantData.tipoUsina) {
      observations.push(`Usina do tipo ${plantData.tipoUsina === 'micro' ? 'microgeração' : 'minigeração'}.`);
    }
    
    if (calculations?.irradianceRegion) {
      observations.push(`Localizada na região ${calculations.irradianceRegion}.`);
    }
    
    if (plantData.potenciaTotalUsina) {
      observations.push(`Potência instalada de ${plantData.potenciaTotalUsina.toFixed(2)} kWp.`);
    }
    
    if (calculations?.estimatedGeneration) {
      observations.push(`Geração estimada de ${calculations.estimatedGeneration} kWh/mês.`);
    }
    
    return observations.join(' ');
  }, []);

  const suggestInverterBrand = useCallback((moduloBrand: string): string => {
    const brandMapping: Record<string, string[]> = {
      'canadian solar': ['Sungrow', 'Huawei', 'Growatt'],
      'jinko': ['Sungrow', 'Huawei', 'Fronius'],
      'trina solar': ['Sungrow', 'Huawei', 'ABB'],
      'ja solar': ['Growatt', 'Sungrow', 'Goodwe'],
      'risen': ['Growatt', 'Goodwe', 'Sungrow']
    };
    
    const normalizedBrand = moduloBrand.toLowerCase();
    const suggestions = brandMapping[normalizedBrand];
    
    return suggestions ? suggestions[0] : 'Sungrow'; // Default
  }, []);

  const suggestModulePower = useCallback((year = new Date().getFullYear()): number => {
    // Sugestão baseada no ano atual (tecnologia evolui)
    if (year >= 2024) return 580;
    if (year >= 2023) return 570;
    if (year >= 2022) return 550;
    return 540;
  }, []);

  const generateDefaultPaymentData = useCallback((
    existingGenerators: any[] = [],
    ownerCpfCnpj: string
  ) => {
    // Buscar dados de pagamento de geradoras existentes do mesmo proprietário
    const existingData = existingGenerators.find(gen => 
      gen.owner?.cpfCnpj === ownerCpfCnpj && gen.payment_data
    );
    
    if (existingData?.payment_data) {
      return {
        banco: existingData.payment_data.banco || '',
        agencia: existingData.payment_data.agencia || '',
        conta: existingData.payment_data.conta || '',
        pix: existingData.payment_data.pix || ''
      };
    }
    
    return {
      banco: '',
      agencia: '',
      conta: '',
      pix: ''
    };
  }, []);

  return {
    generateAutoContact,
    generateAutoObservations,
    suggestInverterBrand,
    suggestModulePower,
    generateDefaultPaymentData
  };
};
