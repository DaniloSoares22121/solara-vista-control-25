
import React from 'react';
import { SubscriberFormData } from '@/types/subscriber';
import ConcessionariaSelector from '../forms/subscriber/ConcessionariaSelector';
import SubscriberTypeSelector from '../forms/subscriber/SubscriberTypeSelector';
import PersonalDataForm from '../forms/subscriber/PersonalDataForm';
import CompanyDataForm from '../forms/subscriber/CompanyDataForm';
import EnergyAccountForm from '../forms/subscriber/EnergyAccountForm';
import TitleTransferForm from '../forms/subscriber/TitleTransferForm';
import PlanContractForm from '../forms/subscriber/PlanContractForm';
import PlanDetailsForm from '../forms/subscriber/PlanDetailsForm';
import NotificationSettingsForm from '../forms/subscriber/NotificationSettingsForm';
import AttachmentsForm from '../forms/subscriber/AttachmentsForm';

interface SubscriberStepsProps {
  formData: SubscriberFormData;
  updateFormData: (section: keyof SubscriberFormData, data: unknown) => void;
  handleCepLookup: (cep: string, addressType: 'personal' | 'company' | 'administrator' | 'energy') => void;
  addContact: (type: 'personal' | 'company') => void;
  removeContact: (type: 'personal' | 'company', contactId: string) => void;
  autoFillEnergyAccount: () => void;
}

// Mock form object que implementa todas as propriedades necessárias do UseFormReturn
const createMockForm = (formData: SubscriberFormData) => ({
  control: { _formValues: formData },
  setValue: () => {},
  watch: () => {},
  getValues: () => formData,
  getFieldState: () => ({ invalid: false, isTouched: false, isDirty: false, error: undefined }),
  setError: () => {},
  clearErrors: () => {},
  trigger: () => Promise.resolve(true),
  formState: {
    errors: {},
    isValid: true,
    isSubmitting: false,
    isLoading: false,
    isDirty: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    isValidating: false,
    submitCount: 0,
    touchedFields: {},
    dirtyFields: {},
    defaultValues: formData
  },
  reset: () => {},
  handleSubmit: () => () => {},
  unregister: () => {},
  register: () => ({ name: '', onChange: () => {}, onBlur: () => {}, ref: () => {} }),
  setFocus: () => {},
  resetField: () => {}
});

export const useSubscriberSteps = ({
  formData,
  updateFormData,
  handleCepLookup,
  addContact,
  removeContact,
  autoFillEnergyAccount
}: SubscriberStepsProps) => {
  
  const mockForm = createMockForm(formData);

  const steps = [
    { 
      number: 1, 
      title: 'Concessionária', 
      component: <ConcessionariaSelector 
        value={formData.concessionaria} 
        onChange={(value) => updateFormData('concessionaria', value)} 
      /> 
    },
    { 
      number: 2, 
      title: 'Tipo de Assinante', 
      component: <SubscriberTypeSelector 
        value={formData.subscriberType} 
        onChange={(value) => updateFormData('subscriberType', value)} 
      /> 
    },
    { 
      number: 3, 
      title: formData.subscriberType === 'person' ? 'Dados Pessoais' : 'Dados da Empresa',
      component: formData.subscriberType === 'person' ? (
        <PersonalDataForm 
          data={formData.personalData} 
          onUpdate={(data) => updateFormData('personalData', data)}
          onCepLookup={(cep) => handleCepLookup(cep, 'personal')}
          onAddContact={() => addContact('personal')}
          onRemoveContact={(contactId) => removeContact('personal', contactId)}
          form={mockForm}
        />
      ) : (
        <CompanyDataForm 
          companyData={formData.companyData} 
          administratorData={formData.administratorData}
          onUpdateCompany={(data) => updateFormData('companyData', data)}
          onUpdateAdministrator={(data) => updateFormData('administratorData', data)}
          onCepLookup={(cep, type) => handleCepLookup(cep, type)}
          onAddContact={() => addContact('company')}
          onRemoveContact={(contactId) => removeContact('company', contactId)}
          form={mockForm}
        />
      )
    },
    { 
      number: 4, 
      title: 'Conta de Energia', 
      component: <EnergyAccountForm 
        data={formData.energyAccount} 
        onUpdate={(data) => updateFormData('energyAccount', data)}
        onCepLookup={(cep) => handleCepLookup(cep, 'energy')}
        onAutoFill={autoFillEnergyAccount}
        form={mockForm}
      /> 
    },
    { 
      number: 5, 
      title: 'Transferência de Titularidade', 
      component: <TitleTransferForm 
        data={formData.titleTransfer} 
        onUpdate={(data) => updateFormData('titleTransfer', data)}
        form={mockForm}
      /> 
    },
    { 
      number: 6, 
      title: 'Contrato do Plano', 
      component: <PlanContractForm 
        data={formData.planContract} 
        onUpdate={(data) => updateFormData('planContract', data)}
        form={mockForm}
      /> 
    },
    { 
      number: 7, 
      title: 'Detalhes do Plano', 
      component: <PlanDetailsForm 
        data={formData.planDetails} 
        onUpdate={(data) => updateFormData('planDetails', data)}
        form={mockForm}
      /> 
    },
    { 
      number: 8, 
      title: 'Configurações de Notificação', 
      component: <NotificationSettingsForm 
        data={formData.notificationSettings} 
        onUpdate={(data) => updateFormData('notificationSettings', data)}
        form={mockForm}
      /> 
    },
    { 
      number: 9, 
      title: 'Anexos', 
      component: <AttachmentsForm 
        data={formData.attachments} 
        subscriberType={formData.subscriberType}
        willTransfer={formData.titleTransfer?.willTransfer || false}
        onUpdate={(data) => updateFormData('attachments', data)}
        form={mockForm}
      /> 
    },
  ];

  return { steps };
};
