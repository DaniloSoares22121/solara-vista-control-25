
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
import { Progress } from '@/components/ui/progress';
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
  Home,
  UserCheck,
  Contact,
  Shield,
  Sparkles
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
    { 
      id: 1, 
      label: 'Dados Pessoais', 
      icon: UserCheck, 
      description: 'Informações básicas do titular',
      color: 'primary'
    },
    { 
      id: 2, 
      label: 'Endereço Principal', 
      icon: Home, 
      description: 'Localização principal',
      color: 'secondary'
    },
    { 
      id: 3, 
      label: 'Endereço de Instalação', 
      icon: Building, 
      description: 'Local da instalação',
      color: 'accent'
    },
    { 
      id: 4, 
      label: 'Contatos', 
      icon: Contact, 
      description: 'Contatos adicionais',
      color: 'primary'
    },
    { 
      id: 5, 
      label: 'Informações Bancárias', 
      icon: CreditCard, 
      description: 'Dados para débito automático',
      color: 'secondary'
    },
    { 
      id: 6, 
      label: 'Documentos', 
      icon: FileCheck, 
      description: 'Upload de arquivos',
      color: 'accent'
    },
    { 
      id: 7, 
      label: 'Confirmação', 
      icon: Shield, 
      description: 'Revisão final dos dados',
      color: 'primary'
    },
  ];

  const subscriberType = form.watch('subscriber.type');
  const currentStepData = steps[currentStep - 1];
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Moderno */}
      <div className="flex-shrink-0 bg-card border-b border-border">
        <div className="p-6">
          {/* Título e Ações */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <currentStepData.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-accent-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Novo Assinante</h1>
                <p className="text-muted-foreground font-medium">{currentStepData.description}</p>
              </div>
            </div>
            {onClose && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="h-12 w-12 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          {/* Progress Bar Aprimorado */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-4 py-2 font-medium">
                Etapa {currentStep} de {totalSteps}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progressValue)}% concluído
              </span>
            </div>
            
            <Progress value={progressValue} className="h-3 bg-muted" />
            
            {/* Steps Navigation */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground shadow-xl scale-110 ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-foreground text-lg">{currentStepData.label}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Conteúdo Scrollável */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1 - Dados Pessoais */}
              {currentStep === 1 && (
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      Informações Pessoais
                      <Badge variant="destructive" className="ml-auto">
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
                              <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Building className="w-4 h-4 text-primary" />
                                Concessionária
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background">
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
                              <FormLabel className="text-sm font-semibold text-foreground">Tipo de Pessoa</FormLabel>
                              <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-border rounded-xl hover:border-primary/50 transition-colors bg-card">
                                  <FormControl>
                                    <RadioGroupItem value="fisica" id="fisica" className="border-primary text-primary" />
                                  </FormControl>
                                  <FormLabel htmlFor="fisica" className="font-medium text-foreground cursor-pointer">Pessoa Física</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-border rounded-xl hover:border-primary/50 transition-colors bg-card">
                                  <FormControl>
                                    <RadioGroupItem value="juridica" id="juridica" className="border-primary text-primary" />
                                  </FormControl>
                                  <FormLabel htmlFor="juridica" className="font-medium text-foreground cursor-pointer">Pessoa Jurídica</FormLabel>
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
                              <FormLabel className="text-sm font-semibold text-foreground">
                                {subscriberType === 'fisica' ? 'CPF' : 'CNPJ'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} 
                                  className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                              <FormLabel className="text-sm font-semibold text-foreground">Número Parceiro de Negócio</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Número do parceiro de negócio" 
                                  className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                              <FormLabel className="text-sm font-semibold text-foreground">
                                {subscriberType === 'fisica' ? 'Nome Completo do Titular' : 'Razão Social'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social da empresa'} 
                                  className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                                <FormLabel className="text-sm font-semibold text-foreground">Nome Fantasia</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nome fantasia" 
                                    className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Data de Nascimento
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                                  <FormLabel className="text-sm font-semibold text-foreground">Estado Civil</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background">
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
                                  <FormLabel className="text-sm font-semibold text-foreground">Profissão</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Profissão" 
                                      className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                              <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                Telefone
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(00) 00000-0000" 
                                  className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                              <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                E-mail
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  className="h-12 border-border focus:border-primary focus:ring-primary/20 bg-background"
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
                              <FormLabel className="text-sm font-semibold text-foreground">Observações</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Observações adicionais" 
                                  className="min-h-[120px] border-border focus:border-primary focus:ring-primary/20 resize-none bg-background"
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
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      Endereço Principal
                      <Badge variant="destructive" className="ml-auto">
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
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-accent-foreground" />
                      </div>
                      Endereço de Instalação
                      <Badge variant="secondary" className="ml-auto">
                        Opcional
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border">
                      <p className="text-sm text-foreground font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Mesmo endereço principal ou diferente?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Se for o mesmo endereço, você pode pular esta etapa.
                      </p>
                    </div>
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {/* Step 4 - Contatos */}
              {currentStep === 4 && (
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary-foreground" />
                      </div>
                      Contatos Adicionais
                      <Badge variant="secondary" className="ml-auto">
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
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      Informações Bancárias
                      <Badge variant="outline" className="ml-auto">
                        Futuro
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2 mb-6">
                        <div className="p-6 bg-muted/50 rounded-xl border border-border">
                          <p className="text-sm text-foreground font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Informações bancárias para débito automático
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Estas informações serão utilizadas para configurar o débito automático no futuro.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-foreground">Banco</Label>
                          <Input placeholder="Nome do banco" className="mt-2 h-12 border-border focus:border-primary focus:ring-primary/20 bg-background" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-foreground">Agência</Label>
                          <Input placeholder="Número da agência" className="mt-2 h-12 border-border focus:border-primary focus:ring-primary/20 bg-background" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-semibold text-foreground">Conta</Label>
                          <Input placeholder="Número da conta" className="mt-2 h-12 border-border focus:border-primary focus:ring-primary/20 bg-background" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-foreground">Tipo de Conta</Label>
                          <Select>
                            <SelectTrigger className="mt-2 h-12 border-border focus:border-primary focus:ring-primary/20 bg-background">
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
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent-foreground" />
                      </div>
                      Documentos Necessários
                      <Badge variant="destructive" className="ml-auto">
                        Obrigatório
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2 mb-6">
                        <div className="p-6 bg-muted/50 rounded-xl border border-border">
                          <p className="text-sm text-foreground font-medium flex items-center gap-2">
                            <FileCheck className="w-4 h-4" />
                            Envie os documentos necessários para a ativação
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Arquivos aceitos: PDF, JPG, PNG (máx. 5MB cada)
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-primary hover:bg-muted/50">
                          <Upload className="w-5 h-5 mr-3 text-primary" />
                          <div className="text-left">
                            <div className="font-medium text-foreground">Contrato do Assinante</div>
                            <div className="text-xs text-muted-foreground">Documento principal</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-primary hover:bg-muted/50">
                          <Upload className="w-5 h-5 mr-3 text-primary" />
                          <div className="text-left">
                            <div className="font-medium text-foreground">CNH/RG do Titular</div>
                            <div className="text-xs text-muted-foreground">Documento de identificação</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-primary hover:bg-muted/50">
                          <Upload className="w-5 h-5 mr-3 text-primary" />
                          <div className="text-left">
                            <div className="font-medium text-foreground">Conta de Energia</div>
                            <div className="text-xs text-muted-foreground">Fatura recente</div>
                          </div>
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {subscriberType === 'juridica' && (
                          <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-primary hover:bg-muted/50">
                            <Upload className="w-5 h-5 mr-3 text-primary" />
                            <div className="text-left">
                              <div className="font-medium text-foreground">Contrato Social</div>
                              <div className="text-xs text-muted-foreground">Documento da empresa</div>
                            </div>
                          </Button>
                        )}
                        <Button variant="outline" className="w-full justify-start h-16 border-dashed border-2 hover:border-primary hover:bg-muted/50">
                          <Upload className="w-5 h-5 mr-3 text-primary" />
                          <div className="text-left">
                            <div className="font-medium text-foreground">Procuração</div>
                            <div className="text-xs text-muted-foreground">Se necessário</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 7 - Confirmação */}
              {currentStep === 7 && (
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                      Confirmação dos Dados
                      <Badge variant="outline" className="ml-auto">
                        Revisão
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 border border-border rounded-xl bg-muted/30">
                          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Dados do Assinante
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Nome:</span>
                              <span className="text-sm font-medium text-foreground">{form.getValues('subscriber.name')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Tipo:</span>
                              <Badge variant="secondary">
                                {form.getValues('subscriber.type') === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Email:</span>
                              <span className="text-sm font-medium text-foreground">{form.getValues('subscriber.email')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-muted-foreground">Telefone:</span>
                              <span className="text-sm font-medium text-foreground">{form.getValues('subscriber.telefone')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 border border-border rounded-xl bg-muted/30">
                          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Endereço Principal
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">{form.getValues('subscriber.address.endereco')}, {form.getValues('subscriber.address.numero')}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {form.getValues('subscriber.address.bairro')} - {form.getValues('subscriber.address.cidade')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {form.getValues('subscriber.address.estado')} - CEP: {form.getValues('subscriber.address.cep')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {contacts.length > 0 && (
                          <div className="p-6 border border-border rounded-xl bg-muted/30">
                            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-primary" />
                              Contatos Adicionais
                            </h4>
                            <div className="space-y-3">
                              {contacts.map((contact) => (
                                <div key={contact.id} className="p-3 bg-background rounded-lg border border-border">
                                  <p className="text-sm font-medium text-foreground">{contact.name}</p>
                                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {contact.role}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-foreground font-semibold">
                                Dados verificados com sucesso!
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Todas as informações estão corretas
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 p-3 bg-background/50 rounded-lg">
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

      {/* Footer Fixo */}
      <div className="flex-shrink-0 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  className="px-6 h-12 border-border hover:bg-muted"
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
                  className="px-6 h-12 text-muted-foreground hover:bg-muted"
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
                  className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(onSubmit)}
                  className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
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
