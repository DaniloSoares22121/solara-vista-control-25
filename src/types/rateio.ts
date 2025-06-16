
export interface RateioSubscriber {
  id: string;
  name: string;
  uc: string;
  contractedConsumption: number; // kWh/mês
  accumulatedCredit: number; // kWh
  percentage?: number; // para rateio por porcentagem
  priority?: number; // para rateio por prioridade
  lastInvoice?: string;
  allocatedEnergy?: number; // energia alocada calculada
  creditUsed?: number; // crédito utilizado
  remainingCredit?: number; // crédito restante
}

export interface RateioGenerator {
  id: string;
  nickname: string;
  uc: string;
  generation: number; // kWh
  ownerName?: string;
  status?: 'active' | 'inactive';
}

export interface RateioCalculation {
  subscriberId: string;
  allocatedEnergy: number;
  creditUsed: number;
  remainingCredit: number;
  percentage: number;
  priority?: number;
}

export interface RateioData {
  id?: string;
  month: string;
  year: string;
  status: 'pending' | 'processed' | 'completed';
  totalAmount: number;
  subscribers: RateioSubscriber[];
  generatorId?: string;
  generator?: RateioGenerator;
  type?: 'percentage' | 'priority';
  date?: {
    day: number;
    month: number;
    year: number;
  };
  expectedGeneration?: number;
  actualGeneration?: number;
  calculations?: RateioCalculation[];
  createdAt?: string;
  updatedAt?: string;
  attachmentUrl?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface RateioFormData {
  generatorId: string;
  subscriberId: string;
  type: 'percentage' | 'priority';
  date: {
    day: number;
    month: number;
    year: number;
  };
  expectedGeneration: number;
}

export interface RateioValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
