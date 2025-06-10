
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

  const subscriberType = form.watch('subscriber.type');

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600 text-center">
          {steps[currentStep - 1]?.label} ({currentStep} de {totalSteps})
        </div>
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
                  name="subscriber.cpfCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{subscriberType === 'fisica' ? 'CPF' : 'CNPJ'}</FormLabel>
                      <FormControl>
                        <Input placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} {...field} />
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
                        <Input placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social da empresa'} {...field} />
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
                <AddressForm form={form} prefix="subscriber.address" />
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Instalação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  Mesmo endereço principal ou diferente?
                </div>
                <AddressForm form={form} prefix="subscriber.address" />
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
                <div className="text-sm text-gray-500">
                  Informações bancárias para débito automático (futuro)
                </div>
                <Input placeholder="Banco" />
                <Input placeholder="Agência" />
                <Input placeholder="Conta" />
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Dados do Assinante</h4>
                    <p className="text-sm text-gray-600">
                      {form.getValues('subscriber.name')} - {form.getValues('subscriber.type')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {form.getValues('subscriber.email')} - {form.getValues('subscriber.telefone')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Endereço</h4>
                    <p className="text-sm text-gray-600">
                      {form.getValues('subscriber.address.endereco')}, {form.getValues('subscriber.address.numero')} - {form.getValues('subscriber.address.bairro')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {form.getValues('subscriber.address.cidade')} - {form.getValues('subscriber.address.estado')}
                    </p>
                  </div>

                  {contacts.length > 0 && (
                    <div>
                      <h4 className="font-medium">Contatos</h4>
                      {contacts.map((contact) => (
                        <p key={contact.id} className="text-sm text-gray-600">
                          {contact.name} - {contact.phone} ({contact.role})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
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
