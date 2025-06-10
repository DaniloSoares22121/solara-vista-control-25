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
  Check
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header with Progress Bar */}
      <div className="flex-shrink-0 border-b border-border bg-card p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Novo Assinante</h2>
          <p className="text-muted-foreground">Preencha os dados para cadastrar um novo assinante</p>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                currentStep >= step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 transition-colors ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Badge variant="secondary" className="text-sm">
            {steps[currentStep - 1]?.label} ({currentStep} de {totalSteps})
          </Badge>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step Content */}
              {currentStep === 1 && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <User className="w-5 h-5" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Coluna 1 */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="concessionaria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Concessionária</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
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
                            <FormItem className="space-y-3">
                              <FormLabel>Tipo de Pessoa</FormLabel>
                              <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex flex-col space-y-3">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="fisica" id="fisica" />
                                  </FormControl>
                                  <FormLabel htmlFor="fisica" className="font-normal">Pessoa Física</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="juridica" id="juridica" />
                                  </FormControl>
                                  <FormLabel htmlFor="juridica" className="font-normal">Pessoa Jurídica</FormLabel>
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
                              <FormLabel>{subscriberType === 'fisica' ? 'CPF' : 'CNPJ'}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} 
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
                              <FormLabel>Número Parceiro de Negócio</FormLabel>
                              <FormControl>
                                <Input placeholder="Número do parceiro de negócio" {...field} />
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
                              <FormLabel>{subscriberType === 'fisica' ? 'Nome Completo do Titular' : 'Razão Social'}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social da empresa'} 
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
                                <FormLabel>Nome Fantasia</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome fantasia" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Coluna 2 */}
                      <div className="space-y-4">
                        {subscriberType === 'fisica' && (
                          <>
                            <FormField
                              control={form.control}
                              name="subscriber.dataNascimento"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Data de Nascimento</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
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
                                  <FormLabel>Estado Civil</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
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
                                  <FormLabel>Profissão</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Profissão" {...field} />
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
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
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
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
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
                              <FormLabel>Observações</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Observações adicionais" 
                                  className="min-h-[100px]"
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

              {currentStep === 2 && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-5 h-5" />
                      Endereço Principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Building className="w-5 h-5" />
                      Endereço de Instalação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Mesmo endereço principal ou diferente?
                      </p>
                    </div>
                    <AddressForm form={form} prefix="subscriber.address" />
                  </CardContent>
                </Card>
              )}

              {currentStep === 4 && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MessageSquare className="w-5 h-5" />
                      Contatos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ContactsForm contacts={contacts} onChange={setContacts} />
                  </CardContent>
                </Card>
              )}

              {currentStep === 5 && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Zap className="w-5 h-5" />
                      Informações Bancárias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2 mb-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Informações bancárias para débito automático (futuro)
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Banco</Label>
                          <Input placeholder="Nome do banco" className="mt-1" />
                        </div>
                        <div>
                          <Label>Agência</Label>
                          <Input placeholder="Número da agência" className="mt-1" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Conta</Label>
                          <Input placeholder="Número da conta" className="mt-1" />
                        </div>
                        <div>
                          <Label>Tipo de Conta</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
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
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="w-5 h-5" />
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2 mb-6">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Envie os documentos necessários para a ativação do assinante.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Contrato do Assinante
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          CNH/RG do Titular
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Conta de Energia
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {subscriberType === 'juridica' && (
                          <Button variant="outline" className="w-full justify-start">
                            <Upload className="w-4 h-4 mr-2" />
                            Contrato Social
                          </Button>
                        )}
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Procuração (se necessário)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 7 && (
                <Card className="border-border">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Check className="w-5 h-5" />
                      Confirmação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">Dados do Assinante</h4>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues('subscriber.name')} - {form.getValues('subscriber.type')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues('subscriber.email')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues('subscriber.telefone')}
                          </p>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">Endereço</h4>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues('subscriber.address.endereco')}, {form.getValues('subscriber.address.numero')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues('subscriber.address.bairro')} - {form.getValues('subscriber.address.cidade')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues('subscriber.address.estado')} - {form.getValues('subscriber.address.cep')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {contacts.length > 0 && (
                          <div className="p-4 border border-border rounded-lg">
                            <h4 className="font-semibold text-foreground mb-2">Contatos</h4>
                            {contacts.map((contact) => (
                              <div key={contact.id} className="mb-2 last:mb-0">
                                <p className="text-sm text-muted-foreground">
                                  {contact.name} - {contact.phone}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {contact.role}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            ✓ Todos os dados foram preenchidos corretamente
                          </p>
                          <p className="text-xs text-primary/80 mt-1">
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
      <div className="flex-shrink-0 border-t border-border bg-card p-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
            {onClose && (
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={form.handleSubmit(onSubmit)}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Salvar Assinante
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoAssinante;
