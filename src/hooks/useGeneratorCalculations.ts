
import { useCallback } from 'react';
import { PlantData } from '@/types/generator';

interface GenerationEstimate {
  estimatedGeneration: number;
  irradianceRegion: string;
}

export const useGeneratorCalculations = () => {
  // Mapa de irradiância por estado (kWh/kWp/dia)
  const irradianceMap: Record<string, { value: number; region: string }> = {
    'GO': { value: 5.2, region: 'Centro-Oeste' },
    'DF': { value: 5.1, region: 'Centro-Oeste' },
    'MT': { value: 5.3, region: 'Centro-Oeste' },
    'MS': { value: 5.0, region: 'Centro-Oeste' },
    'SP': { value: 4.8, region: 'Sudeste' },
    'RJ': { value: 4.6, region: 'Sudeste' },
    'MG': { value: 4.9, region: 'Sudeste' },
    'ES': { value: 4.7, region: 'Sudeste' },
    'BA': { value: 5.4, region: 'Nordeste' },
    'PE': { value: 5.6, region: 'Nordeste' },
    'CE': { value: 5.8, region: 'Nordeste' },
    'RN': { value: 5.7, region: 'Nordeste' },
    'PB': { value: 5.5, region: 'Nordeste' },
    'AL': { value: 5.3, region: 'Nordeste' },
    'SE': { value: 5.2, region: 'Nordeste' },
    'MA': { value: 5.1, region: 'Nordeste' },
    'PI': { value: 5.4, region: 'Nordeste' },
    'RS': { value: 4.3, region: 'Sul' },
    'SC': { value: 4.2, region: 'Sul' },
    'PR': { value: 4.4, region: 'Sul' },
    'AM': { value: 4.0, region: 'Norte' },
    'PA': { value: 4.2, region: 'Norte' },
    'AC': { value: 4.1, region: 'Norte' },
    'RO': { value: 4.3, region: 'Norte' },
    'RR': { value: 4.5, region: 'Norte' },
    'AP': { value: 4.4, region: 'Norte' },
    'TO': { value: 5.0, region: 'Norte' }
  };

  const calculateTotalPower = useCallback((potenciaModulo: number, quantidadeModulos: number): number => {
    if (!potenciaModulo || !quantidadeModulos) return 0;
    return (potenciaModulo * quantidadeModulos) / 1000; // Converter para kWp
  }, []);

  const calculateInverterTotalPower = useCallback((inversores: PlantData['inversores']): number => {
    if (!inversores || inversores.length === 0) return 0;
    
    return inversores.reduce((total, inversor) => {
      if (inversor.potencia && inversor.quantidade) {
        return total + (inversor.potencia * inversor.quantidade);
      }
      return total;
    }, 0);
  }, []);

  const estimateGeneration = useCallback((potenciaTotal: number, estado: string): GenerationEstimate => {
    const irradiance = irradianceMap[estado] || { value: 4.8, region: 'Média Nacional' };
    
    // Fórmula: Potência (kWp) × Irradiância (kWh/kWp/dia) × 30 dias × Fator de Performance (0.8)
    const estimatedGeneration = potenciaTotal * irradiance.value * 30 * 0.8;
    
    return {
      estimatedGeneration: Math.round(estimatedGeneration),
      irradianceRegion: irradiance.region
    };
  }, [irradianceMap]);

  const suggestPlantType = useCallback((potenciaTotal: number): 'micro' | 'mini' => {
    // Micro: até 75kW, Mini: acima de 75kW até 5MW
    return potenciaTotal <= 75 ? 'micro' : 'mini';
  }, []);

  const validateInverterCompatibility = useCallback((
    potenciaModulos: number, 
    potenciaInversores: number
  ): { isValid: boolean; message: string } => {
    if (!potenciaModulos || !potenciaInversores) {
      return { isValid: true, message: '' };
    }

    const ratio = potenciaModulos / potenciaInversores;
    
    if (ratio < 1.1) {
      return { 
        isValid: false, 
        message: 'Potência dos inversores muito alta. Recomendado: 110% a 130% da potência dos módulos.' 
      };
    } else if (ratio > 1.4) {
      return { 
        isValid: false, 
        message: 'Potência dos inversores muito baixa. Recomendado: 110% a 130% da potência dos módulos.' 
      };
    }
    
    return { isValid: true, message: 'Compatibilidade adequada entre módulos e inversores.' };
  }, []);

  return {
    calculateTotalPower,
    calculateInverterTotalPower,
    estimateGeneration,
    suggestPlantType,
    validateInverterCompatibility
  };
};
