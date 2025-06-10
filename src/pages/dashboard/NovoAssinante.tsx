
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, ChevronLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';
import { Stepper } from '@/components/ui/stepper';

// Form components
import ConcessionariaForm from '@/components/forms/ConcessionariaForm';
import TipoAssinanteForm from '@/components/forms/TipoAssinanteForm';
import DadosPessoaFisicaForm from '@/components/forms/DadosPessoaFisicaForm';
import DadosPessoaJuridicaForm from '@/components/forms/DadosPessoaJuridicaForm';
import ContaEnergiaForm from '@/components/forms/ContaEnergiaForm';
import PlanoContratadoForm from '@/components/forms/PlanoContratadoForm';
import DetalhesPlanoForm from '@/components/forms/DetalhesPlanoForm';
import NotificacoesForm from '@/components/forms/NotificacoesForm';
import AnexosForm from '@/components/forms/AnexosForm';

// Schema de validação
const subscriberSchema = z.object({
  concessionaria: z.string().min(1, 'Concessionária é obrigatória'),
  subscriber: z.object({
    type: z.enum(['fisica', 'juridica']),
    cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    numeroParceiroNegocio: z.string().min(1, 'Número parceiro é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('Email inválido'),
  }),
  energyAccount: z.object({
    originalAccount: z.object({
      type: z.enum(['fisica', 'juridica']),
      cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
      name: z.string().min(1, 'Nome é obrigatório'),
      uc: z.string().min(1, 'UC é obrigatória'),
      numeroParceiroUC: z.string().min(1, 'Número parceiro UC é obrigatório'),
    }),
  }),
  planContract: z.object({
    modalidadeCompensacao: z.enum(['autoconsumo', 'geracaoCompartilhada']),
    dataAdesao: z.string().min(1, 'Data de adesão é obrigatória'),
    kwhVendedor: z.number().min(1, 'kWh vendedor é obrigatório'),
    kwhContratado: z.number().min(1, 'kWh contratado é obrigatório'),
    faixaConsumo: z.enum(['400-599', '600-1099', '1100-3099', '3100-7000', '7000+']),
    fidelidade: z.enum(['sem', 'com']),
  }),
});

interface NovoAssinanteProps {
  onClose: () => void;
}

const steps = [
  { id: 'assinante', title: 'Dados Gerais', description: 'Concessionária e dados do assinante' },
  { id: 'conta', title: 'Conta de Energia', description: 'Informações da unidade consumidora' },
  { id: 'plano', title: 'Plano Contratado', description: 'Modalidade e contratação' },
  { id: 'detalhes', title: 'Detalhes do Plano', description: 'Configurações específicas' },
  { id: 'notificacoes', title: 'Notificações', description: 'WhatsApp e e-mail' },
  { id: 'anexos', title: 'Documentos', description: 'Upload de arquivos' },
];

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { createSubscriber, loading } = useSubscribers();

  // Initialize form with default values
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      concessionaria: 'equatorial-goias',
      subscriber: {
        type: 'fisica',
        name: '',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        email: '',
        telefone: '',
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
          dataNascimento: '',
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
        newTitularity: {
          type: 'fisica',
          cpfCnpj: '',
          name: '',
          dataNascimento: '',
          uc: '',
          numeroParceiroUC: '',
          trocaConcluida: false,
          dataTroca: '',
          protocoloAnexo: undefined,
        },
      },
      planContract: {
        modalidadeCompensacao: 'autoconsumo',
        dataAdesao: '',
        kwhVendedor: 0,
        kwhContratado: 0,
        faixaConsumo: '400-599',
        fidelidade: 'sem',
        anosFidelidade: undefined,
        desconto: 0,
      },
      planDetails: {
        clientePagaPisCofins: true,
        clientePagaFioB: false,
        adicionarValorDistribuidora: false,
        assinanteIsento: false,
      },
      notifications: {
        whatsappFaturas: true,
        whatsappPagamento: false,
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
      attachments: {},
    },
  });

  const tipoAssinante = form.watch('subscriber.type');
  const contacts = form.watch('subscriber.contacts') || [];

  const handleContactsChange = (newContacts: any[]) => {
    form.setValue('subscriber.contacts', newContacts);
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate: Record<number, string[]> = {
      0: ['concessionaria', 'subscriber.type', 'subscriber.cpfCnpj', 'subscriber.numeroParceiroNegocio', 'subscriber.name', 'subscriber.telefone', 'subscriber.email'],
      1: ['energyAccount.originalAccount.type', 'energyAccount.originalAccount.cpfCnpj', 'energyAccount.originalAccount.name', 'energyAccount.originalAccount.uc', 'energyAccount.originalAccount.numeroParceiroUC'],
      2: ['planContract.modalidadeCompensacao', 'planContract.dataAdesao', 'planContract.kwhVendedor', 'planContract.kwhContratado', 'planContract.faixaConsumo', 'planContract.fidelidade'],
      3: [], // Detalhes do plano - sem validação obrigatória
      4: [], // Notificações - sem validação obrigatória
      5: [], // Anexos - sem validação obrigatória
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
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Sync UC for new titularity
      const formData = form.getValues();
      if (formData.energyAccount.realizarTrocaTitularidade && formData.energyAccount.newTitularity) {
        formData.energyAccount.newTitularity.uc = formData.energyAccount.originalAccount.uc;
        form.setValue('energyAccount.newTitularity.uc', formData.energyAccount.originalAccount.uc);
      }

      console.log('📝 [FORM] Dados do formulário:', JSON.stringify(formData, null, 2));
      
      await createSubscriber(formData);
      
      toast.success('Assinante cadastrado com sucesso!');
      onClose();
    } catch (error) {
      console.error('❌ [FORM] Erro ao cadastrar assinante:', error);
      toast.error('Erro ao cadastrar assinante. Tente novamente.');
    }
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <ConcessionariaForm form={form} />
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <TipoAssinanteForm form={form} />
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
              {tipoAssinante === 'fisica' ? (
                <DadosPessoaFisicaForm 
                  form={form} 
                  contacts={contacts}
                  onContactsChange={handleContactsChange}
                />
              ) : (
                <DadosPessoaJuridicaForm 
                  form={form} 
                  contacts={contacts}
                  onContactsChange={handleContactsChange}
                />
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <ContaEnergiaForm form={form} />
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <PlanoContratadoForm form={form} />
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <DetalhesPlanoForm form={form} />
          </div>
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <NotificacoesForm form={form} />
          </div>
        );
      case 5:
        return (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
            <AnexosForm form={form} />
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
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Novo Assinante
                  </h1>
                  <p className="text-gray-600 mt-1">Cadastre um novo cliente de energia por UC</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
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
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                    size="lg"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
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
      </div>
    </FormProvider>
  );
};

export default NovoAssinante;
