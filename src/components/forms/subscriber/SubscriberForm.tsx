
import React, { useCallback, useEffect } from 'react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { useSubscriberSteps } from '@/components/subscribers/SubscriberSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Users, CheckCircle, ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { SubscriberDataFromDB } from '@/types/subscriber';
import DashboardLayout from '@/components/DashboardLayout';

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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner 
            size="lg" 
            text="Carregando dados do assinante..."
          />
        </div>
      </DashboardLayout>
    );
  }

  const currentStepData = steps.find(step => step.number === currentStep);
  const totalSteps = steps.length;

  // Define step descriptions for the UI
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
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-green-100/50 p-responsive">
        <div className="container mx-auto space-y-6 lg:space-y-8">
          
          {/* Header Section */}
          <div className="solar-card-gradient rounded-xl border border-green-100 p-6 lg:p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="p-2 lg:p-3 solar-gradient rounded-xl lg:rounded-2xl shadow-lg">
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold solar-text-gradient">
                      {isEditing ? 'Editar Assinante' : 'Novo Assinante'}
                    </h1>
                    <p className="text-muted-foreground text-sm lg:text-base xl:text-lg">
                      {isEditing 
                        ? 'Atualize as informações do assinante' 
                        : 'Cadastre um novo assinante no sistema'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex items-center space-x-2 border-green-200 text-primary hover:bg-green-50 shadow-md touch-manipulation min-h-touch"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar para Lista</span>
                  <span className="sm:hidden">Voltar</span>
                </Button>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <Card className="border-green-100 shadow-xl solar-card-gradient overflow-hidden">
            <CardContent className="p-4 lg:p-6 xl:p-8">
              <div className="flex items-center justify-between relative overflow-x-auto mobile-scroll">
                {/* Progress line background */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-green-100 rounded-full z-0">
                  <div 
                    className="h-full solar-gradient rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between w-full min-w-max lg:min-w-0 relative z-10 gap-2 lg:gap-4">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex flex-col items-center">
                      <div className={`
                        w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs lg:text-lg font-bold transition-all duration-300 shadow-lg
                        ${currentStep >= step.number 
                          ? 'solar-gradient text-white scale-110' 
                          : currentStep === step.number - 1
                          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                          : 'bg-white text-gray-400 border-2 border-green-200'
                        }
                      `}>
                        {currentStep > step.number ? (
                          <CheckCircle className="w-3 h-3 lg:w-6 lg:h-6" />
                        ) : (
                          <span className="text-xs lg:text-sm">{step.number}</span>
                        )}
                      </div>
                      <div className="mt-2 lg:mt-3 text-center max-w-16 lg:max-w-32">
                        <p className={`text-xs lg:text-sm font-semibold transition-colors truncate ${
                          currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 hidden lg:block">
                          {stepDescriptions[index] || 'Configuração'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Content */}
          {currentStepData && (
            <Card className="border-green-100 shadow-2xl solar-card-gradient">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 solar-gradient rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-lg lg:text-xl">{currentStep}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg lg:text-xl xl:text-2xl text-primary font-bold">
                        {currentStepData.title}
                      </CardTitle>
                      <p className="text-primary/70 mt-1 text-sm lg:text-base">
                        {stepDescriptions[currentStep - 1] || 'Configure as informações necessárias'}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-primary border-green-200 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2 self-start lg:self-auto">
                    {currentStep} de {totalSteps}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 lg:p-6 xl:p-8 lg:p-10">
                {currentStepData.component}
              </CardContent>
            </Card>
          )}

          {/* Navigation Footer */}
          <Card className="border-green-100 shadow-xl solar-card-gradient overflow-hidden sticky bottom-0 lg:static z-10">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-base font-medium border-2 hover:bg-green-50 touch-manipulation min-h-touch"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">Etapa Anterior</span>
                  <span className="sm:hidden">Anterior</span>
                </Button>

                <div className="flex items-center gap-2 lg:gap-4">
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="hidden lg:flex items-center gap-2 px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-base font-medium border-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Limpar Dados
                    </Button>
                  )}
                  
                  {currentStep === totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!validateStep(currentStep) || isSubmitting}
                      className="solar-gradient hover:opacity-90 text-white px-4 lg:px-10 py-2 lg:py-3 text-sm lg:text-base font-medium flex items-center gap-2 lg:gap-3 shadow-lg touch-manipulation min-h-touch"
                    >
                      <Save className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="hidden sm:inline">
                        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Assinante' : 'Criar Assinante'}
                      </span>
                      <span className="sm:hidden">
                        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep) || isSubmitting}
                      className="solar-gradient hover:opacity-90 text-white flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-base font-medium shadow-lg touch-manipulation min-h-touch"
                    >
                      <span className="hidden sm:inline">Próxima Etapa</span>
                      <span className="sm:hidden">Próximo</span>
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriberForm;
