
export interface Geradora {
  id: string;
  apelido: string;
  uc: string;
  geracao: string; // Ex: "15.000 kWh"
  geracaoNumero: number; // Ex: 15000
  percentualAlocado: number; // Ex: 85.5% (quanto já foi distribuído)
  concessionaria?: string;
}

export interface Assinante {
  id: string;
  nome: string;
  uc: string;
  consumoContratado: string; // Ex: "500 kWh"
  consumoNumero: number; // Ex: 500
  creditoAcumulado: string; // Ex: "100 kWh"
  concessionaria?: string;
}

export interface VinculoData {
  geradoraId: string;
  assinanteId: string;
  tipoRateio: "porcentagem" | "prioridade";
  valorRateio: number; // 70 (se porcentagem = 70%) ou 1 (se prioridade = 1ª)
  percentualAlocacao: number; // Sempre em % para somar na geradora
  status: "ativo" | "inativo";
}

export interface RateioItem {
  assinanteId: string;
  nome: string;
  uc: string;
  consumoNumero: number;
  porcentagem?: number; // Para rateio por porcentagem
  prioridade?: number; // Para rateio por prioridade
  valorAlocado?: number; // kWh calculado que receberá
  isNew: boolean; // Se é um novo assinante sendo adicionado
}

export interface RateioConfiguracao {
  geradoraId: string;
  novoAssinanteId?: string; // Opcional - se está adicionando novo assinante
  tipoRateio: "porcentagem" | "prioridade";
  dia: number;
  mes: number;
  ano: number;
  geracaoEsperada: number; // kWh para este mês
}

export interface RateioValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalPercentual?: number;
  energiaSobra?: number;
}

export interface RateioData {
  id?: string;
  geradoraId: string;
  geradora?: Geradora;
  dataRateio: string; // "15/06/2025"
  tipoRateio: "porcentagem" | "prioridade";
  geracaoEsperada: number;
  assinantesVinculados: number;
  assinantes: RateioItem[];
  totalDistribuido: number; // kWh total distribuído
  energiaSobra: number; // kWh que sobrou
  status: "pending" | "processed" | "completed";
  createdAt?: string;
  updatedAt?: string;
  attachmentUrl?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Interface para o formulário simplificada
export interface RateioFormData {
  configuracao: RateioConfiguracao;
  rateioItems: RateioItem[];
}
