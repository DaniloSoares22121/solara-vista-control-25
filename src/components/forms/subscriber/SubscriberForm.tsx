
import React, { useCallback, useEffect } from 'react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { useSubscriberSteps } from '@/components/subscribers/SubscriberSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, CheckCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
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

  const stepDescriptions = [
    'Selecione a concessionária',
    'Escolha o tipo de assinante', 
    'Informações do titular',
    'Dados da conta de energia',
    'Transferência de titularidade',
    'Configuração do plano',
    'Detalhes do contrato',
    'Configurações de notificação',
    'Anexos obrigatórios'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-green-50/20 to-emerald-100/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Progress Section */}
        <div className="mb-6 lg:mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white/90 to-white/95 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-4 lg:p-6">
              <div className="relative">
                {/* Progress background line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between items-center overflow-x-auto pb-2">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex flex-col items-center min-w-0 flex-shrink-0">
                      <div className={`
                        w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold transition-all duration-300 shadow-md
                        ${currentStep >= step.number 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white scale-110' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                        }
                      `}>
                        {currentStep > step.number ? (
                          <CheckCircle className="w-3 h-3 lg:w-5 lg:h-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      
                      <div className="mt-2 text-center max-w-20 lg:max-w-24">
                        <p className={`text-xs lg:text-sm font-medium transition-colors truncate ${
                          currentStep >= step.number ? 'text-emerald-700' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 hidden lg:block">
                          {stepDescriptions[index]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Content */}
        {currentStepData && (
          <div className="mb-6 lg:mb-8">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-white/90 to-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 border-b border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {currentStep}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg lg:text-xl text-emerald-800">
                      {currentStepData.title}
                    </CardTitle>
                    <p className="text-emerald-600/80 text-sm lg:text-base mt-1">
                      {stepDescriptions[currentStep - 1]}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs lg:text-sm px-3 py-1">
                    {currentStep} de {totalSteps}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 lg:p-6 xl:p-8">
                {currentStepData.component}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Footer */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-white/90 to-white/95 backdrop-blur-sm sticky bottom-0 lg:static z-10">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <div className="flex items-center gap-2 lg:gap-4">
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="hidden lg:flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar
                  </Button>
                )}
                
                {currentStep === totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!validateStep(currentStep) || isSubmitting}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 lg:px-8 py-2 lg:py-3 font-medium flex items-center gap-2 shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Assinante'}
                    </span>
                    <span className="sm:hidden">
                      {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep) || isSubmitting}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white flex items-center gap-2 px-4 lg:px-8 py-2 lg:py-3 font-medium shadow-lg transition-all duration-200"
                  >
                    <span className="hidden sm:inline">Próximo</span>
                    <span className="sm:hidden">Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriberForm;
