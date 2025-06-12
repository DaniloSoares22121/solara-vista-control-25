import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGenerators } from '@/hooks/useGenerators';
import GeneratorConcessionariaForm from '@/components/forms/GeneratorConcessionariaForm';
import GeneratorOwnerTypeForm from '@/components/forms/GeneratorOwnerTypeForm';
import GeneratorOwnerDataForm from '@/components/forms/GeneratorOwnerDataForm';
import GeneratorAdministratorForm from '@/components/forms/GeneratorAdministratorForm';
import GeneratorPlantsForm from '@/components/forms/GeneratorPlantsForm';
import GeneratorDistributorLoginForm from '@/components/forms/GeneratorDistributorLoginForm';
import GeneratorPaymentForm from '@/components/forms/GeneratorPaymentForm';
import GeneratorAttachmentsForm from '@/components/forms/GeneratorAttachmentsForm';
import { GeneratorFormData } from '@/types/generator';

const generatorSchema = z.object({
  concessionaria: z.string().min(1, 'Selecione uma concessionária'),
  owner: z.object({
    type: z.enum(['fisica', 'juridica']),
    cpfCnpj: z.string().min(1, 'Campo obrigatório'),
    numeroParceiroNegocio: z.string().min(1, 'Campo obrigatório'),
    name: z.string().min(1, 'Campo obrigatório'),
    dataNascimento: z.string().optional(),
    razaoSocial: z.string().optional(),
    nomeFantasia: z.string().optional(),
    address: z.object({
      cep: z.string().min(1, 'CEP é obrigatório'),
      endereco: z.string().min(1, 'Endereço é obrigatório'),
      numero: z.string().min(1, 'Número é obrigatório'),
      complemento: z.string(),
      bairro: z.string().min(1, 'Bairro é obrigatório'),
      cidade: z.string().min(1, 'Cidade é obrigatória'),
      estado: z.string().min(1, 'Estado é obrigatório'),
    }),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('E-mail inválido'),
    observacoes: z.string(),
  }),
  administrator: z.object({
    cpf: z.string(),
    nome: z.string(),
    dataNascimento: z.string(),
    address: z.object({
      cep: z.string(),
      endereco: z.string(),
      numero: z.string(),
      complemento: z.string(),
      bairro: z.string(),
      cidade: z.string(),
      estado: z.string(),
    }),
    telefone: z.string(),
    email: z.string(),
  }).optional(),
  plants: z.array(z.any()).min(1, 'Cadastre pelo menos uma usina'),
  distributorLogin: z.object({
    uc: z.string().min(1, 'UC é obrigatória'),
    cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    dataNascimento: z.string().optional(),
  }),
  paymentData: z.object({
    banco: z.string().min(1, 'Banco é obrigatório'),
    agencia: z.string().min(1, 'Agência é obrigatória'),
    conta: z.string().min(1, 'Conta é obrigatória'),
    pix: z.string().optional(),
  }),
  attachments: z.object({}).default({}),
});

interface NovaGeradoraProps {
  onClose: () => void;
  editMode?: boolean;
  generatorData?: any;
}

const NovaGeradora = ({ onClose, editMode = false, generatorData }: NovaGeradoraProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const totalSteps = 5;
  const { toast } = useToast();
  const { createGenerator, updateGenerator } = useGenerators();

  const form = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      concessionaria: '',
      owner: {
        type: 'fisica',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        name: '',
        dataNascimento: '',
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
      },
      plants: [],
      distributorLogin: {
        uc: '',
        cpfCnpj: '',
        dataNascimento: '',
      },
      paymentData: {
        banco: '',
        agencia: '',
        conta: '',
        pix: '',
      },
      attachments: {},
    },
  });

  // Preencher formulário com dados existentes se for edição
  useEffect(() => {
    if (editMode && generatorData) {
      console.log('🔄 Preenchendo formulário para edição:', generatorData);
      
      form.reset({
        concessionaria: generatorData.concessionaria || '',
        owner: generatorData.owner || form.getValues('owner'),
        administrator: generatorData.administrator,
        plants: generatorData.plants || [],
        distributorLogin: generatorData.distributor_login || form.getValues('distributorLogin'),
        paymentData: generatorData.payment_data || form.getValues('paymentData'),
        attachments: generatorData.attachments || {},
      });
    }
  }, [editMode, generatorData, form]);

  const ownerType = form.watch('owner.type');

  const steps = [
    { 
      number: 1, 
      title: 'Dados Gerais', 
      description: 'Concessionária e proprietário',
      icon: '📊'
    },
    { 
      number: 2, 
      title: 'Usinas', 
      description: 'Unidades geradoras',
      icon: '⚡'
    },
    { 
      number: 3, 
      title: 'Acesso', 
      description: 'Login da distribuidora',
      icon: '🔐'
    },
    { 
      number: 4, 
      title: 'Pagamento', 
      description: 'Dados bancários',
      icon: '💳'
    },
    { 
      number: 5, 
      title: 'Documentos', 
      description: 'Anexos e contratos',
      icon: '📄'
    },
  ];

  const onSubmit = async (data: GeneratorFormData) => {
    console.log('📝 Dados do formulário:', data);
    setSaving(true);
    
    try {
      if (editMode && generatorData?.id) {
        await updateGenerator(generatorData.id, data);
        toast({
          title: "Sucesso!",
          description: "Geradora atualizada com sucesso.",
          variant: "default",
        });
      } else {
        await createGenerator(data);
        toast({
          title: "Sucesso!",
          description: "Geradora cadastrada com sucesso.",
          variant: "default",
        });
      }
      onClose();
    } catch (error) {
      console.error('❌ Erro ao salvar geradora:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${editMode ? 'atualizar' : 'salvar'} geradora. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    return true;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Redesenhado */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-700 to-emerald-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">⚡</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {editMode ? 'Editar Geradora' : 'Nova Geradora'}
                </h1>
                <p className="text-green-100 text-lg">
                  {editMode 
                    ? 'Atualize as informações da unidade geradora' 
                    : 'Cadastre uma nova unidade geradora de energia solar'
                  }
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl w-12 h-12 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Steps Redesenhado */}
      <div className="bg-white border-b border-gray-100 px-8 py-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Linha de progresso de fundo */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg
                  ${currentStep >= step.number 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-110' 
                    : currentStep === step.number - 1
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                  }
                `}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm">{step.icon}</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-sm font-semibold transition-colors ${
                    currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Step 1: Dados Gerais e Dono da Usina */}
              {currentStep === 1 && (
                <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b border-green-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">📊</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-green-800 font-bold">
                            Dados Gerais e Proprietário
                          </CardTitle>
                          <p className="text-green-600 mt-1 text-base">
                            Configure a concessionária e as informações do proprietário da geradora
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
                        {currentStep} de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-10 space-y-10">
                    <GeneratorConcessionariaForm form={form} />
                    <GeneratorOwnerTypeForm form={form} />
                    <GeneratorOwnerDataForm form={form} ownerType={ownerType} />
                    {ownerType === 'juridica' && (
                      <GeneratorAdministratorForm form={form} />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Dados das Usinas */}
              {currentStep === 2 && (
                <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-b border-blue-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">⚡</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-blue-800 font-bold">
                            Configuração das Usinas
                          </CardTitle>
                          <p className="text-blue-600 mt-1 text-base">
                            Defina as especificações técnicas das unidades geradoras
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2">
                        {currentStep} de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-10">
                    <GeneratorPlantsForm form={form} />
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Acesso */}
              {currentStep === 3 && (
                <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 border-b border-purple-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">🔐</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-purple-800 font-bold">
                            Acesso à Distribuidora
                          </CardTitle>
                          <p className="text-purple-600 mt-1 text-base">
                            Configure as credenciais de acesso ao portal da concessionária
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-sm px-4 py-2">
                        {currentStep} de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-10">
                    <GeneratorDistributorLoginForm form={form} />
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Pagamento */}
              {currentStep === 4 && (
                <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b border-green-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">💳</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-green-800 font-bold">
                            Dados para Recebimento
                          </CardTitle>
                          <p className="text-green-600 mt-1 text-base">
                            Configure as informações bancárias e chave PIX para pagamentos
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
                        {currentStep} de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-10">
                    <GeneratorPaymentForm form={form} />
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Documentos */}
              {currentStep === 5 && (
                <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">📄</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-amber-800 font-bold">
                            Documentos e Anexos
                          </CardTitle>
                          <p className="text-amber-600 mt-1 text-base">
                            Faça upload dos documentos e contratos necessários
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2">
                        {currentStep} de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-10">
                    <GeneratorAttachmentsForm form={form} />
                  </CardContent>
                </Card>
              )}

            </form>
          </Form>
        </div>
      </div>

      {/* Footer com Navegação Aprimorado */}
      <div className="bg-white border-t border-gray-200 px-8 py-6 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || saving}
              className="flex items-center gap-3 px-8 py-3 text-base font-medium border-2 hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Etapa Anterior
            </Button>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={saving}
                className="px-8 py-3 text-base font-medium border-2"
              >
                Limpar Dados
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={!canProceed() || saving}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-3 text-base font-medium flex items-center gap-3 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Salvando...' : editMode ? 'Atualizar Geradora' : 'Criar Geradora'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed() || saving}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-3 px-8 py-3 text-base font-medium shadow-lg"
                >
                  Próxima Etapa
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaGeradora;
