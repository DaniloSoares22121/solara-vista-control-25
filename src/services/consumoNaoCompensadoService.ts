
// Serviço para gerenciar valores de consumo não compensado por mês
export interface ConsumoNaoCompensadoData {
  monthReference: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

class ConsumoNaoCompensadoService {
  private storageKey = 'consumo_nao_compensado_valores';

  // Obter todos os valores salvos
  private getStoredValues(): Record<string, ConsumoNaoCompensadoData> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Erro ao ler valores do localStorage:', error);
      return {};
    }
  }

  // Salvar valores no localStorage
  private saveValues(values: Record<string, ConsumoNaoCompensadoData>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(values));
    } catch (error) {
      console.error('Erro ao salvar valores no localStorage:', error);
    }
  }

  // Salvar valor para um mês específico
  saveValueForMonth(monthReference: string, value: number): void {
    const values = this.getStoredValues();
    const now = new Date().toISOString();
    
    values[monthReference] = {
      monthReference,
      value,
      createdAt: values[monthReference]?.createdAt || now,
      updatedAt: now
    };

    this.saveValues(values);
    console.log(`💾 Valor salvo para ${monthReference}: ${value} kWh`);
  }

  // Obter valor para um mês específico
  getValueForMonth(monthReference: string): number | null {
    const values = this.getStoredValues();
    const data = values[monthReference];
    
    if (data) {
      console.log(`📖 Valor encontrado para ${monthReference}: ${data.value} kWh`);
      return data.value;
    }
    
    console.log(`❌ Nenhum valor encontrado para ${monthReference}`);
    return null;
  }

  // Verificar se existe valor para um mês
  hasValueForMonth(monthReference: string): boolean {
    return this.getValueForMonth(monthReference) !== null;
  }

  // Listar todos os valores salvos
  getAllValues(): ConsumoNaoCompensadoData[] {
    const values = this.getStoredValues();
    return Object.values(values).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Remover valor de um mês específico
  removeValueForMonth(monthReference: string): void {
    const values = this.getStoredValues();
    delete values[monthReference];
    this.saveValues(values);
    console.log(`🗑️ Valor removido para ${monthReference}`);
  }

  // Limpar todos os valores
  clearAllValues(): void {
    localStorage.removeItem(this.storageKey);
    console.log('🧹 Todos os valores limpos');
  }
}

export const consumoNaoCompensadoService = new ConsumoNaoCompensadoService();
