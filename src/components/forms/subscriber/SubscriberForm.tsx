
import React, { useCallback, useEffect } from 'react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { useSubscriberSteps } from '@/components/subscribers/SubscriberSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, CheckCircle, ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { SubscriberDataFromDB } from '@/types/subscriber';

interface SubscriberFormProps {
  onSuccess?: (id?: string) => void;
  existingData?: SubscriberDataFromDB;
  subscriberId?: string;
  onClose?: () => void;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({ 
  onSuccess, 
  existingData, 
  subscriberId,
  onClose 
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

  const handleSubmit = async () => {
    try {
      const result = await submitForm(subscriberId);
      if (result.success && onSuccess) {
        onSuccess(subscriberId);
      }
    } catch (error) {
      toast.error('Erro ao salvar assinante. Tente novamente.');
    }
  };

  const handleReset = () => {
    resetForm();
    toast.success('Formulário resetado com sucesso!');
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
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

  const currentStepData = steps.find(step => step.number === currentStep);
  const totalSteps = steps.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Verde Fixo */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {isEditing ? 'Editar Assinante' : 'Novo Assinante'}
            </h1>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white/80 text-sm">Etapa {currentStep} de {totalSteps}</p>
                <p className="text-xl font-semibold text-white">{currentStepData?.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto p-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {currentStepData?.component}
          </CardContent>
        </Card>
      </div>

      {/* Footer com Navegação */}
      <div className="bg-white border-t p-6 mt-auto">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step.number === currentStep
                    ? 'bg-green-600'
                    : step.number < currentStep
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Finalizar Cadastro'}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriberForm;
