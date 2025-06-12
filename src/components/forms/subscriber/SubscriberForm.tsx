
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
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

  // Sincronizar o estado do formulário com os dados
  useEffect(() => {
    console.log('Sincronizando dados do formulário:', formData);
    
    // Atualizar os valores do formulário quando formData mudar
    if (formData.concessionaria) {
      form.setValue('concessionaria', formData.concessionaria);
    }
    if (formData.subscriberType) {
      form.setValue('subscriberType', formData.subscriberType);
    }
    
    // Sincronizar dados pessoais
    if (formData.personalData) {
      const personalData = formData.personalData;
      Object.keys(personalData).forEach(key => {
        const value = personalData[key as keyof typeof personalData];
        if (value !== null && value !== undefined) {
          if (key === 'address' && typeof value === 'object') {
            Object.keys(value).forEach(addressKey => {
              const addressValue = value[addressKey as keyof typeof value];
              if (addressValue) {
                form.setValue(`personalData.address.${addressKey}` as any, addressValue);
              }
            });
          } else {
            form.setValue(`personalData.${key}` as any, value);
          }
        }
      });
    }
    
    // Sincronizar dados da conta de energia
    if (formData.energyAccount) {
      const energyAccount = formData.energyAccount;
      Object.keys(energyAccount).forEach(key => {
        const value = energyAccount[key as keyof typeof energyAccount];
        if (value !== null && value !== undefined) {
          if (key === 'address' && typeof value === 'object') {
            Object.keys(value).forEach(addressKey => {
              const addressValue = value[addressKey as keyof typeof value];
              if (addressValue) {
                form.setValue(`energyAccount.address.${addressKey}` as any, addressValue);
              }
            });
          } else {
            form.setValue(`energyAccount.${key}` as any, value);
          }
        }
      });
    }
  }, [formData, form]);

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">
            Cadastro de Assinante
          </CardTitle>
          <div className="flex justify-between items-center mt-4 text-sm text-blue-700">
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
                      ? 'bg-blue-500 text-white'
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
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Finalizar Cadastro</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
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
