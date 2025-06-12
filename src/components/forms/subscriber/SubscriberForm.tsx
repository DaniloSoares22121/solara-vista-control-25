
import React, { useCallback, useEffect } from 'react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import ConcessionariaSelector from './ConcessionariaSelector';
import SubscriberTypeSelector from './SubscriberTypeSelector';
import PersonalDataForm from './PersonalDataForm';
import CompanyDataForm from './CompanyDataForm';
import EnergyAccountForm from './EnergyAccountForm';
import TitleTransferForm from './TitleTransferForm';
import PlanContractForm from './PlanContractForm';
import PlanDetailsForm from './PlanDetailsForm';
import NotificationSettingsForm from './NotificationSettingsForm';
import AttachmentsForm from './AttachmentsForm';
import StepNavigationButtons from '../StepNavigationButtons';
import FormProgress from '../FormProgress';
import AutoSaveIndicator from '../AutoSaveIndicator';
import FormValidationSummary from '../FormValidationSummary';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriberFormProps {
  onSuccess?: (id?: string) => void;
  existingData?: any;
  subscriberId?: string;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({ 
  onSuccess, 
  existingData, 
  subscriberId 
}) => {
  const {
    formData,
    currentStep,
    isSubmitting,
    isEditing,
    isLoaded,
    setCurrentStep,
    updateFormData,
    handleCepLookup,
    addContact,
    removeContact,
    autoFillEnergyAccount,
    validateStep,
    submitForm,
    resetForm
  } = useSubscriberForm(existingData);

  useEffect(() => {
    console.log('📋 Estado atual do formulário:', {
      step: currentStep,
      formData,
      isEditing,
      isLoaded
    });
  }, [currentStep, formData, isEditing, isLoaded]);

  const handleCepLookupWrapper = useCallback((cep: string, addressType: 'personal' | 'company' | 'administrator' | 'energy') => {
    console.log('🔍 Fazendo lookup do CEP:', cep, 'para tipo:', addressType);
    handleCepLookup(cep, addressType);
  }, [handleCepLookup]);

  const handleSubmit = async () => {
    try {
      const result = await submitForm(subscriberId);
      if (result.success && onSuccess) {
        onSuccess(subscriberId);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar formulário:', error);
      toast.error('Erro ao salvar assinante. Tente novamente.');
    }
  };

  const handleReset = () => {
    resetForm();
    toast.success('Formulário resetado com sucesso!');
  };

  if (!isLoaded && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Carregando dados do assinante...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { 
      number: 1, 
      title: 'Concessionária', 
      component: <ConcessionariaSelector 
        value={formData.concessionaria} 
        onChange={(value) => updateFormData('concessionaria', value)} 
      /> 
    },
    { 
      number: 2, 
      title: 'Tipo de Assinante', 
      component: <SubscriberTypeSelector 
        value={formData.subscriberType} 
        onChange={(value) => updateFormData('subscriberType', value)} 
      /> 
    },
    { 
      number: 3, 
      title: formData.subscriberType === 'person' ? 'Dados Pessoais' : 'Dados da Empresa',
      component: formData.subscriberType === 'person' ? (
        <PersonalDataForm 
          data={formData.personalData} 
          onUpdate={(data) => updateFormData('personalData', data)}
          onCepLookup={(cep) => handleCepLookupWrapper(cep, 'personal')}
          onAddContact={() => addContact('personal')}
          onRemoveContact={(contactId) => removeContact('personal', contactId)}
          form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
        />
      ) : (
        <CompanyDataForm 
          data={formData.companyData} 
          onUpdate={(data) => updateFormData('companyData', data)}
          onCepLookup={(cep) => handleCepLookupWrapper(cep, 'company')}
          onAddContact={() => addContact('company')}
          onRemoveContact={(contactId) => removeContact('company', contactId)}
          form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
        />
      )
    },
    { 
      number: 4, 
      title: 'Conta de Energia', 
      component: <EnergyAccountForm 
        data={formData.energyAccount} 
        onUpdate={(data) => updateFormData('energyAccount', data)}
        onCepLookup={(cep) => handleCepLookupWrapper(cep, 'energy')}
        onAutoFill={autoFillEnergyAccount}
        form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
      /> 
    },
    { 
      number: 5, 
      title: 'Transferência de Titularidade', 
      component: <TitleTransferForm 
        data={formData.titleTransfer} 
        onUpdate={(data) => updateFormData('titleTransfer', data)}
        form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
      /> 
    },
    { 
      number: 6, 
      title: 'Contrato do Plano', 
      component: <PlanContractForm 
        data={formData.planContract} 
        onUpdate={(data) => updateFormData('planContract', data)}
        form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
      /> 
    },
    { 
      number: 7, 
      title: 'Detalhes do Plano', 
      component: <PlanDetailsForm 
        data={formData.planDetails} 
        onUpdate={(data) => updateFormData('planDetails', data)}
        form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
      /> 
    },
    { 
      number: 8, 
      title: 'Configurações de Notificação', 
      component: <NotificationSettingsForm 
        data={formData.notificationSettings} 
        onUpdate={(data) => updateFormData('notificationSettings', data)}
        form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
      /> 
    },
    { 
      number: 9, 
      title: 'Anexos', 
      component: <AttachmentsForm 
        data={formData.attachments} 
        subscriberType={formData.subscriberType}
        willTransfer={formData.titleTransfer?.willTransfer || false}
        onUpdate={(data) => updateFormData('attachments', data)}
        form={{ control: { _formValues: formData }, setValue: () => {}, watch: () => {} } as any}
      /> 
    },
  ];

  const currentStepData = steps.find(step => step.number === currentStep);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FormProgress currentStep={currentStep} stepsCount={steps.length} />
        <div className="flex items-center gap-2">
          <AutoSaveIndicator status="saved" />
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </Button>
          )}
        </div>
      </div>

      <FormValidationSummary 
        errors={[]}
        currentStep={currentStep} 
        onStepClick={setCurrentStep}
      />

      {currentStepData && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            {currentStepData.title}
          </h2>
          {currentStepData.component}
        </div>
      )}

      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={() => setCurrentStep(prev => prev - 1)}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canProceed={validateStep(currentStep)}
        isEditing={isEditing}
      />
    </div>
  );
};

export default SubscriberForm;
