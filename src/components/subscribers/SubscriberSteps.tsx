
import React from 'react';
import { SubscriberFormData } from '@/types/subscriber';
import { UseFormReturn, FormProvider } from 'react-hook-form';
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

// Mock form object que implementa corretamente UseFormReturn
const createMockForm = (formData: SubscriberFormData): UseFormReturn<any> => ({
  control: { 
    _formValues: formData,
    _getWatch: () => formData,
    _subjects: {
      values: { next: () => {}, subscribe: () => ({ unsubscribe: () => {} }) },
      array: { next: () => {}, subscribe: () => ({ unsubscribe: () => {} }) },
      state: { next: () => {}, subscribe: () => ({ unsubscribe: () => {} }) }
    },
    _names: { mount: new Set(), unMount: new Set(), array: new Set(), focus: '', watch: new Set() },
    _state: {
      mount: false,
      action: false,
      watch: false,
      isValid: false,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
      touchedFields: {},
      dirtyFields: {},
      validatingFields: {},
      errors: {}
    },
    _formState: {
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      isLoading: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      isValidating: false,
      submitCount: 0,
      touchedFields: {},
      dirtyFields: {},
      validatingFields: {},
      errors: {},
      defaultValues: formData
    },
    _fields: {},
    _defaultValues: formData,
    _options: { mode: 'onChange' as const, reValidateMode: 'onChange' as const, resolver: undefined },
    _stateFlags: { mount: false, action: false, watch: false, isValid: false },
    _getDirty: () => ({}),
    _getFieldArray: () => ({ _f: { name: '', keyName: '' } }),
    _updateValid: () => {},
    _removeUnmounted: () => {},
    _updateFieldArray: () => {},
    _reset: () => {},
    _resetDefaultValues: () => {},
    _updateFormState: () => {},
    _disableForm: () => {},
    _executeSchema: () => Promise.resolve({ errors: {}, values: {} }),
    _getFormState: () => ({ isValid: true, isDirty: false, isSubmitting: false, isLoading: false, isSubmitted: false, isSubmitSuccessful: false, isValidating: false, submitCount: 0, touchedFields: {}, dirtyFields: {}, validatingFields: {}, errors: {}, defaultValues: formData, disabled: false }),
    _updateDisabledField: () => {},
    register: () => ({ name: '', onChange: () => Promise.resolve(), onBlur: () => Promise.resolve(), ref: () => {} }),
    unregister: () => {},
    getFieldState: () => ({ invalid: false, isTouched: false, isDirty: false, isValidating: false, error: undefined }),
    handleSubmit: () => () => Promise.resolve(),
    reset: () => {},
    setError: () => {},
    clearErrors: () => {},
    setValue: () => {},
    setFocus: () => {},
    watch: () => formData,
    trigger: () => Promise.resolve(true),
    formState: { isValid: true, isDirty: false, isSubmitting: false, isLoading: false, isSubmitted: false, isSubmitSuccessful: false, isValidating: false, submitCount: 0, touchedFields: {}, dirtyFields: {}, validatingFields: {}, errors: {}, defaultValues: formData, disabled: false },
    resetField: () => {},
    getValues: () => formData
  } as any,
  setValue: () => {},
  watch: (...args: any[]) => {
    if (args.length === 0) return formData;
    if (typeof args[0] === 'string') {
      const path = args[0];
      return path.split('.').reduce((obj, key) => obj?.[key], formData);
    }
    if (Array.isArray(args[0])) {
      return args[0].map((path: string) => 
        path.split('.').reduce((obj, key) => obj?.[key], formData)
      );
    }
    return undefined;
  },
  getValues: (names?: any) => {
    if (!names) return formData;
    if (typeof names === 'string') {
      return names.split('.').reduce((obj: any, key: string) => obj?.[key], formData);
    }
    if (Array.isArray(names)) {
      return names.reduce((result: any, name: string) => {
        result[name] = name.split('.').reduce((obj: any, key: string) => obj?.[key], formData);
        return result;
      }, {} as any);
    }
    return formData;
  },
  getFieldState: () => ({ 
    invalid: false, 
    isTouched: false, 
    isDirty: false, 
    isValidating: false,
    error: undefined 
  }),
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
    validatingFields: {},
    defaultValues: formData,
    disabled: false
  },
  reset: () => {},
  handleSubmit: () => () => Promise.resolve(),
  unregister: () => {},
  register: (name: any) => ({ 
    name, 
    onChange: () => Promise.resolve(), 
    onBlur: () => Promise.resolve(), 
    ref: () => {} 
  }),
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
      component: (
        <FormProvider {...mockForm}>
          <ConcessionariaSelector 
            value={formData.concessionaria} 
            onChange={(value) => updateFormData('concessionaria', value)} 
          />
        </FormProvider>
      )
    },
    { 
      number: 2, 
      title: 'Tipo de Assinante', 
      component: (
        <FormProvider {...mockForm}>
          <SubscriberTypeSelector 
            value={formData.subscriberType} 
            onChange={(value) => updateFormData('subscriberType', value)} 
          />
        </FormProvider>
      )
    },
    { 
      number: 3, 
      title: formData.subscriberType === 'person' ? 'Dados Pessoais' : 'Dados da Empresa',
      component: (
        <FormProvider {...mockForm}>
          {formData.subscriberType === 'person' ? (
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
          )}
        </FormProvider>
      )
    },
    { 
      number: 4, 
      title: 'Conta de Energia', 
      component: (
        <FormProvider {...mockForm}>
          <EnergyAccountForm 
            data={formData.energyAccount} 
            onUpdate={(data) => updateFormData('energyAccount', data)}
            onCepLookup={(cep) => handleCepLookup(cep, 'energy')}
            onAutoFill={autoFillEnergyAccount}
            form={mockForm}
          />
        </FormProvider>
      )
    },
    { 
      number: 5, 
      title: 'Transferência de Titularidade', 
      component: (
        <FormProvider {...mockForm}>
          <TitleTransferForm 
            data={formData.titleTransfer} 
            onUpdate={(data) => updateFormData('titleTransfer', data)}
            form={mockForm}
          />
        </FormProvider>
      )
    },
    { 
      number: 6, 
      title: 'Contrato do Plano', 
      component: (
        <FormProvider {...mockForm}>
          <PlanContractForm 
            data={formData.planContract} 
            onUpdate={(data) => updateFormData('planContract', data)}
            form={mockForm}
          />
        </FormProvider>
      )
    },
    { 
      number: 7, 
      title: 'Detalhes do Plano', 
      component: (
        <FormProvider {...mockForm}>
          <PlanDetailsForm 
            data={formData.planDetails} 
            onUpdate={(data) => updateFormData('planDetails', data)}
            form={mockForm}
          />
        </FormProvider>
      )
    },
    { 
      number: 8, 
      title: 'Configurações de Notificação', 
      component: (
        <FormProvider {...mockForm}>
          <NotificationSettingsForm 
            data={formData.notificationSettings} 
            onUpdate={(data) => updateFormData('notificationSettings', data)}
            form={mockForm}
          />
        </FormProvider>
      )
    },
    { 
      number: 9, 
      title: 'Anexos', 
      component: (
        <FormProvider {...mockForm}>
          <AttachmentsForm 
            data={formData.attachments} 
            subscriberType={formData.subscriberType}
            willTransfer={formData.titleTransfer?.willTransfer || false}
            onUpdate={(data) => updateFormData('attachments', data)}
            form={mockForm}
          />
        </FormProvider>
      )
    },
  ];

  return { steps };
};
