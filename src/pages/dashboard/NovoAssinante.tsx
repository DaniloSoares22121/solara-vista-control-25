
import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
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
import FormProgress from '@/components/forms/FormProgress';
import FormValidationSummary from '@/components/forms/FormValidationSummary';
import AutoSaveIndicator from '@/components/forms/AutoSaveIndicator';
import StepNavigationButtons from '@/components/forms/StepNavigationButtons';
import { SubscriberFormData } from '@/types/subscriber';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useAutoSave } from '@/hooks/useAutoSave';

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
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);
  
  const steps = [
    'Dados do Assinante',
    'Conta de Energia',
    'Plano e Notificações',
    'Anexos',
  ];

  const form = useForm<SubscriberFormData>({
    defaultValues: initialData || defaultFormData,
    mode: 'onChange'
  });

  const subscriberFormRef = useRef<HTMLFormElement>(null);
  const energyAccountFormRef = useRef<HTMLFormElement>(null);
  const planContractFormRef = useRef<HTMLFormElement>(null);
  const attachmentsFormRef = useRef<HTMLFormElement>(null);

  const currentSubscriberData = form.watch('subscriber');

  // Auto-save functionality
  const autoSaveData = useCallback(async (data: SubscriberFormData) => {
    const key = `novo-assinante-draft-${isEditing ? initialData?.id : 'new'}`;
    localStorage.setItem(key, JSON.stringify(data));
  }, [isEditing, initialData?.id]);

  const { status: autoSaveStatus, lastSaved } = useAutoSave({
    data: form.watch(),
    onSave: autoSaveData,
    enabled: true
  });

  // Load draft on mount
  React.useEffect(() => {
    if (!initialData) {
      const key = `novo-assinante-draft-new`;
      const draft = localStorage.getItem(key);
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          form.reset(draftData);
          toast.info('Rascunho carregado automaticamente');
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [form, initialData]);

  const validateForm = (step: number): boolean => {
    const formData = form.getValues();
    console.log('Validando step:', step, 'com dados:', formData);

    switch (step) {
      case 0:
        // Validação Step 1 - Dados do Assinante
        if (!formData.concessionaria) {
          toast.error('Selecione uma concessionária');
          return false;
        }
        if (!formData.subscriber?.type) {
          toast.error('Selecione o tipo de pessoa');
          return false;
        }
        if (!formData.subscriber?.cpfCnpj) {
          toast.error('Preencha o CPF/CNPJ');
          return false;
        }
        if (formData.subscriber.type === 'fisica' && !formData.subscriber?.name) {
          toast.error('Preencha o nome');
          return false;
        }
        if (formData.subscriber.type === 'juridica' && !formData.subscriber?.razaoSocial) {
          toast.error('Preencha a razão social');
          return false;
        }
        break;
        
      case 1:
        // Step 2 - Conta de Energia (Validação simplificada - não obrigatória)
        console.log('Step 2 validado - campos opcionais');
        break;
        
      case 2:
        // Validação Step 3 - Plano e Notificações
        if (!formData.planContract?.dataAdesao) {
          toast.error('Preencha a data de adesão');
          return false;
        }
        if (!formData.planContract?.modalidadeCompensacao) {
          toast.error('Selecione a modalidade de compensação');
          return false;
        }
        if (!formData.planContract?.fidelidade) {
          toast.error('Selecione o tipo de fidelidade');
          return false;
        }
        if (formData.planContract.fidelidade === 'com' && !formData.planContract?.anosFidelidade) {
          toast.error('Selecione os anos de fidelidade');
          return false;
        }
        break;
        
      case 3:
        // Anexos são opcionais
        break;
    }

    // Marcar step como concluído
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[step] = true;
    setCompletedSteps(newCompletedSteps);
    
    console.log('Step', step, 'validado com sucesso');
    return true;
  };

  const validateAllForms = (): boolean => {
    console.log('Validando todos os formulários...');
    let allValid = true;

    for (let i = 0; i < steps.length - 1; i++) { // Skip last step (attachments)
      if (!validateForm(i)) {
        allValid = false;
        // Se um step falhar, ir para ele
        setCurrentStep(i);
        break;
      }
    }

    return allValid;
  };

  const nextStep = () => {
    console.log('Tentando avançar do step:', currentStep);
    if (validateForm(currentStep)) {
      console.log('Validação passou, avançando para próximo step');
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      console.log('Validação falhou, não pode avançar');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    if (!validateAllForms()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = form.getValues();
      
      if (isEditing && onSubmit) {
        await onSubmit(formData);
      } else {
        const id = await createSubscriber(formData);
        
        // Clear draft after successful creation
        const key = `novo-assinante-draft-new`;
        localStorage.removeItem(key);
        
        toast.success('Assinante cadastrado com sucesso!');
        onClose();
      }
    } catch (error: any) {
      console.error('Erro ao processar assinante:', error);
      
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

  const isNextDisabled = false;

  return (
    <div className={isEditing ? "" : "min-h-screen bg-gray-50"}>
      {!isEditing && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
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

            <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
          </div>
        </div>
      )}

      <FormProgress 
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        hasErrors={[false, false, false, false]}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
        <div className="mb-6">
          <FormValidationSummary 
            errors={[]}
            onGoToStep={goToStep}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Form {...form}>
            {currentStep === 0 && (
              <SubscriberForm
                ref={subscriberFormRef}
                initialValues={form.watch('subscriber')}
                initialAdministrator={form.watch('administrator')}
                onChange={(subscriberData, concessionaria, administrator) => {
                  console.log('SubscriberForm onChange:', { subscriberData, concessionaria, administrator });
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
                  console.log('EnergyAccountForm onChange:', energyAccount);
                  form.setValue('energyAccount', energyAccount);
                }}
                isEditing={isEditing}
              />
            )}

            {currentStep === 2 && (
              <div className="p-6 space-y-6">
                <PlanContractForm
                  ref={planContractFormRef}
                  initialValues={form.watch('planContract')}
                  onChange={(planContract) => {
                    console.log('PlanContractForm onChange:', planContract);
                    form.setValue('planContract', planContract);
                  }}
                  isEditing={isEditing}
                />
                
                <PlanDetailsForm
                  initialValues={form.watch('planDetails')}
                  onChange={(planDetails) => {
                    console.log('PlanDetailsForm onChange:', planDetails);
                    form.setValue('planDetails', planDetails);
                  }}
                  isEditing={isEditing}
                />
                
                <NotificationSettingsForm
                  initialValues={form.watch('notifications')}
                  onChange={(notifications) => {
                    console.log('NotificationSettingsForm onChange:', notifications);
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
      </div>

      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isNextDisabled={isNextDisabled}
        isEditing={isEditing}
      />
    </div>
  );
};

export default NovoAssinante;
