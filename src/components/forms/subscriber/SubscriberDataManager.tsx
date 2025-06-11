
import React, { useState, useEffect } from 'react';
import { PersonData, Contact, AdministratorData } from '@/types/subscriber';
import DadosPessoaFisicaForm from '../DadosPessoaFisicaForm';
import DadosPessoaJuridicaForm from '../DadosPessoaJuridicaForm';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';

interface SubscriberDataManagerProps {
  subscriberType: 'fisica' | 'juridica';
  initialData: PersonData;
  initialAdministrator?: AdministratorData;
  onChange: (data: PersonData, administrator?: AdministratorData) => void;
}

const SubscriberDataManager = ({ 
  subscriberType, 
  initialData, 
  initialAdministrator,
  onChange 
}: SubscriberDataManagerProps) => {
  const [contacts, setContacts] = useState<Contact[]>(initialData.contacts || []);
  const [administrator, setAdministrator] = useState<AdministratorData | undefined>(initialAdministrator);

  const form = useForm({
    defaultValues: initialData,
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  console.log('SubscriberDataManager - subscriberType:', subscriberType);
  console.log('SubscriberDataManager - watchedValues:', watchedValues);

  // Update parent when form changes
  useEffect(() => {
    const updatedData = { 
      ...watchedValues, 
      type: subscriberType,
      contacts 
    };
    onChange(updatedData, administrator);
  }, [watchedValues, contacts, administrator, subscriberType, onChange]);

  // Reset form when subscriber type changes
  useEffect(() => {
    const resetData = {
      ...initialData,
      type: subscriberType,
      // Clear fields that don't apply to the new type
      ...(subscriberType === 'fisica' ? {
        razaoSocial: '',
        nomeFantasia: ''
      } : {
        dataNascimento: '',
        estadoCivil: '',
        profissao: ''
      })
    };
    form.reset(resetData);
  }, [subscriberType, form, initialData]);

  const handleContactsChange = (newContacts: Contact[]) => {
    setContacts(newContacts);
  };

  const handleAdministratorChange = (newAdministrator: AdministratorData | undefined) => {
    setAdministrator(newAdministrator);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {subscriberType === 'fisica' ? (
          <DadosPessoaFisicaForm 
            form={form} 
            contacts={contacts}
            onContactsChange={handleContactsChange}
          />
        ) : (
          <DadosPessoaJuridicaForm 
            form={form} 
            contacts={contacts}
            onContactsChange={handleContactsChange}
            administrator={administrator}
            onAdministratorChange={handleAdministratorChange}
          />
        )}
      </div>
    </Form>
  );
};

export default SubscriberDataManager;
