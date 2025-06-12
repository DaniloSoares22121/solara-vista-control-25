
import React, { useCallback, useEffect } from 'react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { useSubscriberSteps } from '@/components/subscribers/SubscriberSteps';
import StepNavigationButtons from '../StepNavigationButtons';
import FormProgress from '../FormProgress';
import AutoSaveIndicator from '../AutoSaveIndicator';
import FormValidationSummary from '../FormValidationSummary';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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

  const { steps } = useSubscriberSteps({
    formData,
    updateFormData,
    handleCepLookup,
    addContact,
    removeContact,
    autoFillEnergyAccount
  });

  useEffect(() => {
    console.log('📋 Estado atual do formulário:', {
      step: currentStep,
      formData,
      isEditing,
      isLoaded
    });
  }, [currentStep, formData, isEditing, isLoaded]);

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
        <LoadingSpinner 
          size="lg" 
          text="Carregando dados do assinante..."
        />
      </div>
    );
  }

  const stepTitles = steps.map(step => step.title);
  const completedSteps = steps.map((_, index) => index < currentStep);
  const hasErrors = steps.map(() => false);
  const currentStepData = steps.find(step => step.number === currentStep);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FormProgress 
          steps={stepTitles}
          currentStep={currentStep} 
          completedSteps={completedSteps}
          hasErrors={hasErrors}
        />
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
        onGoToStep={setCurrentStep}
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
        isNextDisabled={!validateStep(currentStep)}
        isEditing={isEditing}
      />
    </div>
  );
};

export default SubscriberForm;
