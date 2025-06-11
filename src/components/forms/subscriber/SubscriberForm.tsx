
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, CheckCircle, Clock, Users, FileText, Zap, Settings, Bell, Paperclip } from 'lucide-react';
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

const schema = z.object({
  concessionaria: z.string().min(1, 'Concessionária é obrigatória'),
  subscriberType: z.enum(['person', 'company'], {
    required_error: 'Tipo de assinante é obrigatório',
  }),
});

const SubscriberForm = () => {
  const {
    formData,
    currentStep,
    isSubmitting,
    setCurrentStep,
    updateFormData,
    handleCepLookup,
    addContact,
    removeContact,
    autoFillEnergyAccount,
    validateStep,
    submitForm,
  } = useSubscriberForm();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
    mode: 'onChange',
  });

  const totalSteps = 9;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    { title: 'Concessionária', icon: Zap, color: 'from-emerald-500 to-teal-500' },
    { title: 'Tipo de Assinante', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Dados do Assinante', icon: Users, color: 'from-purple-500 to-pink-500' },
    { title: 'Conta de Energia', icon: Zap, color: 'from-amber-500 to-orange-500' },
    { title: 'Troca de Titularidade', icon: FileText, color: 'from-rose-500 to-pink-500' },
    { title: 'Contratação do Plano', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { title: 'Detalhes do Plano', icon: Settings, color: 'from-indigo-500 to-purple-500' },
    { title: 'Notificações', icon: Bell, color: 'from-yellow-500 to-amber-500' },
    { title: 'Anexos', icon: Paperclip, color: 'from-teal-500 to-cyan-500' },
  ];

  const currentStepInfo = stepTitles[currentStep - 1];
  const IconComponent = currentStepInfo.icon;

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep) && currentStep === totalSteps) {
      await submitForm();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ConcessionariaSelector
            value={formData.concessionaria}
            onChange={(value) => updateFormData('concessionaria', value)}
          />
        );
      case 2:
        return (
          <SubscriberTypeSelector
            value={formData.subscriberType}
            onChange={(value) => updateFormData('subscriberType', value)}
          />
        );
      case 3:
        return formData.subscriberType === 'person' ? (
          <PersonalDataForm
            data={formData.personalData}
            onUpdate={(data) => updateFormData('personalData', data)}
            onCepLookup={(cep) => handleCepLookup(cep, 'personal')}
            onAddContact={() => addContact('personal')}
            onRemoveContact={(id) => removeContact('personal', id)}
            form={form}
          />
        ) : (
          <CompanyDataForm
            companyData={formData.companyData}
            administratorData={formData.administratorData}
            onUpdateCompany={(data) => updateFormData('companyData', data)}
            onUpdateAdministrator={(data) => updateFormData('administratorData', data)}
            onCepLookup={handleCepLookup}
            onAddContact={() => addContact('company')}
            onRemoveContact={(id) => removeContact('company', id)}
            form={form}
          />
        );
      case 4:
        return (
          <EnergyAccountForm
            data={formData.energyAccount}
            onUpdate={(data) => updateFormData('energyAccount', data)}
            onCepLookup={(cep) => handleCepLookup(cep, 'energy')}
            onAutoFill={autoFillEnergyAccount}
            form={form}
          />
        );
      case 5:
        return (
          <TitleTransferForm
            data={formData.titleTransfer}
            onUpdate={(data) => updateFormData('titleTransfer', data)}
            form={form}
          />
        );
      case 6:
        return (
          <PlanContractForm
            data={formData.planContract}
            onUpdate={(data) => updateFormData('planContract', data)}
            form={form}
          />
        );
      case 7:
        return (
          <PlanDetailsForm
            data={formData.planDetails}
            onUpdate={(data) => updateFormData('planDetails', data)}
            form={form}
          />
        );
      case 8:
        return (
          <NotificationSettingsForm
            data={formData.notificationSettings}
            onUpdate={(data) => updateFormData('notificationSettings', data)}
            form={form}
          />
        );
      case 9:
        return (
          <AttachmentsForm
            data={formData.attachments}
            subscriberType={formData.subscriberType}
            willTransfer={formData.titleTransfer.willTransfer}
            onUpdate={(data) => updateFormData('attachments', data)}
            form={form}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Enhanced Header with Solar Theme */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="solar-gradient p-8 text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 floating-animation">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Cadastro de Assinante</h1>
              <p className="text-white/90 text-lg">Energia solar para um futuro sustentável</p>
            </div>
            
            {/* Enhanced Progress Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Etapa {currentStep} de {totalSteps}</span>
                <span className="font-medium">{Math.round(progress)}% concluído</span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-3 bg-white/20 [&>div]:bg-white [&>div]:shadow-lg"
                />
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full">
                  {stepTitles.map((_, index) => (
                    <div
                      key={index}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                        index + 1 <= currentStep 
                          ? 'bg-white shadow-lg scale-110' 
                          : 'bg-white/30'
                      }`}
                      style={{ left: `${(index / (totalSteps - 1)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${currentStepInfo.color} text-white font-semibold text-lg shadow-lg`}>
                  <IconComponent className="w-5 h-5 mr-2" />
                  {currentStepInfo.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Step Navigation */}
      <div className="grid grid-cols-9 gap-2 mb-8">
        {stepTitles.map((step, index) => {
          const StepIcon = step.icon;
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isAccessible = stepNumber <= currentStep;
          
          return (
            <button
              key={stepNumber}
              onClick={() => isAccessible && setCurrentStep(stepNumber)}
              disabled={!isAccessible}
              className={`relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isActive 
                  ? `bg-gradient-to-br ${step.color} text-white shadow-xl scale-105` 
                  : isCompleted
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : isAccessible
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <StepIcon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium text-center leading-tight">
                  {step.title}
                </span>
              </div>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Enhanced Form Content */}
      <Form {...form}>
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${currentStepInfo.color}`}></div>
          <CardContent className="p-8 bg-gradient-to-br from-white to-gray-50/50">
            <div className="animate-fade-in">
              {renderStepContent()}
            </div>
          </CardContent>
        </Card>
      </Form>

      {/* Enhanced Navigation */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Anterior</span>
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  <Save className="w-5 h-5" />
                  <span className="font-medium">Salvar Rascunho</span>
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !validateStep(currentStep)}
                    className="flex items-center space-x-3 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Finalizando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Finalizar Cadastro</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className={`flex items-center space-x-3 px-8 py-3 rounded-xl bg-gradient-to-r ${currentStepInfo.color} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100`}
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default SubscriberForm;
