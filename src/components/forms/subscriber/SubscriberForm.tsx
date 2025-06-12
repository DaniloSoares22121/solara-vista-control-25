
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

  // Define step colors and icons based on step number
  const getStepColor = (stepNumber: number) => {
    const colors = [
      { from: 'from-green-50', to: 'to-emerald-50', border: 'border-green-100/50', text: 'text-green-800', desc: 'text-green-600', bg: 'from-green-500', bgTo: 'to-emerald-500' },
      { from: 'from-blue-50', to: 'to-cyan-50', border: 'border-blue-100/50', text: 'text-blue-800', desc: 'text-blue-600', bg: 'from-blue-500', bgTo: 'to-cyan-500' },
      { from: 'from-purple-50', to: 'to-violet-50', border: 'border-purple-100/50', text: 'text-purple-800', desc: 'text-purple-600', bg: 'from-purple-500', bgTo: 'to-violet-500' },
      { from: 'from-orange-50', to: 'to-amber-50', border: 'border-orange-100/50', text: 'text-orange-800', desc: 'text-orange-600', bg: 'from-orange-500', bgTo: 'to-amber-500' },
      { from: 'from-rose-50', to: 'to-pink-50', border: 'border-rose-100/50', text: 'text-rose-800', desc: 'text-rose-600', bg: 'from-rose-500', bgTo: 'to-pink-500' },
      { from: 'from-teal-50', to: 'to-cyan-50', border: 'border-teal-100/50', text: 'text-teal-800', desc: 'text-teal-600', bg: 'from-teal-500', bgTo: 'to-cyan-500' }
    ];
    return colors[(stepNumber - 1) % colors.length];
  };

  const stepIcons = ['👤', '⚡', '📋', '💰', '📄', '🔔'];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50">
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {isEditing ? 'Editar Assinante' : 'Novo Assinante'}
                  </h1>
                  <p className="text-gray-600 text-lg">
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
                className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para Lista</span>
              </Button>
            )}
          </div>

          {/* Progress Steps */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between relative">
                {/* Linha de progresso de fundo */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
                
                {steps.map((step, index) => (
                  <div key={step.number} className="flex flex-col items-center relative z-10">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg
                      ${currentStep >= step.number 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-110' 
                        : currentStep === step.number - 1
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                      }
                    `}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-sm">{stepIcons[index] || '📋'}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-semibold transition-colors ${
                        currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{step.description || 'Configuração'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Content */}
          {currentStepData && (
            <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
              <CardHeader className={`bg-gradient-to-r ${getStepColor(currentStep).from} via-${getStepColor(currentStep).from} ${getStepColor(currentStep).to} border-b ${getStepColor(currentStep).border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getStepColor(currentStep).bg} ${getStepColor(currentStep).bgTo} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-xl">{stepIcons[currentStep - 1] || '📋'}</span>
                    </div>
                    <div>
                      <CardTitle className={`text-2xl ${getStepColor(currentStep).text} font-bold`}>
                        {currentStepData.title}
                      </CardTitle>
                      <p className={`${getStepColor(currentStep).desc} mt-1 text-base`}>
                        {currentStepData.description || 'Configure as informações necessárias'}
                      </p>
                    </div>
                  </div>
                  <Badge className={`bg-${getStepColor(currentStep).text.split('-')[1]}-100 text-${getStepColor(currentStep).text.split('-')[1]}-800 border-${getStepColor(currentStep).text.split('-')[1]}-200 text-sm px-4 py-2`}>
                    {currentStep} de {totalSteps}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-10">
                {currentStepData.component}
              </CardContent>
            </Card>
          )}

          {/* Navigation Footer */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex items-center gap-3 px-8 py-3 text-base font-medium border-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Etapa Anterior
                </Button>

                <div className="flex items-center gap-4">
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="px-8 py-3 text-base font-medium border-2 flex items-center gap-2"
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
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-3 text-base font-medium flex items-center gap-3 shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                      {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Assinante' : 'Criar Assinante'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep) || isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-3 px-8 py-3 text-base font-medium shadow-lg"
                    >
                      Próxima Etapa
                      <ChevronRight className="w-5 h-5" />
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
