
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { X, Plus, User, MapPin, Zap, FileText, Bell, Save, ArrowLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AddressForm from '@/components/forms/AddressForm';
import ContactsForm from '@/components/forms/ContactsForm';
import PlanTable from '@/components/forms/PlanTable';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';

// Form validation schema
const subscriberSchema = z.object({
  subscriber: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    address: z.object({
      cep: z.string().min(8, 'CEP é obrigatório'),
      endereco: z.string().min(1, 'Endereço é obrigatório'),
      numero: z.string().min(1, 'Número é obrigatório'),
      complemento: z.string().optional(),
      bairro: z.string().min(1, 'Bairro é obrigatório'),
      cidade: z.string().min(1, 'Cidade é obrigatória'),
      estado: z.string().min(1, 'Estado é obrigatório'),
    }),
  }),
  energyAccount: z.object({
    originalAccount: z.object({
      uc: z.string().min(1, 'UC é obrigatória'),
      numeroParceiroUC: z.string().min(1, 'Número do parceiro UC é obrigatório'),
    }),
  }),
  planContract: z.object({
    kwhContratado: z.number().min(1, 'kWh contratado é obrigatório'),
    modalidadeCompensacao: z.enum(['autoconsumo', 'geracaoCompartilhada']),
    fidelidade: z.enum(['sem', 'com']),
    anosFidelidade: z.enum(['1', '2']).optional(),
  }),
  contacts: z.array(z.any()).optional(),
  notifications: z.object({
    whatsappFaturas: z.boolean(),
    whatsappPagamento: z.boolean(),
  }),
  concessionaria: z.string().min(1, 'Concessionária é obrigatória'),
  attachments: z.object({
    contrato: z.any().optional(),
    cnh: z.any().optional(),
    conta: z.any().optional(),
    contratoSocial: z.any().optional(),
    procuracao: z.any().optional(),
  }).optional(),
});

interface NovoAssinanteProps {
  onClose: () => void;
}

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const { createSubscriber, loading } = useSubscribers();
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize form with react-hook-form and validation
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriber: {
        type: 'fisica',
        name: '',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        observacoes: '',
        address: {
          cep: '',
          endereco: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
        contacts: [],
      },
      energyAccount: {
        originalAccount: {
          type: 'fisica',
          cpfCnpj: '',
          name: '',
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
        desconto: 0,
      },
      planDetails: {
        clientePagaPisCofins: false,
        clientePagaFioB: false,
        adicionarValorDistribuidora: false,
        assinanteIsento: false,
      },
      notifications: {
        whatsappFaturas: true,
        whatsappPagamento: true,
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
      concessionaria: '',
      attachments: {},
    },
  });

  const formData = form.watch();

  const handleInputChange = (section: string, field: string, value: any) => {
    const currentSection = formData[section as keyof typeof formData];
    if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
      form.setValue(`${section}.${field}` as any, value);
    }
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    const currentSection = formData[section as keyof typeof formData];
    if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
      const currentSubsection = (currentSection as any)[subsection];
      if (typeof currentSubsection === 'object' && currentSubsection !== null && !Array.isArray(currentSubsection)) {
        form.setValue(`${section}.${subsection}.${field}` as any, value);
      }
    }
  };

  const handleAddressChange = (address: any) => {
    Object.keys(address).forEach(key => {
      form.setValue(`subscriber.address.${key}` as any, address[key]);
    });
  };

  const handleContactsChange = (contacts: any) => {
    form.setValue('subscriber.contacts', contacts);
  };

  const handlePlanChange = (planData: any) => {
    Object.keys(planData).forEach(key => {
      form.setValue(`planContract.${key}` as any, planData[key]);
    });
  };

  const handleSubmit = async () => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const formValues = form.getValues();
      console.log('📝 [FORM] Dados do formulário:', JSON.stringify(formValues, null, 2));
      
      await createSubscriber(formValues);
      
      toast.success('Assinante cadastrado com sucesso!');
      onClose();
    } catch (error) {
      console.error('❌ [FORM] Erro ao cadastrar assinante:', error);
      toast.error('Erro ao cadastrar assinante. Tente novamente.');
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Assinante</h1>
                <p className="text-sm text-gray-600">Cadastre um novo cliente de energia por UC</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Passo {currentStep} de 4
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-3">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-200 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Dados Pessoais</span>
            <span>Conta de Energia</span>
            <span>Plano & Contrato</span>
            <span>Finalização</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Step 1: Dados Pessoais */}
            {currentStep === 1 && (
              <Tabs defaultValue="dados-pessoais" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dados-pessoais" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Dados Pessoais</span>
                  </TabsTrigger>
                  <TabsTrigger value="endereco" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Endereço</span>
                  </TabsTrigger>
                  <TabsTrigger value="contatos" className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Contatos</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dados-pessoais" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-green-600" />
                        <span>Informações Básicas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            value={formData.subscriber.name}
                            onChange={(e) => handleInputChange('subscriber', 'name', e.target.value)}
                            placeholder="Digite o nome completo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                          <Input
                            id="cpfCnpj"
                            value={formData.subscriber.cpfCnpj}
                            onChange={(e) => handleInputChange('subscriber', 'cpfCnpj', e.target.value)}
                            placeholder="Digite o CPF ou CNPJ"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.subscriber.email}
                            onChange={(e) => handleInputChange('subscriber', 'email', e.target.value)}
                            placeholder="Digite o email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone *</Label>
                          <Input
                            id="telefone"
                            value={formData.subscriber.telefone}
                            onChange={(e) => handleInputChange('subscriber', 'telefone', e.target.value)}
                            placeholder="Digite o telefone"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                          <Input
                            id="dataNascimento"
                            type="date"
                            value={formData.subscriber.dataNascimento}
                            onChange={(e) => handleInputChange('subscriber', 'dataNascimento', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="concessionaria">Concessionária *</Label>
                          <Select
                            value={formData.concessionaria}
                            onValueChange={(value) => form.setValue('concessionaria', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a concessionária" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cpfl">CPFL</SelectItem>
                              <SelectItem value="enel">Enel</SelectItem>
                              <SelectItem value="elektro">Elektro</SelectItem>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="cemig">Cemig</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="endereco" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span>Endereço Residencial</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AddressForm 
                        form={form}
                        prefix="subscriber.address"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contatos" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-green-600" />
                        <span>Contatos e Notificações</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ContactsForm 
                        contacts={formData.subscriber.contacts || []}
                        onChange={handleContactsChange}
                      />
                      
                      <div className="mt-6 space-y-4">
                        <h4 className="font-medium text-gray-900">Preferências de Notificação</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="whatsapp-faturas">WhatsApp para Faturas</Label>
                            <Switch
                              id="whatsapp-faturas"
                              checked={formData.notifications.whatsappFaturas}
                              onCheckedChange={(checked) => handleNestedInputChange('notifications', '', 'whatsappFaturas', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="whatsapp-pagamento">WhatsApp para Pagamento</Label>
                            <Switch
                              id="whatsapp-pagamento"
                              checked={formData.notifications.whatsappPagamento}
                              onCheckedChange={(checked) => handleNestedInputChange('notifications', '', 'whatsappPagamento', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Step 2: Conta de Energia */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      <span>Conta Original</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="original-uc">UC (Unidade Consumidora) *</Label>
                        <Input
                          id="original-uc"
                          value={formData.energyAccount.originalAccount.uc}
                          onChange={(e) => handleNestedInputChange('energyAccount', 'originalAccount', 'uc', e.target.value)}
                          placeholder="Digite a UC"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original-parceiro">Número do Parceiro UC *</Label>
                        <Input
                          id="original-parceiro"
                          value={formData.energyAccount.originalAccount.numeroParceiroUC}
                          onChange={(e) => handleNestedInputChange('energyAccount', 'originalAccount', 'numeroParceiroUC', e.target.value)}
                          placeholder="Digite o número do parceiro"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Plano & Contrato */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>Detalhes do Contrato</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="kwh-contratado">kWh Contratado *</Label>
                        <Input
                          id="kwh-contratado"
                          type="number"
                          value={formData.planContract.kwhContratado}
                          onChange={(e) => handleNestedInputChange('planContract', '', 'kwhContratado', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="modalidade">Modalidade de Compensação *</Label>
                        <Select
                          value={formData.planContract.modalidadeCompensacao}
                          onValueChange={(value) => handleNestedInputChange('planContract', '', 'modalidadeCompensacao', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="autoconsumo">Autoconsumo</SelectItem>
                            <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fidelidade">Fidelidade *</Label>
                        <Select
                          value={formData.planContract.fidelidade}
                          onValueChange={(value) => handleNestedInputChange('planContract', '', 'fidelidade', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sem">Sem Fidelidade</SelectItem>
                            <SelectItem value="com">Com Fidelidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seleção de Plano</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlanTable 
                      selectedPlan={formData.planContract.faixaConsumo}
                      fidelidade={formData.planContract.fidelidade}
                      anosFidelidade={formData.planContract.anosFidelidade}
                      onPlanChange={handlePlanChange}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Finalização */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>Revisão dos Dados</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Dados Pessoais</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Nome:</strong> {formData.subscriber.name}</p>
                          <p><strong>CPF/CNPJ:</strong> {formData.subscriber.cpfCnpj}</p>
                          <p><strong>Email:</strong> {formData.subscriber.email}</p>
                          <p><strong>Telefone:</strong> {formData.subscriber.telefone}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Conta de Energia</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>UC Original:</strong> {formData.energyAccount.originalAccount.uc}</p>
                          <p><strong>Parceiro UC:</strong> {formData.energyAccount.originalAccount.numeroParceiroUC}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Plano Contratado</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>kWh Contratado:</strong> {formData.planContract.kwhContratado}</p>
                          <p><strong>Modalidade:</strong> {formData.planContract.modalidadeCompensacao}</p>
                          <p><strong>Fidelidade:</strong> {formData.planContract.fidelidade}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Endereço</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>CEP:</strong> {formData.subscriber.address.cep}</p>
                          <p><strong>Endereço:</strong> {formData.subscriber.address.endereco}, {formData.subscriber.address.numero}</p>
                          <p><strong>Bairro:</strong> {formData.subscriber.address.bairro}</p>
                          <p><strong>Cidade:</strong> {formData.subscriber.address.cidade} - {formData.subscriber.address.estado}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Próximo
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Cadastrar Assinante
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default NovoAssinante;
