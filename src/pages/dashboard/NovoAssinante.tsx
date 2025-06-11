import React, { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ConcessionariaForm from '@/components/forms/ConcessionariaForm';
import SubscriberForm from '@/components/forms/SubscriberForm';
import AdministratorForm from '@/components/forms/AdministratorForm';
import EnergyAccountForm from '@/components/forms/EnergyAccountForm';
import PlanContractForm from '@/components/forms/PlanContractForm';
import PlanDetailsForm from '@/components/forms/PlanDetailsForm';
import NotificationSettingsForm from '@/components/forms/NotificationSettingsForm';
import AttachmentsForm from '@/components/forms/AttachmentsForm';
import { Step, Steps } from '@/components/ui/steps';
import { SubscriberFormData, Address, PersonData, AdministratorData, OriginalEnergyAccount, NewTitularity, EnergyAccount, PlanContract, PlanDetails, NotificationSettings } from '@/types/subscriber';
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
};

const NovoAssinante = ({ onClose, initialData, onSubmit, isEditing = false }: NovoAssinanteProps) => {
  const { createSubscriber, loading } = useSubscribers();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = [
    'Concessionária',
    'Assinante',
    'Administrador',
    'Conta de Energia',
    'Plano Contratado',
    'Detalhes do Plano',
    'Notificações',
    'Anexos',
  ];

  const concessionariaFormRef = useRef<HTMLFormElement>(null);
  const subscriberFormRef = useRef<HTMLFormElement>(null);
  const administratorFormRef = useRef<HTMLFormElement>(null);
  const energyAccountFormRef = useRef<HTMLFormElement>(null);
  const planContractFormRef = useRef<HTMLFormElement>(null);
  const planDetailsFormRef = useRef<HTMLFormElement>(null);
  const notificationSettingsFormRef = useRef<HTMLFormElement>(null);
  const attachmentsFormRef = useRef<HTMLFormElement>(null);

  // Inicializar com dados existentes se estiver editando
  const [formData, setFormData] = useState<SubscriberFormData>(() => {
    if (initialData) {
      return {
        concessionaria: initialData.concessionaria,
        subscriber: initialData.subscriber,
        administrator: initialData.administrator,
        energyAccount: initialData.energyAccount,
        planContract: initialData.planContract,
        planDetails: initialData.planDetails,
        notifications: initialData.notifications,
        attachments: initialData.attachments || {}
      };
    }
    
    return defaultFormData;
  });

  const validateForm = (step: number): boolean => {
    switch (step) {
      case 0:
        return concessionariaFormRef.current?.checkValidity() || false;
      case 1:
        return subscriberFormRef.current?.checkValidity() || false;
      case 2:
        return administratorFormRef.current?.checkValidity() || true; // Opcional
      case 3:
        return energyAccountFormRef.current?.checkValidity() || false;
      case 4:
        return planContractFormRef.current?.checkValidity() || false;
      case 5:
        return planDetailsFormRef.current?.checkValidity() || false;
      case 6:
        return notificationSettingsFormRef.current?.checkValidity() || false;
      case 7:
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

  const handleConcessionariaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, concessionaria: value }));
  };

  const handleSubscriberChange = (value: PersonData) => {
    setFormData((prev) => ({ ...prev, subscriber: value }));
  };

  const handleAdministratorChange = (value: AdministratorData | undefined) => {
    setFormData((prev) => ({ ...prev, administrator: value }));
  };

  const handleEnergyAccountChange = (value: EnergyAccount) => {
    setFormData((prev) => ({ ...prev, energyAccount: value }));
  };

  const handlePlanContractChange = (value: PlanContract) => {
    setFormData((prev) => ({ ...prev, planContract: value }));
  };

  const handlePlanDetailsChange = (value: PlanDetails) => {
    setFormData((prev) => ({ ...prev, planDetails: value }));
  };

  const handleNotificationSettingsChange = (value: NotificationSettings) => {
    setFormData((prev) => ({ ...prev, notifications: value }));
  };

  const handleAttachmentsChange = (value: SubscriberFormData['attachments']) => {
    setFormData((prev) => ({ ...prev, attachments: value }));
  };

  const handleSubmit = async () => {
    if (!validateAllForms()) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('🚀 Dados do formulário antes de enviar:', JSON.stringify(formData, null, 2));
      
      if (isEditing && onSubmit) {
        await onSubmit(formData);
      } else {
        const id = await createSubscriber(formData);
        console.log('✅ Assinante cadastrado com sucesso! ID:', id);
        toast.success('Assinante cadastrado com sucesso!');
      }
      
      onClose();
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
    <div className="min-h-screen bg-gray-50">
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
                {isEditing ? 'Editar Assinante' : 'Novo Assinante'}
              </h1>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Atualize os dados do assinante' : 'Cadastre um novo assinante de energia solar'}
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
                  {isEditing ? 'Atualizando...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Atualizar Assinante' : 'Cadastrar Assinante'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <Steps current={currentStep}>
          {steps.map((step, index) => (
            <Step key={index} title={step} />
          ))}
        </Steps>

        <div className="mt-6">
          {currentStep === 0 && (
            <ConcessionariaForm
              ref={concessionariaFormRef}
              value={formData.concessionaria}
              onChange={handleConcessionariaChange}
              isEditing={isEditing}
            />
          )}

          {currentStep === 1 && (
            <SubscriberForm
              ref={subscriberFormRef}
              initialValues={formData.subscriber}
              onChange={handleSubscriberChange}
              isEditing={isEditing}
            />
          )}

          {currentStep === 2 && (
            <AdministratorForm
              ref={administratorFormRef}
              initialValues={formData.administrator}
              onChange={(value) => handleAdministratorChange(value)}
              isEditing={isEditing}
            />
          )}

          {currentStep === 3 && (
            <EnergyAccountForm
              ref={energyAccountFormRef}
              initialValues={formData.energyAccount}
              onChange={handleEnergyAccountChange}
              isEditing={isEditing}
            />
          )}

          {currentStep === 4 && (
            <PlanContractForm
              ref={planContractFormRef}
              initialValues={formData.planContract}
              onChange={handlePlanContractChange}
              isEditing={isEditing}
            />
          )}

          {currentStep === 5 && (
            <PlanDetailsForm
              ref={planDetailsFormRef}
              initialValues={formData.planDetails}
              onChange={handlePlanDetailsChange}
              isEditing={isEditing}
            />
          )}

          {currentStep === 6 && (
            <NotificationSettingsForm
              ref={notificationSettingsFormRef}
              initialValues={formData.notifications}
              onChange={handleNotificationSettingsChange}
              isEditing={isEditing}
            />
          )}

          {currentStep === 7 && (
            <AttachmentsForm
              ref={attachmentsFormRef}
              initialValues={formData.attachments}
              onChange={handleAttachmentsChange}
              isEditing={isEditing}
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
          >
            Anterior
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1 || isSubmitting}
          >
            Próximo
          </Button>
          {currentStep === steps.length - 1 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
  );
};

export default NovoAssinante;
