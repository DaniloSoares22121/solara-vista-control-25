
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  User, 
  Building2, 
  MapPin, 
  Zap, 
  FileText, 
  Bell, 
  Paperclip,
  Save,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Calculator,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useCepLookup } from '@/hooks/useCepLookup';
import AddressForm from '@/components/forms/AddressForm';
import ContactsForm from '@/components/forms/ContactsForm';
import PlanTable from '@/components/forms/PlanTable';
import { SubscriberFormData } from '@/types/subscriber';

interface NovoAssinanteProps {
  onClose: () => void;
}

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SubscriberFormData>({
    concessionaria: '',
    subscriber: {
      type: 'fisica',
      cpfCnpj: '',
      numeroParceiroNegocio: '',
      name: '',
      dataNascimento: '',
      estadoCivil: '',
      profissao: '',
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
    administrator: {
      cpf: '',
      nome: '',
      dataNascimento: '',
      estadoCivil: '',
      profissao: '',
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
      whatsappFaturas: false,
      whatsappPagamento: false,
      notifications: {
        criarCobranca: { whatsapp: false, email: false },
        alteracaoValor: { whatsapp: false, email: false },
        vencimento1Dia: { whatsapp: false, email: false },
        vencimentoHoje: { whatsapp: false, email: false },
      },
      overdueNotifications: {
        day1: { whatsapp: false, email: false },
        day3: { whatsapp: false, email: false },
        day5: { whatsapp: false, email: false },
        day7: { whatsapp: false, email: false },
        day15: { whatsapp: false, email: false },
        day20: { whatsapp: false, email: false },
        day25: { whatsapp: false, email: false },
        day30: { whatsapp: false, email: false },
        after30: { whatsapp: false, email: false },
      },
    },
    attachments: {},
  });

  const { createSubscriber } = useSubscribers();

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createSubscriber(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao criar assinante:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Dados Pessoais', icon: User },
    { id: 2, title: 'Conta de Energia', icon: Zap },
    { id: 3, title: 'Plano & Contrato', icon: FileText },
    { id: 4, title: 'Configurações', icon: Bell }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Dados do Assinante */}
            <Card className="border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  Dados do Assinante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subscriber-name">Nome Completo *</Label>
                    <Input
                      id="subscriber-name"
                      value={formData.subscriber.name}
                      onChange={(e) => handleInputChange('subscriber', 'name', e.target.value)}
                      placeholder="Digite o nome completo"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriber-document">CPF/CNPJ *</Label>
                    <Input
                      id="subscriber-document"
                      value={formData.subscriber.cpfCnpj}
                      onChange={(e) => handleInputChange('subscriber', 'cpfCnpj', e.target.value)}
                      placeholder="000.000.000-00"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriber-email">E-mail *</Label>
                    <Input
                      id="subscriber-email"
                      type="email"
                      value={formData.subscriber.email}
                      onChange={(e) => handleInputChange('subscriber', 'email', e.target.value)}
                      placeholder="exemplo@email.com"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriber-phone">Telefone *</Label>
                    <Input
                      id="subscriber-phone"
                      value={formData.subscriber.telefone}
                      onChange={(e) => handleInputChange('subscriber', 'telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriber-birth">Data de Nascimento</Label>
                    <Input
                      id="subscriber-birth"
                      type="date"
                      value={formData.subscriber.dataNascimento}
                      onChange={(e) => handleInputChange('subscriber', 'dataNascimento', e.target.value)}
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Endereço
                  </h3>
                  
                  <AddressForm 
                    form={{ 
                      control: {}, 
                      getValues: () => formData.subscriber.address,
                      setValue: (name: string, value: any) => {
                        const field = name.replace('subscriber.address.', '');
                        handleNestedInputChange('subscriber', 'address', field, value);
                      }
                    } as any}
                    prefix="subscriber.address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Administrador */}
            <Card className="border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  Administrador da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="admin-is-subscriber"
                    checked={true}
                    onChange={() => {}}
                    className="rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor="admin-is-subscriber">O assinante é o administrador da conta</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Conta Original */}
            <Card className="border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  Conta de Energia Original
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original-uc">UC (Unidade Consumidora) *</Label>
                    <Input
                      id="original-uc"
                      value={formData.energyAccount.originalAccount.uc}
                      onChange={(e) => handleNestedInputChange('energyAccount', 'originalAccount', 'uc', e.target.value)}
                      placeholder="Ex: 0123456789"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="original-account">Número da Conta *</Label>
                    <Input
                      id="original-account"
                      value={formData.energyAccount.originalAccount.numeroParceiroUC}
                      onChange={(e) => handleNestedInputChange('energyAccount', 'originalAccount', 'numeroParceiroUC', e.target.value)}
                      placeholder="Ex: 987654321"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concessionaria">Concessionária *</Label>
                    <Select
                      value={formData.concessionaria}
                      onValueChange={(value) => handleInputChange('', 'concessionaria', value)}
                    >
                      <SelectTrigger className="focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enel">Enel</SelectItem>
                        <SelectItem value="cpfl">CPFL</SelectItem>
                        <SelectItem value="cemig">Cemig</SelectItem>
                        <SelectItem value="copel">Copel</SelectItem>
                        <SelectItem value="celesc">Celesc</SelectItem>
                        <SelectItem value="coelba">Coelba</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Contrato do Plano */}
            <Card className="border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  Contrato do Plano
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modalidade">Modalidade de Compensação *</Label>
                    <Select
                      value={formData.planContract.modalidadeCompensacao}
                      onValueChange={(value) => handleInputChange('planContract', 'modalidadeCompensacao', value)}
                    >
                      <SelectTrigger className="focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="autoconsumo">Autoconsumo Remoto</SelectItem>
                        <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kwh-contratado">kWh Contratado *</Label>
                    <Input
                      id="kwh-contratado"
                      type="number"
                      value={formData.planContract.kwhContratado}
                      onChange={(e) => handleInputChange('planContract', 'kwhContratado', Number(e.target.value))}
                      placeholder="Ex: 500"
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-inicio">Data de Início *</Label>
                    <Input
                      id="data-inicio"
                      type="date"
                      value={formData.planContract.dataAdesao}
                      onChange={(e) => handleInputChange('planContract', 'dataAdesao', e.target.value)}
                      className="focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Planos */}
            <Card className="border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Calculator className="w-5 h-5 text-green-600" />
                  </div>
                  Simulação de Economia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlanTable />
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Notificações */}
            <Card className="border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-gray-600">Receber faturas e avisos importantes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.notifications.criarCobranca.email}
                      onChange={(e) => handleNestedInputChange('notifications', 'notifications', 'criarCobranca', { 
                        ...formData.notifications.notifications.criarCobranca, 
                        email: e.target.checked 
                      })}
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Notificações por WhatsApp</Label>
                      <p className="text-sm text-gray-600">Receber atualizações via WhatsApp</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.whatsappFaturas}
                      onChange={(e) => handleInputChange('notifications', 'whatsappFaturas', e.target.checked)}
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  Resumo do Cadastro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium text-green-800">Assinante:</Label>
                    <p className="text-gray-700">{formData.subscriber.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="font-medium text-green-800">UC Original:</Label>
                    <p className="text-gray-700">{formData.energyAccount.originalAccount.uc || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="font-medium text-green-800">kWh Contratado:</Label>
                    <p className="text-gray-700">{formData.planContract.kwhContratado || 'Não informado'} kWh</p>
                  </div>
                  <div>
                    <Label className="font-medium text-green-800">Concessionária:</Label>
                    <p className="text-gray-700">{formData.concessionaria || 'Não informado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Assinante</h1>
              <p className="text-gray-600">Cadastrar novo cliente de energia solar</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-200 text-green-700">
              Etapa {currentStep} de {steps.length}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="border-gray-200 hover:bg-gray-50"
              >
                Anterior
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Finalizar Cadastro
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoAssinante;
