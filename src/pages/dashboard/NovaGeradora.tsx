
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Save } from 'lucide-react';
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
      title: 'Dados Gerais e Dono da Usina', 
      description: 'Concessionária e informações do proprietário' 
    },
    { 
      number: 2, 
      title: 'Dados das Usinas', 
      description: 'Informações das unidades geradoras' 
    },
    { 
      number: 3, 
      title: 'Login da Distribuidora', 
      description: 'Credenciais de acesso à distribuidora' 
    },
    { 
      number: 4, 
      title: 'Dados para Recebimento', 
      description: 'Informações bancárias e PIX' 
    },
    { 
      number: 5, 
      title: 'Anexos', 
      description: 'Documentos e contratos' 
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Aprimorado */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {editMode ? 'Editar Geradora' : 'Nova Geradora'}
            </h1>
            <p className="text-green-100 mt-1">
              {editMode ? 'Atualize as informações da geradora' : 'Cadastre uma nova unidade geradora de energia'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Progress Steps Aprimorado */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${currentStep >= step.number 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium transition-colors ${
                      currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-6 rounded transition-colors
                    ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Step 1: Dados Gerais e Dono da Usina */}
              {currentStep === 1 && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-green-800">
                          Dados Gerais e Dono da Usina
                        </CardTitle>
                        <p className="text-green-600 mt-1">
                          Informações da concessionária e proprietário da geradora
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Passo 1 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-8">
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
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-blue-800">
                          Dados das Usinas
                        </CardTitle>
                        <p className="text-blue-600 mt-1">
                          Informações técnicas das unidades geradoras
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Passo 2 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <GeneratorPlantsForm form={form} />
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-purple-800">
                          Login da Distribuidora
                        </CardTitle>
                        <p className="text-purple-600 mt-1">
                          Credenciais de acesso à distribuidora
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Passo 3 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <GeneratorDistributorLoginForm form={form} />
                  </CardContent>
                </Card>
              )}

              {currentStep === 4 && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-green-800">
                          Dados para Recebimento
                        </CardTitle>
                        <p className="text-green-600 mt-1">
                          Informações bancárias e chave PIX
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Passo 4 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <GeneratorPaymentForm form={form} />
                  </CardContent>
                </Card>
              )}

              {currentStep === 5 && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-amber-800">
                          Anexos
                        </CardTitle>
                        <p className="text-amber-600 mt-1">
                          Documentos e contratos necessários
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Passo 5 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <GeneratorAttachmentsForm form={form} />
                  </CardContent>
                </Card>
              )}

            </form>
          </Form>
        </div>
      </div>

      {/* Footer com Navegação Aprimorado */}
      <div className="bg-white border-t border-gray-200 px-6 py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || saving}
              className="flex items-center gap-2 px-6 py-3"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={saving}
                className="px-6 py-3"
              >
                Limpar
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={!canProceed() || saving}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : editMode ? 'Atualizar Geradora' : 'Salvar Geradora'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed() || saving}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2 px-6 py-3"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
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
