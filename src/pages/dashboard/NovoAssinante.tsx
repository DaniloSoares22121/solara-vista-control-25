
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Building, 
  MapPin, 
  Zap, 
  FileText, 
  MessageSquare,
  Upload,
  Check,
  X,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  FileCheck,
  Settings,
  Bell
} from 'lucide-react';
import ContactsForm from '@/components/forms/ContactsForm';
import PlanTable from '@/components/forms/PlanTable';
import { SubscriberFormData, Contact } from '@/types/subscriber';
import { useCepLookup } from '@/hooks/useCepLookup';

const subscriberFormSchema = z.object({
  concessionaria: z.string().min(1, 'Selecione uma concessionária'),
  subscriber: z.object({
    type: z.enum(['fisica', 'juridica']),
    cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    numeroParceiroNegocio: z.string().min(1, 'Número do parceiro de negócio é obrigatório'),
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    dataNascimento: z.string().optional(),
    estadoCivil: z.string().optional(),
    profissao: z.string().optional(),
    razaoSocial: z.string().optional(),
    nomeFantasia: z.string().optional(),
    address: z.object({
      cep: z.string().min(8, 'CEP deve ter 8 caracteres'),
      endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
      numero: z.string().min(1, 'Número é obrigatório'),
      complemento: z.string().optional(),
      bairro: z.string().min(3, 'Bairro deve ter pelo menos 3 caracteres'),
      cidade: z.string().min(3, 'Cidade deve ter pelo menos 3 caracteres'),
      estado: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
    }),
    telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 caracteres'),
    email: z.string().email('Email inválido'),
    observacoes: z.string().optional(),
    contacts: z.array(z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      role: z.string(),
    })).optional(),
  }),
});

interface NovoAssinanteProps {
  onClose?: () => void;
}

// Máscaras
const applyCpfMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const applyCnpjMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const applyPhoneMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1');
};

const applyCepMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { lookupCep, loading: cepLoading } = useCepLookup();

  const totalSteps = 10;

  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      concessionaria: 'Equatorial Goiás',
      subscriber: {
        type: 'fisica',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        name: '',
        dataNascimento: '',
        estadoCivil: '',
        profissao: '',
        razaoSocial: '',
        nomeFantasia: '',
        address: {
          cep: '',
          endereco: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
        telefone: '',
        email: '',
        observacoes: '',
        contacts: [],
      },
      energyAccount: {
        originalAccount: {
          type: 'fisica',
          cpfCnpj: '',
          name: '',
          dataNascimento: '',
          uc: '',
          numeroParceiroUC: '',
          address: {
            cep: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
          },
        },
        realizarTrocaTitularidade: false,
      },
      planContract: {
        modalidadeCompensacao: 'autoconsumo',
        dataAdesao: '',
        kwhVendedor: 0,
        kwhContratado: 0,
        faixaConsumo: '400-599',
        fidelidade: 'sem',
        desconto: 13,
      },
      planDetails: {
        clientePagaPisCofins: true,
        clientePagaFioB: false,
        adicionarValorDistribuidora: false,
        assinanteIsento: false,
      },
      notifications: {
        whatsappFaturas: true,
        whatsappPagamento: false,
        notifications: {
          criarCobranca: { whatsapp: true, email: true },
          alteracaoValor: { whatsapp: true, email: true },
          vencimento1Dia: { whatsapp: true, email: true },
          vencimentoHoje: { whatsapp: true, email: true },
        },
        overdueNotifications: {
          day1: { whatsapp: true, email: true },
          day3: { whatsapp: true, email: true },
          day5: { whatsapp: true, email: true },
          day7: { whatsapp: true, email: true },
          day15: { whatsapp: true, email: true },
          day20: { whatsapp: true, email: true },
          day25: { whatsapp: true, email: true },
          day30: { whatsapp: true, email: true },
          after30: { whatsapp: true, email: true },
        },
      },
      attachments: {},
    },
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data: SubscriberFormData) => {
    console.log('Form submitted:', { ...data, contacts });
    if (onClose) {
      onClose();
    }
  };

  const handleCepLookup = async (cep: string, prefix: string) => {
    if (cep.length === 9) {
      const addressData = await lookupCep(cep);
      if (addressData) {
        form.setValue(`${prefix}.endereco` as any, addressData.endereco);
        form.setValue(`${prefix}.bairro` as any, addressData.bairro);
        form.setValue(`${prefix}.cidade` as any, addressData.cidade);
        form.setValue(`${prefix}.estado` as any, addressData.estado);
        if (addressData.complemento) {
          form.setValue(`${prefix}.complemento` as any, addressData.complemento);
        }
      }
    }
  };

  const steps = [
    { id: 1, label: 'Dados Pessoais', icon: User, color: 'from-green-500 to-green-600' },
    { id: 2, label: 'Endereço Principal', icon: MapPin, color: 'from-green-500 to-green-600' },
    { id: 3, label: 'Administrador PJ', icon: Building, color: 'from-green-500 to-green-600' },
    { id: 4, label: 'Contatos', icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { id: 5, label: 'Conta Original', icon: Zap, color: 'from-green-500 to-green-600' },
    { id: 6, label: 'Nova Titularidade', icon: FileText, color: 'from-green-500 to-green-600' },
    { id: 7, label: 'Plano Escolhido', icon: CreditCard, color: 'from-green-500 to-green-600' },
    { id: 8, label: 'Detalhes do Plano', icon: Settings, color: 'from-green-500 to-green-600' },
    { id: 9, label: 'Notificações', icon: Bell, color: 'from-green-500 to-green-600' },
    { id: 10, label: 'Documentos', icon: FileCheck, color: 'from-green-500 to-green-600' },
  ];

  const subscriberType = form.watch('subscriber.type');
  const realizarTroca = form.watch('energyAccount.realizarTrocaTitularidade');
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-green-50/30">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${currentStepData.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <currentStepData.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Passo {currentStep}</h2>
              <p className="text-sm text-gray-600 font-medium">{currentStepData.label}</p>
            </div>
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex items-center justify-between mb-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                  currentStep > step.id 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                    : currentStep === step.id
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ring-4 ring-green-100'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <step.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
              Passo {currentStep} de {totalSteps} • {currentStepData.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1 h-full">
        <div className="p-4 sm:p-6 pb-32">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              {/* Step 1 - Dados Pessoais */}
              {currentStep === 1 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Informações Pessoais do Assinante
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Concessionária */}
                    <div className="p-6 bg-green-50/30 rounded-lg border border-green-200/50">
                      <FormField
                        control={form.control}
                        name="concessionaria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800 flex items-center gap-2">
                              <Building className="w-5 h-5 text-green-600" />
                              Concessionária de Energia *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg">
                                  <SelectValue placeholder="Selecione a concessionária de energia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="Equatorial Goiás">Equatorial Goiás</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Tipo de Pessoa */}
                    <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-200/50">
                      <FormField
                        control={form.control}
                        name="subscriber.type"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold text-gray-800">Tipo de Assinante *</FormLabel>
                            <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-6">
                              <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-green-300 rounded-lg hover:border-green-400 transition-colors bg-white">
                                <FormControl>
                                  <RadioGroupItem value="fisica" id="fisica" className="border-green-500 text-green-600" />
                                </FormControl>
                                <FormLabel htmlFor="fisica" className="font-medium text-gray-700 cursor-pointer">Pessoa Física</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-green-300 rounded-lg hover:border-green-400 transition-colors bg-white">
                                <FormControl>
                                  <RadioGroupItem value="juridica" id="juridica" className="border-green-500 text-green-600" />
                                </FormControl>
                                <FormLabel htmlFor="juridica" className="font-medium text-gray-700 cursor-pointer">Pessoa Jurídica</FormLabel>
                              </FormItem>
                            </RadioGroup>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Campos específicos do tipo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Coluna 1 */}
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="subscriber.cpfCnpj"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">
                                {subscriberType === 'fisica' ? 'CPF *' : 'CNPJ *'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} 
                                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const maskedValue = subscriberType === 'fisica' 
                                      ? applyCpfMask(value) 
                                      : applyCnpjMask(value);
                                    field.onChange(maskedValue);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subscriber.numeroParceiroNegocio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">Número Parceiro de Negócio *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Número do parceiro de negócio" 
                                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subscriber.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">
                                {subscriberType === 'fisica' ? 'Nome Completo do Titular *' : 'Razão Social *'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social da empresa'} 
                                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {subscriberType === 'juridica' && (
                          <FormField
                            control={form.control}
                            name="subscriber.nomeFantasia"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">Nome Fantasia</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nome fantasia" 
                                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="subscriber.telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" />
                                Telefone *
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(00) 00000-0000" 
                                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                  {...field}
                                  onChange={(e) => {
                                    const maskedValue = applyPhoneMask(e.target.value);
                                    field.onChange(maskedValue);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Coluna 2 */}
                      <div className="space-y-6">
                        {subscriberType === 'fisica' && (
                          <>
                            <FormField
                              control={form.control}
                              name="subscriber.dataNascimento"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    Data de Nascimento *
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="subscriber.estadoCivil"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700">Estado Civil *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg">
                                        <SelectValue placeholder="Selecione o estado civil" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white">
                                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                      <SelectItem value="casado">Casado(a)</SelectItem>
                                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="subscriber.profissao"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700">Profissão *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Profissão" 
                                      className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <FormField
                          control={form.control}
                          name="subscriber.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-green-500" />
                                E-mail *
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subscriber.observacoes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">Observações</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Observações adicionais" 
                                  className="min-h-[120px] border-gray-300 focus:border-green-500 focus:ring-green-500/20 resize-none bg-white rounded-lg"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2 - Endereço Principal */}
              {currentStep === 2 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      Endereço Principal do Assinante
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2">
                        <FormField
                          control={form.control}
                          name="subscriber.address.cep"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">CEP *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="00000-000" 
                                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                  {...field}
                                  onChange={(e) => {
                                    const maskedValue = applyCepMask(e.target.value);
                                    field.onChange(maskedValue);
                                    handleCepLookup(maskedValue, 'subscriber.address');
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                              {cepLoading && <p className="text-sm text-green-600">Buscando CEP...</p>}
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subscriber.address.endereco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">Endereço *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Rua, avenida..." 
                                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriber.address.numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">Número *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123" 
                                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriber.address.complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">Complemento</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Apt, Bloco..." 
                                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriber.address.bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">Bairro *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Bairro" 
                                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriber.address.cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">Cidade *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Cidade" 
                                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriber.address.estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">Estado *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Estado" 
                                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3 - Administrador PJ (só aparece se for PJ) */}
              {currentStep === 3 && subscriberType === 'juridica' && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      Dados do Administrador da Pessoa Jurídica
                      <Badge variant="outline" className="ml-auto text-blue-600 border-blue-200 bg-blue-50">
                        Obrigatório para PJ
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">CPF do Administrador *</Label>
                          <Input placeholder="000.000.000-00" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Nome do Administrador *</Label>
                          <Input placeholder="Nome completo" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Data de Nascimento *</Label>
                          <Input type="date" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Estado Civil *</Label>
                          <Select>
                            <SelectTrigger className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Profissão *</Label>
                          <Input placeholder="Profissão" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Telefone *</Label>
                          <Input placeholder="(00) 00000-0000" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">E-mail *</Label>
                          <Input placeholder="email@example.com" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Endereço Residencial do Administrador</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">CEP Residencial *</Label>
                          <Input placeholder="00000-000" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Endereço Residencial *</Label>
                          <Input placeholder="Rua, avenida..." className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Número *</Label>
                          <Input placeholder="123" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Complemento</Label>
                          <Input placeholder="Apt, Bloco..." className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Bairro *</Label>
                          <Input placeholder="Bairro" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Cidade *</Label>
                          <Input placeholder="Cidade" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Estado *</Label>
                          <Input placeholder="Estado" className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Se for Pessoa Física, pula o step 3 */}
              {currentStep === 3 && subscriberType === 'fisica' && nextStep()}

              {/* Step 4 - Contatos */}
              {currentStep === 4 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      Contatos Adicionais para Cobrança
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Opcional
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 bg-green-50/50 rounded-lg border border-green-200/50">
                      <p className="text-sm text-green-700 font-medium">
                        Adicione contatos que serão acionados caso o assinante principal não efetue o pagamento.
                      </p>
                    </div>
                    <ContactsForm contacts={contacts} onChange={setContacts} />
                  </CardContent>
                </Card>
              )}

              {/* Step 5 - Conta Original */}
              {currentStep === 5 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-yellow-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      Cadastro Original da Conta de Energia
                      <Badge variant="outline" className="ml-auto text-yellow-600 border-yellow-200 bg-yellow-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Tipo da conta original */}
                      <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-200/50">
                        <Label className="text-base font-semibold text-gray-800 mb-4 block">Tipo de Pessoa na Conta de Energia *</Label>
                        <RadioGroup defaultValue="fisica" className="flex gap-6">
                          <div className="flex items-center space-x-3 space-y-0 p-4 border border-yellow-300 rounded-lg hover:border-yellow-400 transition-colors bg-white">
                            <RadioGroupItem value="fisica" id="original-fisica" className="border-yellow-500 text-yellow-600" />
                            <Label htmlFor="original-fisica" className="font-medium text-gray-700 cursor-pointer">Pessoa Física</Label>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0 p-4 border border-yellow-300 rounded-lg hover:border-yellow-400 transition-colors bg-white">
                            <RadioGroupItem value="juridica" id="original-juridica" className="border-yellow-500 text-yellow-600" />
                            <Label htmlFor="original-juridica" className="font-medium text-gray-700 cursor-pointer">Pessoa Jurídica</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">CPF/CNPJ na Conta de Energia *</Label>
                            <Input placeholder="000.000.000-00 ou 00.000.000/0000-00" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Nome/Empresa na Conta de Energia *</Label>
                            <Input placeholder="Nome ou razão social" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Data de Nascimento (se PF)</Label>
                            <Input type="date" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">UC - Unidade Consumidora *</Label>
                            <Input placeholder="Número da UC" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Número do Parceiro UC *</Label>
                            <Input placeholder="Número do parceiro" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">CEP da Instalação *</Label>
                            <Input placeholder="00000-000" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Endereço da Instalação *</Label>
                            <Input placeholder="Rua, avenida..." className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Número *</Label>
                            <Input placeholder="123" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Complemento</Label>
                            <Input placeholder="Apt, Bloco..." className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Bairro *</Label>
                              <Input placeholder="Bairro" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                            </div>
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Cidade *</Label>
                              <Input placeholder="Cidade" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Estado *</Label>
                            <Input placeholder="Estado" className="mt-2 h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-white rounded-lg" />
                          </div>
                        </div>
                      </div>

                      {/* Pergunta sobre troca de titularidade */}
                      <div className="p-6 bg-blue-50/30 rounded-lg border border-blue-200/50 mt-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-semibold text-gray-800">Realizará Troca de Titularidade?</Label>
                            <p className="text-sm text-gray-600 mt-1">Se sim, será necessário informar os dados da nova titularidade no próximo passo.</p>
                          </div>
                          <div className="flex gap-4">
                            <Button variant="outline" className="px-6">Não</Button>
                            <Button className="px-6 bg-blue-600 hover:bg-blue-700">Sim</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 6 - Nova Titularidade (só aparece se marcou sim) */}
              {currentStep === 6 && realizarTroca && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Nova Titularidade da Conta de Energia
                      <Badge variant="outline" className="ml-auto text-purple-600 border-purple-200 bg-purple-50">
                        Obrigatório se troca
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Tipo da nova titularidade */}
                      <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200/50">
                        <Label className="text-base font-semibold text-gray-800 mb-4 block">Tipo de Pessoa para Nova Titularidade *</Label>
                        <RadioGroup defaultValue="fisica" className="flex gap-6">
                          <div className="flex items-center space-x-3 space-y-0 p-4 border border-purple-300 rounded-lg hover:border-purple-400 transition-colors bg-white">
                            <RadioGroupItem value="fisica" id="new-fisica" className="border-purple-500 text-purple-600" />
                            <Label htmlFor="new-fisica" className="font-medium text-gray-700 cursor-pointer">Pessoa Física</Label>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0 p-4 border border-purple-300 rounded-lg hover:border-purple-400 transition-colors bg-white">
                            <RadioGroupItem value="juridica" id="new-juridica" className="border-purple-500 text-purple-600" />
                            <Label htmlFor="new-juridica" className="font-medium text-gray-700 cursor-pointer">Pessoa Jurídica</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">CPF/CNPJ Nova Titularidade *</Label>
                            <Input placeholder="000.000.000-00 ou 00.000.000/0000-00" className="mt-2 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Nome/Empresa Nova Titularidade *</Label>
                            <Input placeholder="Nome ou razão social" className="mt-2 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Data de Nascimento (se PF)</Label>
                            <Input type="date" className="mt-2 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">UC - Unidade Consumidora</Label>
                            <Input placeholder="Mesmo UC da conta original" disabled className="mt-2 h-12 border-gray-200 bg-gray-50 rounded-lg" />
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Número do Parceiro UC *</Label>
                            <Input placeholder="Número do parceiro" className="mt-2 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white rounded-lg" />
                          </div>
                          
                          {/* Status da troca */}
                          <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-sm font-semibold text-gray-700">Troca de Titularidade Concluída?</Label>
                              <Switch />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm text-gray-600">Data da Conclusão</Label>
                                <Input type="date" className="mt-1 h-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white rounded-lg" />
                              </div>
                              <div>
                                <Label className="text-sm text-gray-600">Protocolo de Troca de Titularidade</Label>
                                <Button variant="outline" className="w-full mt-1 h-10 border-dashed border-2 hover:border-purple-300 hover:bg-purple-50/50">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Anexar Protocolo
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Se não vai fazer troca, pula o step 6 */}
              {currentStep === 6 && !realizarTroca && nextStep()}

              {/* Step 7 - Plano Escolhido */}
              {currentStep === 7 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      Contratação do Plano Escolhido
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      {/* Informações básicas do plano */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Modalidade de Compensação *</Label>
                            <Select defaultValue="autoconsumo">
                              <SelectTrigger className="mt-2 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="autoconsumo">AutoConsumo</SelectItem>
                                <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Data de Adesão *</Label>
                            <Input type="date" className="mt-2 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg" />
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">kWh Vendedor Informou *</Label>
                            <Input type="number" placeholder="0" className="mt-2 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">kWh Contratado (Gestor) *</Label>
                            <Input type="number" placeholder="0" className="mt-2 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-lg" />
                          </div>
                        </div>
                      </div>

                      {/* Tabela interativa de planos */}
                      <PlanTable 
                        selectedPlan={form.watch('planContract.faixaConsumo')}
                        fidelidade={form.watch('planContract.fidelidade')}
                        anosFidelidade={form.watch('planContract.anosFidelidade')}
                        onPlanChange={(faixaConsumo, fidelidade, anos, desconto) => {
                          form.setValue('planContract.faixaConsumo', faixaConsumo as any);
                          form.setValue('planContract.fidelidade', fidelidade);
                          form.setValue('planContract.anosFidelidade', anos);
                          form.setValue('planContract.desconto', desconto || 0);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 8 - Detalhes do Plano */}
              {currentStep === 8 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      Detalhes do Plano
                      <Badge variant="outline" className="ml-auto text-blue-600 border-blue-200 bg-blue-50">
                        Configurações
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Cliente Paga PIS e COFINS</Label>
                              <p className="text-xs text-gray-500">Tributos federais sobre energia</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Cliente Paga Fio B</Label>
                              <p className="text-xs text-gray-500">Taxa de distribuição</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Adicionar Valor da Distribuidora na Fatura</Label>
                              <p className="text-xs text-gray-500">Incluir taxas da distribuidora</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Assinante ISENTO de pagamento das Faturas</Label>
                              <p className="text-xs text-gray-500">Cliente não paga faturas de energia</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 9 - Notificações */}
              {currentStep === 9 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      Cadência de Mensagens (WhatsApp e E-Mail)
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Configurações
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      {/* Configurações gerais */}
                      <div className="p-6 bg-green-50/30 rounded-lg border border-green-200/50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Configurações Gerais</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Enviar por WhatsApp Faturas de Energia</Label>
                              <p className="text-xs text-gray-500">Envio automático das faturas</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Informar por WhatsApp Pagamento Recebido</Label>
                              <p className="text-xs text-gray-500">Confirmação de pagamentos</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      {/* Notificações antes do vencimento */}
                      <div className="p-6 bg-blue-50/30 rounded-lg border border-blue-200/50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Notificações Antes do Vencimento</h4>
                        <div className="space-y-4">
                          {[
                            { key: 'criarCobranca', label: 'Ao Criar Nova Cobrança' },
                            { key: 'alteracaoValor', label: 'Alteração de Valor ou Data de Vencimento' },
                            { key: 'vencimento1Dia', label: 'Aviso do Vencimento 1 Dia Antes' },
                            { key: 'vencimentoHoje', label: 'Aviso do Vencimento Hoje' },
                          ].map((item) => (
                            <div key={item.key} className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-white">
                              <div className="flex items-center">
                                <Label className="text-sm font-medium text-gray-700">{item.label}</Label>
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-gray-500">WhatsApp</Label>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-gray-500">E-Mail</Label>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notificações de cobranças vencidas */}
                      <div className="p-6 bg-red-50/30 rounded-lg border border-red-200/50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Notificações de Cobranças Vencidas</h4>
                        <div className="space-y-4">
                          {[
                            { key: 'day1', label: 'Aviso Cobrança Vencida a 1 dia' },
                            { key: 'day3', label: 'Aviso Cobrança Vencida 3 dias' },
                            { key: 'day5', label: 'Aviso Cobrança Vencida 5 dias' },
                            { key: 'day7', label: 'Aviso Cobrança Vencida 7 dias' },
                            { key: 'day15', label: 'Aviso Cobrança Vencida 15 dias' },
                            { key: 'day20', label: 'Aviso Cobrança Vencida 20 dias' },
                            { key: 'day25', label: 'Aviso Cobrança Vencida 25 dias' },
                            { key: 'day30', label: 'Aviso Cobrança Vencida 30 dias' },
                            { key: 'after30', label: 'Aviso Cobrança Vencida após 30 dias (5 em 5 dias)' },
                          ].map((item) => (
                            <div key={item.key} className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-white">
                              <div className="flex items-center">
                                <Label className="text-sm font-medium text-gray-700">{item.label}</Label>
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-gray-500">WhatsApp</Label>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-gray-500">E-Mail</Label>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 10 - Documentos */}
              {currentStep === 10 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 border-b border-gray-200 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-white" />
                      </div>
                      Anexos - Documentos Necessários
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2 mb-6">
                        <div className="p-6 bg-gradient-to-r from-green-50/80 to-green-100/50 rounded-lg border border-green-200/50">
                          <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                            <FileCheck className="w-4 h-4" />
                            Envie os documentos necessários para a ativação
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Arquivos aceitos: PDF, JPG, PNG (máx. 5MB cada)
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-lg border-gray-300">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-gray-800">Contrato do Assinante *</div>
                            <div className="text-xs text-gray-500">Documento principal assinado</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-lg border-gray-300">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-gray-800">CNH/RG do Titular *</div>
                            <div className="text-xs text-gray-500">Documento de identificação</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-lg border-gray-300">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-gray-800">Conta de Energia *</div>
                            <div className="text-xs text-gray-500">Fatura recente da UC</div>
                          </div>
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {subscriberType === 'juridica' && (
                          <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-lg border-gray-300">
                            <Upload className="w-5 h-5 mr-3 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-gray-800">Contrato Social *</div>
                              <div className="text-xs text-gray-500">Documento da empresa</div>
                            </div>
                          </Button>
                        )}
                        
                        {realizarTroca && (
                          <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-lg border-gray-300">
                            <Upload className="w-5 h-5 mr-3 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-gray-800">Procuração *</div>
                              <div className="text-xs text-gray-500">Para troca de titularidade</div>
                            </div>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>
      </ScrollArea>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white shadow-lg">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-2 sm:gap-3">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  className="px-4 sm:px-6 h-10 sm:h-12 border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 text-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
              )}
              {onClose && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose} 
                  className="px-4 sm:px-6 h-10 sm:h-12 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                >
                  Cancelar
                </Button>
              )}
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="px-6 sm:px-8 h-10 sm:h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg text-sm"
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <span className="sm:hidden">Próximo</span>
                  <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(onSubmit)}
                  className="px-6 sm:px-8 h-10 sm:h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg text-sm"
                >
                  <Check className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Finalizar Cadastro</span>
                  <span className="sm:hidden">Finalizar</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoAssinante;
