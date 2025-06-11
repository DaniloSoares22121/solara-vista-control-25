
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Circle } from 'lucide-react';
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

interface SubscriberFormProps {
  onSuccess?: () => void;
}

const SubscriberForm = ({ onSuccess }: SubscriberFormProps) => {
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
    'Concessionária',
    'Tipo de Assinante',
    'Dados do Assinante',
    'Conta de Energia',
    'Troca de Titularidade',
    'Contratação do Plano',
    'Detalhes do Plano',
    'Notificações',
    'Anexos',
  ];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        autoFillEnergyAccount();
      }
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep) && currentStep === totalSteps) {
      const result = await submitForm();
      if (result.success && onSuccess) {
        onSuccess();
      }
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header com design melhorado */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Cadastro de Assinante
          </CardTitle>
          
          {/* Progress Section */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center text-sm">
              <Badge variant="outline" className="px-3 py-1">
                Etapa {currentStep} de {totalSteps}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                {Math.round(progress)}% concluído
              </Badge>
            </div>
            
            <Progress 
              value={progress} 
              className="w-full h-3 bg-gray-200"
            />
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {stepTitles[currentStep - 1]}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Preencha as informações solicitadas para continuar
              </p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {stepTitles.map((title, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                
                return (
                  <div key={stepNumber} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold
                        ${isCompleted ? 'bg-green-500 text-white' : 
                          isCurrent ? 'bg-primary text-white' : 
                          'bg-gray-200 text-gray-600'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <span className={`
                        text-xs mt-1 text-center max-w-16 leading-tight
                        ${isCurrent ? 'text-primary font-medium' : 'text-gray-500'}
                      `}>
                        {title.split(' ')[0]}
                      </span>
                    </div>
                    {stepNumber < totalSteps && (
                      <div className={`
                        w-8 h-0.5 mx-1 
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Content com melhor design */}
      <Form {...form}>
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8">
            <div className="min-h-[500px]">
              {renderStepContent()}
            </div>
          </CardContent>
        </Card>
      </Form>

      {/* Navigation com design melhorado */}
      <Card className="border-0 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Rascunho</span>
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finalizar Cadastro</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 px-6"
                >
                  <span>Próximo</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriberForm;
