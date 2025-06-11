
export interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PersonalData {
  cpf: string;
  partnerNumber: string;
  fullName: string;
  birthDate: string;
  maritalStatus: string;
  profession: string;
  address: Address;
  phone: string;
  email: string;
  observations?: string;
  contacts: Contact[];
}

export interface CompanyData {
  cnpj: string;
  partnerNumber: string;
  companyName: string;
  fantasyName: string;
  address: Address;
  phone: string;
  email: string;
  observations?: string;
  contacts: Contact[];
}

export interface AdministratorData {
  cpf: string;
  fullName: string;
  birthDate: string;
  maritalStatus: string;
  profession: string;
  address: Address;
  phone: string;
  email: string;
}

export interface EnergyAccount {
  holderType: 'person' | 'company';
  cpfCnpj: string;
  holderName: string;
  birthDate?: string;
  uc: string;
  partnerNumber: string;
  address: Address;
}

export interface TitleTransfer {
  willTransfer: boolean;
  holderType?: 'person' | 'company';
  cpfCnpj?: string;
  holderName?: string;
  birthDate?: string;
  uc?: string;
  partnerNumber?: string;
  transferCompleted?: boolean;
  transferDate?: string;
  protocolFile?: File;
}

export interface PlanContract {
  selectedPlan: string;
  compensationMode: 'autoConsumption' | 'sharedGeneration';
  adhesionDate: string;
  informedKwh: number;
  contractedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  discountPercentage?: number;
}

export interface PlanDetails {
  paysPisAndCofins: boolean;
  paysWireB: boolean;
  addDistributorValue: boolean;
  exemptFromPayment: boolean;
}

export interface NotificationSettings {
  whatsapp: {
    sendInvoices: boolean;
    paymentReceived: boolean;
    createCharge: boolean;
    changeValueOrDate: boolean;
    oneDayBefore: boolean;
    onVencimentoDay: boolean;
    oneDayAfter: boolean;
    threeDaysAfter: boolean;
    fiveDaysAfter: boolean;
    sevenDaysAfter: boolean;
    fifteenDaysAfter: boolean;
    twentyDaysAfter: boolean;
    twentyFiveDaysAfter: boolean;
    thirtyDaysAfter: boolean;
    afterThirtyDays: boolean;
  };
  email: {
    createCharge: boolean;
    changeValueOrDate: boolean;
    oneDayBefore: boolean;
    onVencimentoDay: boolean;
    oneDayAfter: boolean;
    threeDaysAfter: boolean;
    fiveDaysAfter: boolean;
    sevenDaysAfter: boolean;
    fifteenDaysAfter: boolean;
    twentyDaysAfter: boolean;
    twentyFiveDaysAfter: boolean;
    thirtyDaysAfter: boolean;
    afterThirtyDays: boolean;
  };
}

export interface Attachments {
  contract?: File;
  cnh?: File;
  bill?: File;
  companyContract?: File;
  procuration?: File;
}

export interface SubscriberFormData {
  concessionaria: string;
  subscriberType: 'person' | 'company';
  personalData?: PersonalData;
  companyData?: CompanyData;
  administratorData?: AdministratorData;
  energyAccount: EnergyAccount;
  titleTransfer: TitleTransfer;
  planContract: PlanContract;
  planDetails: PlanDetails;
  notificationSettings: NotificationSettings;
  attachments: Attachments;
}

export interface DiscountTableData {
  kwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  percentage: number;
}

export const DISCOUNT_TABLE: DiscountTableData[] = [
  { kwh: 400, loyalty: 'none', percentage: 13 },
  { kwh: 400, loyalty: 'oneYear', percentage: 15 },
  { kwh: 400, loyalty: 'twoYears', percentage: 20 },
  { kwh: 600, loyalty: 'none', percentage: 15 },
  { kwh: 600, loyalty: 'oneYear', percentage: 18 },
  { kwh: 600, loyalty: 'twoYears', percentage: 20 },
  { kwh: 1100, loyalty: 'none', percentage: 18 },
  { kwh: 1100, loyalty: 'oneYear', percentage: 20 },
  { kwh: 1100, loyalty: 'twoYears', percentage: 22 },
  { kwh: 3100, loyalty: 'none', percentage: 20 },
  { kwh: 3100, loyalty: 'oneYear', percentage: 22 },
  { kwh: 3100, loyalty: 'twoYears', percentage: 25 },
  { kwh: 7000, loyalty: 'none', percentage: 22 },
  { kwh: 7000, loyalty: 'oneYear', percentage: 25 },
  { kwh: 7000, loyalty: 'twoYears', percentage: 27 },
];
