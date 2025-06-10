
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, ChevronLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GeneratorFormData } from '@/types/generator';
import { toast } from 'sonner';
import { Stepper } from '@/components/ui/stepper';

// Form components
import GeneratorConcessionariaForm from '@/components/forms/GeneratorConcessionariaForm';
import GeneratorOwnerTypeForm from '@/components/forms/GeneratorOwnerTypeForm';
import GeneratorOwnerDataForm from '@/components/forms/GeneratorOwnerDataForm';
import GeneratorAdministratorForm from '@/components/forms/GeneratorAdministratorForm';

// Schema de validação
const generatorSchema = z.object({
  concessionaria: z.string().min(1, 'Concessionária é obrigatória'),
  owner: z.object({
    type: z.enum(['fisica', 'juridica']),
    cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    numeroParceiroNegocio: z.string().min(1, 'Número parceiro é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('Email inválido'),
  }),
});

interface NovaGeradoraProps {
  onClose: () => void;
}

const steps = [
  { id: 'dados-gerais', title: 'Dados Gerais', description: 'Concessionária e tipo de geradora' },
  { id: 'dados-dono', title: 'Dados do Dono', description: 'Informações do proprietário da usina' },
  { id: 'usinas', title: 'Dados das Usinas', description: 'Informações das plantas de energia' },
  { id: 'login-distribuidora', title: 'Login Distribuidora', description: 'Credenciais da concessionária' },
  { id: 'pagamento', title: 'Dados Pagamento', description: 'Informações bancárias' },
  { id: 'anexos', title: 'Documentos', description: 'Upload de arquivos' },
];

const NovaGeradora = ({ onClose }: NovaGeradoraProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize form with default values
  const form = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      concessionaria: 'equatorial-goias',
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
      administrator: {
        cpf: '',
        nome: '',
        dataNascimento: '',
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

  const ownerType = form.watch('owner.type');

  const validateCurrentStep = async () => {
    const fieldsToValidate: Record<number, string[]> = {
      0: ['concessionaria', 'owner.type'],
      1: ['owner.cpfCnpj', 'owner.numeroParceiroNegocio', 'owner.name', 'owner.telefone', 'owner.email'],
      2: [], // Usinas
      3: [], // Login distribuidora
      4: [], // Pagamento
      5: [], // Anexos
    };

    const fields = fieldsToValidate[currentStep] || [];
    if (fields.length === 0) return true;

    const result = await form.trigger(fields as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de continuar');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    try {
      console.log('📝 [NOVA_GERADORA] Iniciando submissão do formulário...');
      
      const isValid = await form.trigger();
      if (!isValid) {
        console.error('❌ [NOVA_GERADORA] Formulário inválido');
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const formData = form.getValues();
      console.log('📊 [NOVA_GERADORA] Dados do formulário:', JSON.stringify(formData, null, 2));
      
      // TODO: Implementar salvamento
      toast.success('Geradora cadastrada com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('❌ [NOVA_GERADORA] Erro ao cadastrar geradora:', error);
      toast.error('Erro ao cadastrar geradora. Tente novamente.');
    }
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <GeneratorConcessionariaForm form={form} />
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <GeneratorOwnerTypeForm form={form} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
              <GeneratorOwnerDataForm form={form} ownerType={ownerType} />
            </div>

            {ownerType === 'juridica' && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
                <GeneratorAdministratorForm form={form} />
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados das Usinas</h3>
              <p className="text-gray-600">Formulário de usinas será implementado aqui</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login da Distribuidora</h3>
              <p className="text-gray-600">Formulário de login será implementado aqui</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados para Recebimento</h3>
              <p className="text-gray-600">Formulário de pagamento será implementado aqui</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Anexos</h3>
              <p className="text-gray-600">Formulário de anexos será implementado aqui</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <FormProvider {...form}>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Nova Geradora
                  </h1>
                  <p className="text-gray-600 mt-1">Cadastre uma nova unidade geradora de energia</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                  Etapa {currentStep + 1} de {steps.length}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              className="max-w-5xl mx-auto"
            />
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="min-h-[400px] mb-8">
              {renderCurrentStepContent()}
            </div>
          </div>
        </div>

        {/* Footer Navigation - Fixed */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                {!isFirstStep && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    className="flex items-center hover:bg-gray-50"
                    size="lg"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex space-x-4">
                {!isLastStep ? (
                  <Button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                    size="lg"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Cadastrar Geradora
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default NovaGeradora;
