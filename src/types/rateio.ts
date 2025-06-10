
export interface RateioSubscriber {
  id: string;
  name: string;
  uc: string;
  contractedConsumption: number; // kWh/mês
  accumulatedCredit: number; // kWh
  percentage?: number; // para rateio por porcentagem
  priority?: number; // para rateio por prioridade
  lastInvoice?: string;
}

export interface RateioGenerator {
  id: string;
  nickname: string;
  uc: string;
  generation: number; // kWh
}

export interface RateioData {
  id?: string;
  generatorId: string;
  generator: RateioGenerator;
  type: 'percentage' | 'priority';
  date: {
    day: number;
    month: number;
    year: number;
  };
  expectedGeneration: number;
  subscribers: RateioSubscriber[];
  createdAt?: string;
  attachmentUrl?: string;
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
