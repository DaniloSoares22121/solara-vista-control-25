
export interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export interface Address {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface PersonData {
  type: 'fisica' | 'juridica';
  cpfCnpj: string;
  numeroParceiroNegocio: string;
  name: string;
  dataNascimento?: string;
  estadoCivil?: string;
  profissao?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  address: Address;
  telefone: string;
  email: string;
  observacoes: string;
  contacts: Contact[];
}

export interface AdministratorData {
  cpf: string;
  nome: string;
  dataNascimento: string;
  estadoCivil: string;
  profissao: string;
  address: Address;
  telefone: string;
  email: string;
}

export interface EnergyAccount {
  originalAccount: PersonData;
  uc: string;
  numeroParceiroUC: string;
  realizarTrocaTitularidade: boolean;
  newTitularity?: PersonData & {
    trocaConcluida: boolean;
    dataTroca?: string;
    protocoloAnexo?: File;
  };
}

export interface PlanContract {
  modalidadeCompensacao: 'autoconsumo' | 'geracaoCompartilhada';
  dataAdesao: string;
  kwhVendedor: number;
  kwhContratado: number;
  faixaConsumo: '400-599' | '600-1099' | '1100-3099' | '3100-7000' | '7000+';
  fidelidade: 'sem' | 'com';
  anosFidelidade?: '1' | '2';
  desconto: number;
}

export interface PlanDetails {
  clientePagaPisCofins: boolean;
  clientePagaFioB: boolean;
  adicionarValorDistribuidora: boolean;
  assinanteIsento: boolean;
}

export interface NotificationSettings {
  whatsappFaturas: boolean;
  whatsappPagamento: boolean;
  
  notifications: {
    criarCobranca: { whatsapp: boolean; email: boolean };
    alteracaoValor: { whatsapp: boolean; email: boolean };
    vencimento1Dia: { whatsapp: boolean; email: boolean };
    vencimentoHoje: { whatsapp: boolean; email: boolean };
  };
  
  overdueNotifications: {
    day1: { whatsapp: boolean; email: boolean };
    day3: { whatsapp: boolean; email: boolean };
    day5: { whatsapp: boolean; email: boolean };
    day7: { whatsapp: boolean; email: boolean };
    day15: { whatsapp: boolean; email: boolean };
    day20: { whatsapp: boolean; email: boolean };
    day25: { whatsapp: boolean; email: boolean };
    day30: { whatsapp: boolean; email: boolean };
    after30: { whatsapp: boolean; email: boolean };
  };
}

export interface SubscriberFormData {
  concessionaria: string;
  subscriber: PersonData;
  administrator?: AdministratorData;
  energyAccount: EnergyAccount;
  planContract: PlanContract;
  planDetails: PlanDetails;
  notifications: NotificationSettings;
  attachments: {
    contrato?: File;
    cnh?: File;
    conta?: File;
    contratoSocial?: File;
    procuracao?: File;
  };
}
