
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { 
  Building, 
  User, 
  Zap, 
  FileText, 
  CreditCard, 
  Settings, 
  Bell, 
  Paperclip,
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Import step components
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

const steps = [
  { id: 1, title: 'Concessionária', icon: Building },
  { id: 2, title: 'Tipo', icon: User },
  { id: 3, title: 'Dados', icon: FileText },
  { id: 4, title: 'Conta', icon: Zap },
  { id: 5, title: 'Titularidade', icon: CreditCard },
  { id: 6, title: 'Plano', icon: Settings },
  { id: 7, title: 'Detalhes', icon: Settings },
  { id: 8, title: 'Notificações', icon: Bell },
  { id: 9, title: 'Anexos', icon: Paperclip },
];

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

  const progress = ((currentStep) / steps.length) * 100;
  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (canProceed && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const result = await submitForm();
    if (result.success) {
      // Redirecionar ou mostrar sucesso
    }
  };

  const renderCurrentStep = () => {
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
            onCepChange={(cep) => handleCepLookup(cep, 'personal')}
            onAddContact={() => addContact('personal')}
            onRemoveContact={(id) => removeContact('personal', id)}
          />
        ) : (
          <CompanyDataForm
            companyData={formData.companyData}
            administratorData={formData.administratorData}
            onUpdateCompany={(data) => updateFormData('companyData', data)}
            onUpdateAdministrator={(data) => updateFormData('administratorData', data)}
            onCepChange={(cep, type) => handleCepLookup(cep, type)}
            onAddContact={() => addContact('company')}
            onRemoveContact={(id) => removeContact('company', id)}
          />
        );
      case 4:
        return (
          <EnergyAccountForm
            data={formData.energyAccount}
            onUpdate={(data) => updateFormData('energyAccount', data)}
            onCepChange={(cep) => handleCepLookup(cep, 'energy')}
            onAutoFill={autoFillEnergyAccount}
            subscriberType={formData.subscriberType}
          />
        );
      case 5:
        return (
          <TitleTransferForm
            data={formData.titleTransfer}
            onUpdate={(data) => updateFormData('titleTransfer', data)}
          />
        );
      case 6:
        return (
          <PlanContractForm
            data={formData.planContract}
            onUpdate={(data) => updateFormData('planContract', data)}
          />
        );
      case 7:
        return (
          <PlanDetailsForm
            data={formData.planDetails}
            onUpdate={(data) => updateFormData('planDetails', data)}
          />
        );
      case 8:
        return (
          <NotificationSettingsForm
            data={formData.notificationSettings}
            onUpdate={(data) => updateFormData('notificationSettings', data)}
          />
        );
      case 9:
        return (
          <AttachmentsForm
            data={formData.attachments}
            onUpdate={(data) => updateFormData('attachments', data)}
            subscriberType={formData.subscriberType}
            willTransferTitle={formData.titleTransfer.willTransfer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Assinante</h1>
              <p className="text-gray-600">Etapa {currentStep} de {steps.length}</p>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              {Math.round(progress)}% Concluído
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2 bg-gray-200">
            <div 
              className="h-full bg-green-600 transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </Progress>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isValid = validateStep(step.id);

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${isActive 
                          ? 'border-green-600 bg-green-50' 
                          : isCompleted 
                            ? 'border-green-600 bg-green-600' 
                            : 'border-gray-300 bg-white'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <StepIcon 
                          className={`w-5 h-5 ${
                            isActive ? 'text-green-600' : 'text-gray-400'
                          }`} 
                        />
                      )}
                    </div>
                    <span 
                      className={`
                        text-xs mt-2 text-center w-16 truncate
                        ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}
                      `}
                      title={step.title}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`
                        w-12 h-px mx-4 transition-colors duration-200
                        ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                      `} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-sm border-0">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "w-5 h-5 text-white"
                })}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-gray-600 text-sm font-normal">
                  Preencha as informações desta etapa
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Button>

          <div className="flex items-center space-x-4">
            {!canProceed && (
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Preencha os campos obrigatórios</span>
              </div>
            )}

            {currentStep === steps.length ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Finalizar Cadastro</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberForm;
