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
import { Separator } from '@/components/ui/separator';
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
  tipoPessoa: z.enum(['fisica', 'juridica']).default('fisica'),
  nomeCompleto: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  dataNascimento: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  telefonePrincipal: z.string().min(10, { message: 'Telefone principal deve ter pelo menos 10 caracteres.' }),
  telefoneSecundario: z.string().optional(),
  observacoes: z.string().optional(),

  enderecoPrincipal: z.object({
    cep: z.string().min(8, { message: 'CEP deve ter pelo menos 8 caracteres.' }),
    endereco: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' }),
    numero: z.string().min(1, { message: 'Número deve ter pelo menos 1 caractere.' }),
    complemento: z.string().optional(),
    bairro: z.string().min(3, { message: 'Bairro deve ter pelo menos 3 caracteres.' }),
    cidade: z.string().min(3, { message: 'Cidade deve ter pelo menos 3 caracteres.' }),
    estado: z.string().min(2, { message: 'Estado deve ter pelo menos 2 caracteres.' }),
  }),

  enderecoInstalacao: z.object({
    cep: z.string().min(8, { message: 'CEP deve ter pelo menos 8 caracteres.' }),
    endereco: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' }),
    numero: z.string().min(1, { message: 'Número deve ter pelo menos 1 caractere.' }),
    complemento: z.string().optional(),
    bairro: z.string().min(3, { message: 'Bairro deve ter pelo menos 3 caracteres.' }),
    cidade: z.string().min(3, { message: 'Cidade deve ter pelo menos 3 caracteres.' }),
    estado: z.string().min(2, { message: 'Estado deve ter pelo menos 2 caracteres.' }),
  }),

  informacoesBancarias: z.object({
    banco: z.string().min(3, { message: 'Banco deve ter pelo menos 3 caracteres.' }),
    agencia: z.string().min(4, { message: 'Agência deve ter pelo menos 4 caracteres.' }),
    conta: z.string().min(5, { message: 'Conta deve ter pelo menos 5 caracteres.' }),
    tipoConta: z.enum(['corrente', 'poupanca']).default('corrente'),
    titularidade: z.enum(['titular', 'conjunta']).default('titular'),
    cpfCnpjTitular: z.string().min(11, { message: 'CPF/CNPJ do titular inválido.' }),
  }),

  documentos: z.array(z.string()).optional(),
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
      tipoPessoa: 'fisica',
      nomeCompleto: '',
      email: '',
      dataNascimento: '',
      cpf: '',
      cnpj: '',
      telefonePrincipal: '',
      telefoneSecundario: '',
      observacoes: '',
      enderecoPrincipal: {
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      enderecoInstalacao: {
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      informacoesBancarias: {
        banco: '',
        agencia: '',
        conta: '',
        tipoConta: 'corrente',
        titularidade: 'titular',
        cpfCnpjTitular: '',
      },
      documentos: [],
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
    // Here you would typically send the data to your backend
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

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <ul className="steps">
          {steps.map((step) => (
            <li key={step.id} className={`step ${currentStep > step.id ? 'step-primary' : ''}`}>
              {step.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step Content */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="tipoPessoa"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Pessoa</FormLabel>
                      <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="fisica" id="fisica" />
                          </FormControl>
                          <FormLabel htmlFor="fisica">Física</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="juridica" id="juridica" />
                          </FormControl>
                          <FormLabel htmlFor="juridica">Jurídica</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.getValues('tipoPessoa') === 'fisica' ? (
                  <>
                    <FormField
                      control={form.control}
                      name="dataNascimento"
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
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="telefonePrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefoneSecundario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Secundário</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observações adicionais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Endereço Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm form={form} prefix="enderecoPrincipal" />
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Instalação</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm form={form} prefix="enderecoInstalacao" />
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Contatos</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactsForm contacts={contacts} onChange={setContacts} />
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Informações Bancárias</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="informacoesBancarias.banco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Banco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="informacoesBancarias.agencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência</FormLabel>
                      <FormControl>
                        <Input placeholder="Número da Agência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="informacoesBancarias.conta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conta</FormLabel>
                      <FormControl>
                        <Input placeholder="Número da Conta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="informacoesBancarias.tipoConta"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Conta</FormLabel>
                      <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="corrente" id="corrente" />
                          </FormControl>
                          <FormLabel htmlFor="corrente">Corrente</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="poupanca" id="poupanca" />
                          </FormControl>
                          <FormLabel htmlFor="poupanca">Poupança</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="informacoesBancarias.titularidade"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Titularidade</FormLabel>
                      <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="titular" id="titular" />
                          </FormControl>
                          <FormLabel htmlFor="titular">Titular</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="conjunta" id="conjunta" />
                          </FormControl>
                          <FormLabel htmlFor="conjunta">Conjunta</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="informacoesBancarias.cpfCnpjTitular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ do Titular</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF ou CNPJ do titular da conta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <p className="text-sm text-gray-500">
                    Envie os documentos necessários para a ativação do assinante.
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 7 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmação</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Confirme os dados do assinante antes de salvar.
                </p>
                <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
                <pre>{JSON.stringify(contacts, null, 2)}</pre>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Salvar Assinante
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NovoAssinante;
