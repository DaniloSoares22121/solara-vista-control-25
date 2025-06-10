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
  X
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
    { id: 1, label: 'Dados Pessoais', icon: User },
    { id: 2, label: 'Endereço Principal', icon: MapPin },
    { id: 3, label: 'Endereço de Instalação', icon: Building },
    { id: 4, label: 'Contatos', icon: MessageSquare },
    { id: 5, label: 'Informações Bancárias', icon: Zap },
    { id: 6, label: 'Documentos', icon: FileText },
    { id: 7, label: 'Confirmação', icon: Check },
  ];

  const subscriberType = form.watch('subscriber.type');

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header with Close Button and Progress */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Novo Assinante</h2>
                <p className="text-sm text-gray-600">Cadastre um novo assinante no sistema</p>
              </div>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-green-500 text-white shadow-lg scale-110' 
                    : currentStep === step.id - 1
                    ? 'bg-green-100 text-green-600 border-2 border-green-200'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                  {currentStep === step.id && (
                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="text-sm bg-green-50 text-green-700 border-green-200">
              {steps[currentStep - 1]?.label} • Passo {currentStep} de {totalSteps}
            </Badge>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step Content */}
              {currentStep === 1 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Coluna 1 */}
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="concessionaria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">Concessionária</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                              <FormLabel className="text-sm font-semibold text-gray-700">Tipo de Pessoa</FormLabel>
                              <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-6">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="fisica" id="fisica" className="border-green-500 text-green-500" />
                                  </FormControl>
                                  <FormLabel htmlFor="fisica" className="font-medium text-gray-700 cursor-pointer">Pessoa Física</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="juridica" id="juridica" className="border-green-500 text-green-500" />
                                  </FormControl>
                                  <FormLabel htmlFor="juridica" className="font-medium text-gray-700 cursor-pointer">Pessoa Jurídica</FormLabel>
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
                              <FormLabel className="text-sm font-semibold text-gray-700">
                                {subscriberType === 'fisica' ? 'CPF' : 'CNPJ'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} 
                                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                              <FormLabel className="text-sm font-semibold text-gray-700">Número Parceiro de Negócio</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Número do parceiro de negócio" 
                                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                {subscriberType === 'fisica' ? 'Nome Completo do Titular' : 'Razão Social'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social da empresa'} 
                                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                    className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
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
                                  <FormLabel className="text-sm font-semibold text-gray-700">Data de Nascimento</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                  <FormLabel className="text-sm font-semibold text-gray-700">Estado Civil</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                                  <FormLabel className="text-sm font-semibold text-gray-700">Profissão</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Profissão" 
                                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                              <FormLabel className="text-sm font-semibold text-gray-700">Telefone</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(00) 00000-0000" 
                                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                              <FormLabel className="text-sm font-semibold text-gray-700">E-mail</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                  className="min-h-[120px] border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
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

              {/* Keep existing steps 2-7 with improved styling */}
              {currentStep === 2 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      Endereço Principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-purple-600" />
                      </div>
                      Endereço de Instalação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        💡 Mesmo endereço principal ou diferente?
                      </p>
                    </div>
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {currentStep === 4 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      Contatos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ContactsForm contacts={contacts} onChange={setContacts} />
                  </CardContent>
                </Card>
              )}

              {currentStep === 5 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-600" />
                      </div>
                      Informações Bancárias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="xl:col-span-2 mb-6">
                        <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                          <p className="text-sm text-amber-700 font-medium">
                            🏦 Informações bancárias para débito automático (futuro)
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Banco</Label>
                          <Input placeholder="Nome do banco" className="mt-2 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Agência</Label>
                          <Input placeholder="Número da agência" className="mt-2 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Conta</Label>
                          <Input placeholder="Número da conta" className="mt-2 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Tipo de Conta</Label>
                          <Select>
                            <SelectTrigger className="mt-2 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500">
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

              {currentStep === 6 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-red-600" />
                      </div>
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="xl:col-span-2 mb-6">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <p className="text-sm text-blue-700 font-medium">
                            📄 Envie os documentos necessários para a ativação do assinante.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start h-12 border-dashed border-2 hover:border-green-300 hover:bg-green-50">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <span className="font-medium">Contrato do Assinante</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-12 border-dashed border-2 hover:border-green-300 hover:bg-green-50">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <span className="font-medium">CNH/RG do Titular</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-12 border-dashed border-2 hover:border-green-300 hover:bg-green-50">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <span className="font-medium">Conta de Energia</span>
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {subscriberType === 'juridica' && (
                          <Button variant="outline" className="w-full justify-start h-12 border-dashed border-2 hover:border-green-300 hover:bg-green-50">
                            <Upload className="w-5 h-5 mr-3 text-green-600" />
                            <span className="font-medium">Contrato Social</span>
                          </Button>
                        )}
                        <Button variant="outline" className="w-full justify-start h-12 border-dashed border-2 hover:border-green-300 hover:bg-green-50">
                          <Upload className="w-5 h-5 mr-3 text-green-600" />
                          <span className="font-medium">Procuração (se necessário)</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 7 && (
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      Confirmação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-green-600" />
                            Dados do Assinante
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">{form.getValues('subscriber.name')}</span> - {form.getValues('subscriber.type')}
                            </p>
                            <p className="text-sm text-gray-600">{form.getValues('subscriber.email')}</p>
                            <p className="text-sm text-gray-600">{form.getValues('subscriber.telefone')}</p>
                          </div>
                        </div>
                        
                        <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            Endereço
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              {form.getValues('subscriber.address.endereco')}, {form.getValues('subscriber.address.numero')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {form.getValues('subscriber.address.bairro')} - {form.getValues('subscriber.address.cidade')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {form.getValues('subscriber.address.estado')} - {form.getValues('subscriber.address.cep')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {contacts.length > 0 && (
                          <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-emerald-50 to-white">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-emerald-600" />
                              Contatos
                            </h4>
                            <div className="space-y-3">
                              {contacts.map((contact) => (
                                <div key={contact.id} className="p-3 bg-white rounded-lg border border-gray-100">
                                  <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                                  <p className="text-sm text-gray-600">{contact.phone}</p>
                                  <p className="text-xs text-gray-500">{contact.role}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-green-700 font-semibold">
                              Todos os dados foram preenchidos
                            </p>
                          </div>
                          <p className="text-xs text-green-600 ml-11">
                            Clique em "Salvar Assinante" para finalizar o cadastro
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

      {/* Fixed Footer with Navigation */}
      <div className="flex-shrink-0 border-t bg-white shadow-lg">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="px-6 h-11">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
              {onClose && (
                <Button type="button" variant="ghost" onClick={onClose} className="px-6 h-11 text-gray-600">
                  Cancelar
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="px-8 h-11 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(onSubmit)}
                  className="px-8 h-11 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Salvar Assinante
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
