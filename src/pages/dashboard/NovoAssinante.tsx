
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
  FileCheck
} from 'lucide-react';
import AddressForm from '@/components/forms/AddressForm';
import ContactsForm from '@/components/forms/ContactsForm';
import { SubscriberFormData, Contact } from '@/types/subscriber';

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

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const totalSteps = 7;

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

  const steps = [
    { id: 1, label: 'Dados Pessoais', icon: User, color: 'from-green-500 to-green-600' },
    { id: 2, label: 'Endereço Principal', icon: MapPin, color: 'from-green-500 to-green-600' },
    { id: 3, label: 'Endereço de Instalação', icon: Building, color: 'from-green-500 to-green-600' },
    { id: 4, label: 'Contatos', icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { id: 5, label: 'Informações Bancárias', icon: CreditCard, color: 'from-green-500 to-green-600' },
    { id: 6, label: 'Documentos', icon: FileText, color: 'from-green-500 to-green-600' },
    { id: 7, label: 'Confirmação', icon: Check, color: 'from-green-500 to-green-600' },
  ];

  const subscriberType = form.watch('subscriber.type');
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50/50 via-white to-green-50/30">
      {/* Header with Progress */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25`}>
              <currentStepData.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold solar-text-gradient">Novo Assinante</h2>
              <p className="text-sm text-green-700 font-medium">{currentStepData.label}</p>
            </div>
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="text-green-400 hover:text-green-600 hover:bg-green-50 rounded-xl h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${
                  currentStep > step.id 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 scale-110' 
                    : currentStep === step.id
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-500/50 scale-125 ring-4 ring-green-100'
                    : 'bg-green-100 text-green-400 hover:bg-green-200'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                  {currentStep === step.id && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-600 animate-ping opacity-30"></div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-green-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-4 py-1.5 shadow-sm">
              Passo {currentStep} de {totalSteps} • {currentStepData.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1 - Dados Pessoais */}
              {currentStep === 1 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Informações Pessoais
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Coluna 1 */}
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="concessionaria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                <Building className="w-4 h-4 text-green-500" />
                                Concessionária
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl">
                                    <SelectValue placeholder="Selecione a concessionária" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Equatorial Goiás">Equatorial Goiás</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subscriber.type"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel className="text-sm font-semibold text-green-700">Tipo de Pessoa</FormLabel>
                              <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-6">
                                <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-green-200 rounded-xl hover:border-green-300 transition-colors bg-green-50/30">
                                  <FormControl>
                                    <RadioGroupItem value="fisica" id="fisica" className="border-green-500 text-green-500" />
                                  </FormControl>
                                  <FormLabel htmlFor="fisica" className="font-medium text-green-700 cursor-pointer">Pessoa Física</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-green-200 rounded-xl hover:border-green-300 transition-colors bg-green-50/30">
                                  <FormControl>
                                    <RadioGroupItem value="juridica" id="juridica" className="border-green-500 text-green-500" />
                                  </FormControl>
                                  <FormLabel htmlFor="juridica" className="font-medium text-green-700 cursor-pointer">Pessoa Jurídica</FormLabel>
                                </FormItem>
                              </RadioGroup>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subscriber.cpfCnpj"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-green-700">
                                {subscriberType === 'fisica' ? 'CPF' : 'CNPJ'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} 
                                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
                                  {...field} 
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
                              <FormLabel className="text-sm font-semibold text-green-700">Número Parceiro de Negócio</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Número do parceiro de negócio" 
                                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
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
                              <FormLabel className="text-sm font-semibold text-green-700">
                                {subscriberType === 'fisica' ? 'Nome Completo do Titular' : 'Razão Social'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social da empresa'} 
                                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Coluna 2 */}
                      <div className="space-y-6">
                        {subscriberType === 'juridica' && (
                          <FormField
                            control={form.control}
                            name="subscriber.nomeFantasia"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-green-700">Nome Fantasia</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nome fantasia" 
                                    className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {subscriberType === 'fisica' && (
                          <>
                            <FormField
                              control={form.control}
                              name="subscriber.dataNascimento"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    Data de Nascimento
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
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
                                  <FormLabel className="text-sm font-semibold text-green-700">Estado Civil</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl">
                                        <SelectValue placeholder="Selecione o estado civil" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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
                                  <FormLabel className="text-sm font-semibold text-green-700">Profissão</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Profissão" 
                                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
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
                          name="subscriber.telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" />
                                Telefone
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(00) 00000-0000" 
                                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subscriber.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-green-500" />
                                E-mail
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl"
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
                              <FormLabel className="text-sm font-semibold text-green-700">Observações</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Observações adicionais" 
                                  className="min-h-[120px] border-green-200 focus:border-green-500 focus:ring-green-500/20 resize-none bg-white rounded-xl"
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
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      Endereço Principal
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {/* Step 3 - Endereço de Instalação */}
              {currentStep === 3 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      Endereço de Instalação
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Opcional
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50/80 to-green-100/50 rounded-xl border border-green-200/50">
                      <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Mesmo endereço principal ou diferente?
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Se for o mesmo endereço, você pode pular esta etapa.
                      </p>
                    </div>
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {/* Step 4 - Contatos */}
              {currentStep === 4 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      Contatos Adicionais
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Opcional
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ContactsForm contacts={contacts} onChange={setContacts} />
                  </CardContent>
                </Card>
              )}

              {/* Step 5 - Informações Bancárias */}
              {currentStep === 5 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      Informações Bancárias
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Futuro
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2 mb-6">
                        <div className="p-6 bg-gradient-to-r from-green-50/80 to-green-100/50 rounded-xl border border-green-200/50">
                          <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Informações bancárias para débito automático
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Estas informações serão utilizadas para configurar o débito automático no futuro.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-green-700">Banco</Label>
                          <Input placeholder="Nome do banco" className="mt-2 h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-green-700">Agência</Label>
                          <Input placeholder="Número da agência" className="mt-2 h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-green-700">Conta</Label>
                          <Input placeholder="Número da conta" className="mt-2 h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-green-700">Tipo de Conta</Label>
                          <Select>
                            <SelectTrigger className="mt-2 h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white rounded-xl">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="corrente">Conta Corrente</SelectItem>
                              <SelectItem value="poupanca">Conta Poupança</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 6 - Documentos */}
              {currentStep === 6 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Documentos Necessários
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2 mb-6">
                        <div className="p-6 bg-gradient-to-r from-green-50/80 to-green-100/50 rounded-xl border border-green-200/50">
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
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-xl border-green-200">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-green-800">Contrato do Assinante</div>
                            <div className="text-xs text-green-500">Documento principal</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-xl border-green-200">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-green-800">CNH/RG do Titular</div>
                            <div className="text-xs text-green-500">Documento de identificação</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-xl border-green-200">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-green-800">Conta de Energia</div>
                            <div className="text-xs text-green-500">Fatura recente</div>
                          </div>
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {subscriberType === 'juridica' && (
                          <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-xl border-green-200">
                            <Upload className="w-5 h-5 mr-3 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-green-800">Contrato Social</div>
                              <div className="text-xs text-green-500">Documento da empresa</div>
                            </div>
                          </Button>
                        )}
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-green-300 hover:bg-green-50/50 rounded-xl border-green-200">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-green-800">Procuração</div>
                            <div className="text-xs text-green-500">Se necessário</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 7 - Confirmação */}
              {currentStep === 7 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/90 to-green-100/50 border-b border-green-100 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      Confirmação dos Dados
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                        Revisão
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 border border-green-200 rounded-xl bg-gradient-to-br from-green-50/50 to-white">
                          <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-600" />
                            Dados do Assinante
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-green-100">
                              <span className="text-sm text-green-600">Nome:</span>
                              <span className="text-sm font-medium text-green-800">{form.getValues('subscriber.name')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-green-100">
                              <span className="text-sm text-green-600">Tipo:</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {form.getValues('subscriber.type') === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-green-100">
                              <span className="text-sm text-green-600">Email:</span>
                              <span className="text-sm font-medium text-green-800">{form.getValues('subscriber.email')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-green-600">Telefone:</span>
                              <span className="text-sm font-medium text-green-800">{form.getValues('subscriber.telefone')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 border border-green-200 rounded-xl bg-gradient-to-br from-green-50/50 to-white">
                          <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            Endereço Principal
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-green-600">
                              <span className="font-medium">{form.getValues('subscriber.address.endereco')}, {form.getValues('subscriber.address.numero')}</span>
                            </p>
                            <p className="text-sm text-green-600">
                              {form.getValues('subscriber.address.bairro')} - {form.getValues('subscriber.address.cidade')}
                            </p>
                            <p className="text-sm text-green-600">
                              {form.getValues('subscriber.address.estado')} - CEP: {form.getValues('subscriber.address.cep')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {contacts.length > 0 && (
                          <div className="p-6 border border-green-200 rounded-xl bg-gradient-to-br from-green-50/50 to-white">
                            <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-green-600" />
                              Contatos Adicionais
                            </h4>
                            <div className="space-y-3">
                              {contacts.map((contact) => (
                                <div key={contact.id} className="p-3 bg-white rounded-lg border border-green-100">
                                  <p className="text-sm font-medium text-green-800">{contact.name}</p>
                                  <p className="text-sm text-green-600">{contact.phone}</p>
                                  <Badge variant="outline" className="text-xs mt-1 border-green-200 text-green-600">
                                    {contact.role}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-6 bg-gradient-to-r from-green-50/80 to-green-100/50 border border-green-200/50 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-green-700 font-semibold">
                                Dados verificados com sucesso!
                              </p>
                              <p className="text-xs text-green-600">
                                Todas as informações estão corretas
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-green-600 mt-3 p-3 bg-white/50 rounded-lg">
                            ✓ Clique em "Finalizar Cadastro" para salvar o assinante no sistema
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 border-t border-green-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  className="px-6 h-12 border-green-200 hover:bg-green-50 rounded-xl text-green-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
              {onClose && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose} 
                  className="px-6 h-12 text-green-600 hover:bg-green-100 rounded-xl"
                >
                  Cancelar
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="px-8 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(onSubmit)}
                  className="px-8 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Finalizar Cadastro
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
