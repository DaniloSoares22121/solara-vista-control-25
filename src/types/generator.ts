
export interface Address {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Contact {
  nome: string;
  telefone: string;
  funcao: string;
}

export interface GeneratorOwnerData {
  type: 'fisica' | 'juridica';
  cpfCnpj: string;
  numeroParceiroNegocio: string;
  name: string;
  dataNascimento?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  address: Address;
  telefone: string;
  email: string;
  observacoes: string;
}

export interface AdministratorData {
  cpf: string;
  nome: string;
  dataNascimento: string;
  address: Address;
  telefone: string;
  email: string;
}

export interface Inverter {
  marca: string;
  potencia: number;
  quantidade: number;
}

export interface PlantData {
  apelido: string;
  uc: string;
  tipoUsina: 'mini' | 'micro';
  modalidadeCompensacao: 'autoconsumo' | 'geracaoCompartilhada' | 'autoconsumoCompartilhada';
  ownerType: 'fisica' | 'juridica';
  ownerCpfCnpj: string;
  ownerName: string;
  ownerDataNascimento?: string;
  ownerNumeroParceiroNegocio: string;
  address: Address;
  contacts: Contact[];
  observacoes: string;
  // Dados da Instalação FV
  marcaModulo: string;
  potenciaModulo: number;
  quantidadeModulos: number;
  potenciaTotalUsina: number;
  inversores: Inverter[];
  potenciaTotalInversores: number;
  geracaoProjetada: number;
  observacoesInstalacao: string;
}

export interface DistributorLogin {
  uc: string;
  cpfCnpj: string;
  dataNascimento?: string;
}

export interface PaymentData {
  banco: string;
  agencia: string;
  conta: string;
  pix: string;
}

// Estrutura correta para os anexos - com objeto File opcional para edição
export interface FileUploadData {
  file?: File; // Opcional para permitir dados vindos da edição
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface GeneratorAttachments {
  contrato?: FileUploadData;
  cnh?: FileUploadData;
  contratoSocial?: FileUploadData;
  conta?: FileUploadData;
  procuracao?: FileUploadData;
}

export interface GeneratorFormData {
  concessionaria: string;
  owner: GeneratorOwnerData;
  administrator?: AdministratorData;
  plants: PlantData[];
  distributorLogin: DistributorLogin;
  paymentData: PaymentData;
  attachments: GeneratorAttachments;
}
