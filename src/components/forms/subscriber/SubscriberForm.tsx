
import React, { useCallback, useEffect } from 'react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { useSubscriberSteps } from '@/components/subscribers/SubscriberSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, CheckCircle, ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { SubscriberDataFromDB } from '@/types/subscriber';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
        
        // Se não está editando (é um novo cadastro), recarregar a página após um breve delay
        if (!subscriberId) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Verde Fixo */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            {/* Título e Botão de Fechar */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-bold">
                {isEditing ? 'Editar Assinante' : 'Novo Assinante'}
              </h1>
              {onClose && (
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "icon"}
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                  {isMobile && <span className="ml-2">Fechar</span>}
                </Button>
              )}
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 mb-4">
              <div 
                className="bg-white h-2 sm:h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            
            {/* Informações da Etapa */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-3">
                {currentStepData?.icon && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <currentStepData.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="text-white/80 text-xs sm:text-sm">
                    Etapa {currentStep} de {totalSteps}
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-white">
                    {currentStepData?.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 h-full">
          <div className="h-full overflow-y-auto">
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {currentStepData?.component}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer com Navegação */}
      <div className="bg-white border-t shadow-lg flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Botão Anterior */}
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto flex items-center gap-2 order-2 sm:order-1"
                size={isMobile ? "lg" : "default"}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              {/* Indicadores de Etapa */}
              <div className="flex items-center gap-2 order-1 sm:order-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      step.number === currentStep
                        ? 'bg-green-600 scale-125'
                        : step.number < currentStep
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Botão Próximo/Finalizar */}
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 order-3"
                  size={isMobile ? "lg" : "default"}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finalizar Cadastro
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 order-3"
                  size={isMobile ? "lg" : "default"}
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

export default SubscriberForm;
