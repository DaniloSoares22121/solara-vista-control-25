import React, { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import SubscriberForm from '@/components/forms/SubscriberForm';
import EnergyAccountForm from '@/components/forms/EnergyAccountForm';
import PlanContractForm from '@/components/forms/PlanContractForm';
import PlanDetailsForm from '@/components/forms/PlanDetailsForm';
import NotificationSettingsForm from '@/components/forms/NotificationSettingsForm';
import AttachmentsForm from '@/components/forms/AttachmentsForm';
import { Step, Steps } from '@/components/ui/steps';
import { SubscriberFormData } from '@/types/subscriber';
import { useSubscribers } from '@/hooks/useSubscribers';

interface NovoAssinanteProps {
  onClose: () => void;
  initialData?: SubscriberFormData & { id: string };
  onSubmit?: (data: SubscriberFormData) => Promise<void>;
  isEditing?: boolean;
}

const defaultFormData: SubscriberFormData = {
  concessionaria: '',
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
    },
  },
  planContract: {
    modalidadeCompensacao: 'autoconsumo',
    dataAdesao: '',
    kwhVendedor: 0,
    kwhContratado: 0,
    faixaConsumo: '400-599',
    fidelidade: 'sem',
    anosFidelidade: '1',
    desconto: 13,
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
};

const NovoAssinante = ({ onClose, initialData, onSubmit, isEditing = false }: NovoAssinanteProps) => {
  const { createSubscriber, loading } = useSubscribers();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 4 etapas - removendo a etapa separada do administrador
  const steps = [
    'Dados do Assinante',
    'Conta de Energia',
    'Plano e Notificações',
    'Anexos',
  ];

  // Formulário unificado para todos os dados
  const form = useForm<SubscriberFormData>({
    defaultValues: initialData || defaultFormData,
    mode: 'onChange'
  });

  const subscriberFormRef = useRef<HTMLFormElement>(null);
  const energyAccountFormRef = useRef<HTMLFormElement>(null);
  const planContractFormRef = useRef<HTMLFormElement>(null);
  const attachmentsFormRef = useRef<HTMLFormElement>(null);

  // Watch subscriber data to pass to energy account form
  const currentSubscriberData = form.watch('subscriber');
  console.log('NovoAssinante - currentSubscriberData:', currentSubscriberData);

  const validateForm = (step: number): boolean => {
    switch (step) {
      case 0:
        return subscriberFormRef.current?.checkValidity() || false;
      case 1:
        return energyAccountFormRef.current?.checkValidity() || false;
      case 2:
        return planContractFormRef.current?.checkValidity() || false;
      case 3:
        return attachmentsFormRef.current?.checkValidity() || true; // Opcional
      default:
        return false;
    }
  };

  const validateAllForms = (): boolean => {
    for (let i = 0; i < steps.length; i++) {
      if (!validateForm(i)) {
        setCurrentStep(i);
        toast.error(`Preencha os campos obrigatórios da etapa ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error('Preencha todos os campos obrigatórios!');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateAllForms()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = form.getValues();
      console.log('🚀 Dados do formulário antes de enviar:', JSON.stringify(formData, null, 2));
      
      if (isEditing && onSubmit) {
        await onSubmit(formData);
      } else {
        const id = await createSubscriber(formData);
        console.log('✅ Assinante cadastrado com sucesso! ID:', id);
        toast.success('Assinante cadastrado com sucesso!');
        onClose();
      }
    } catch (error: any) {
      console.error('❌ Erro ao processar assinante:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(`${isEditing ? 'Erro ao atualizar' : 'Erro ao cadastrar'} assinante: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isEditing ? "" : "min-h-screen bg-gray-50"}>
      {/* Header - só renderiza se não estiver editando */}
      {!isEditing && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Novo Assinante
                </h1>
                <p className="text-sm text-gray-600">
                  Cadastre um novo assinante de energia solar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="hidden sm:flex"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Cadastrar Assinante
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">
        <Steps current={currentStep}>
          {steps.map((step, index) => (
            <Step key={index} title={step} />
          ))}
        </Steps>

        <div className="mt-6">
          <Form {...form}>
            {currentStep === 0 && (
              <SubscriberForm
                ref={subscriberFormRef}
                initialValues={form.watch('subscriber')}
                initialAdministrator={form.watch('administrator')}
                onChange={(subscriberData, concessionaria, administrator) => {
                  form.setValue('subscriber', subscriberData);
                  form.setValue('concessionaria', concessionaria);
                  if (administrator) {
                    form.setValue('administrator', administrator);
                  }
                }}
                concessionaria={form.watch('concessionaria')}
                isEditing={isEditing}
              />
            )}

            {currentStep === 1 && (
              <EnergyAccountForm
                ref={energyAccountFormRef}
                initialValues={form.watch('energyAccount')}
                subscriberData={currentSubscriberData}
                onChange={(energyAccount) => {
                  form.setValue('energyAccount', energyAccount);
                }}
                isEditing={isEditing}
              />
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <PlanContractForm
                  ref={planContractFormRef}
                  initialValues={form.watch('planContract')}
                  onChange={(planContract) => {
                    form.setValue('planContract', planContract);
                  }}
                  isEditing={isEditing}
                />
                
                <PlanDetailsForm
                  initialValues={form.watch('planDetails')}
                  onChange={(planDetails) => {
                    form.setValue('planDetails', planDetails);
                  }}
                  isEditing={isEditing}
                />
                
                <NotificationSettingsForm
                  initialValues={form.watch('notifications')}
                  onChange={(notifications) => {
                    form.setValue('notifications', notifications);
                  }}
                  isEditing={isEditing}
                />
              </div>
            )}

            {currentStep === 3 && (
              <AttachmentsForm
                ref={attachmentsFormRef}
                initialValues={form.watch('attachments')}
                onChange={(attachments) => {
                  form.setValue('attachments', attachments);
                }}
                isEditing={isEditing}
              />
            )}
          </Form>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
          >
            Anterior
          </Button>
          <div className="flex gap-2">
            {/* Só mostra o botão Próximo se não for a última etapa */}
            {currentStep !== steps.length - 1 && (
              <Button
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Próximo
              </Button>
            )}
            {/* Só mostra o botão de finalizar na última etapa */}
            {currentStep === steps.length - 1 && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? 'Atualizando...' : 'Cadastrando...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Atualizar Assinante' : 'Cadastrar Assinante'}
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
