
import React from 'react';
import { SubscriberFormData } from '@/types/subscriber';
import { FormProvider } from 'react-hook-form';
import { useFormProvider } from '@/hooks/useFormProvider';
import { Zap, User, UserCheck, Home, ArrowRightLeft, FileText, Settings, Bell, Paperclip } from 'lucide-react';
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

export const useSubscriberSteps = ({
  formData,
  updateFormData,
  handleCepLookup,
  addContact,
  removeContact,
  autoFillEnergyAccount
}: SubscriberStepsProps) => {
  
  const form = useFormProvider(formData);

  const steps = [
    { 
      number: 1, 
      title: 'Concessionária',
      icon: Zap,
      component: (
        <FormProvider {...form}>
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
      icon: User,
      component: (
        <FormProvider {...form}>
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
      icon: formData.subscriberType === 'person' ? User : UserCheck,
      component: (
        <FormProvider {...form}>
          {formData.subscriberType === 'person' ? (
            <PersonalDataForm 
              data={formData.personalData} 
              onUpdate={(data) => updateFormData('personalData', data)}
              onCepLookup={(cep) => handleCepLookup(cep, 'personal')}
              onAddContact={() => addContact('personal')}
              onRemoveContact={(contactId) => removeContact('personal', contactId)}
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
              onRemoveContact={(contactId) => removeContact('company', contactId)}
              form={form}
            />
          )}
        </FormProvider>
      )
    },
    { 
      number: 4, 
      title: 'Conta de Energia',
      icon: Home,
      component: (
        <FormProvider {...form}>
          <EnergyAccountForm 
            data={formData.energyAccount} 
            onUpdate={(data) => updateFormData('energyAccount', data)}
            onCepLookup={(cep) => handleCepLookup(cep, 'energy')}
            onAutoFill={autoFillEnergyAccount}
            form={form}
          />
        </FormProvider>
      )
    },
    { 
      number: 5, 
      title: 'Transferência de Titularidade',
      icon: ArrowRightLeft,
      component: (
        <FormProvider {...form}>
          <TitleTransferForm 
            data={formData.titleTransfer} 
            onUpdate={(data) => updateFormData('titleTransfer', data)}
            form={form}
          />
        </FormProvider>
      )
    },
    { 
      number: 6, 
      title: 'Contrato do Plano',
      icon: FileText,
      component: (
        <FormProvider {...form}>
          <PlanContractForm 
            data={formData.planContract} 
            onUpdate={(data) => updateFormData('planContract', data)}
            form={form}
          />
        </FormProvider>
      )
    },
    { 
      number: 7, 
      title: 'Detalhes do Plano',
      icon: Settings,
      component: (
        <FormProvider {...form}>
          <PlanDetailsForm 
            data={formData.planDetails} 
            onUpdate={(data) => updateFormData('planDetails', data)}
            form={form}
          />
        </FormProvider>
      )
    },
    { 
      number: 8, 
      title: 'Configurações de Notificação',
      icon: Bell,
      component: (
        <FormProvider {...form}>
          <NotificationSettingsForm 
            data={formData.notificationSettings} 
            onUpdate={(data) => updateFormData('notificationSettings', data)}
            form={form}
          />
        </FormProvider>
      )
    },
    { 
      number: 9, 
      title: 'Anexos',
      icon: Paperclip,
      component: (
        <FormProvider {...form}>
          <AttachmentsForm 
            data={formData.attachments} 
            subscriberType={formData.subscriberType}
            willTransfer={formData.titleTransfer?.willTransfer || false}
            onUpdate={(data) => updateFormData('attachments', data)}
            form={form}
          />
        </FormProvider>
      )
    },
  ];

  return { steps };
};
