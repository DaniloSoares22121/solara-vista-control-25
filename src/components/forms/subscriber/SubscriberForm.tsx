import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useSubscriberForm } from '@/hooks/useSubscriberForm';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
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
  existingData?: SubscriberRecord | null;
  onSuccess?: () => void;
}

const SubscriberForm = ({ existingData, onSuccess }: SubscriberFormProps) => {
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
  } = useSubscriberForm(existingData);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      concessionaria: '',
      subscriberType: 'person' as const,
    },
    mode: 'onChange',
  });

  // Sincronizar formulário react-hook-form com formData carregado
  useEffect(() => {
    if (isLoaded) {
      console.log('🔄 Sincronizando formulário com dados carregados:', formData);
      form.setValue('concessionaria', formData.concessionaria);
      form.setValue('subscriberType', formData.subscriberType);
      
      // Reset validation errors when data is loaded
      form.clearErrors();
      
      console.log('✅ Formulário sincronizado');
    }
  }, [formData.concessionaria, formData.subscriberType, form, isLoaded]);

  const totalSteps = 9;

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
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    } else {
      console.log('❌ Validação falhou para o passo:', currentStep);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep) && currentStep === totalSteps) {
      const result = await submitForm(existingData?.id);
      if (result.success && onSuccess) {
        onSuccess();
      }
    }
  };

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-green-200 rounded-full mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 text-xl font-semibold">Carregando dados...</p>
                  <p className="text-gray-500">Aguarde enquanto preparamos o formulário</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            onCepLookup={(cep, type) => handleCepLookup(cep, type)}
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-900">
            {isEditing ? 'Editar Assinante' : 'Cadastro de Assinante'}
          </CardTitle>
          <div className="flex justify-between items-center mt-4 text-sm text-green-700">
            <span>Etapa {currentStep} de {totalSteps}</span>
            <span className="font-medium">{stepTitles[currentStep - 1]}</span>
          </div>
          {/* Progress Steps */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    index + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : index + 1 === currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Form {...form}>
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </Form>

      {/* Navigation */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-700"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Rascunho</span>
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isEditing ? 'Atualizando...' : 'Enviando...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEditing ? 'Atualizar Cadastro' : 'Finalizar Cadastro'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
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
