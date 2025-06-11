
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

  // Single effect to handle all changes
  useEffect(() => {
    const updatedData = { 
      ...watchedValues, 
      type: subscriberType,
      contacts 
    };
    onChange(updatedData, administrator);
  }, [watchedValues, contacts, administrator, subscriberType, onChange]);

  // Reset form only when subscriber type changes, not on every render
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
    
    // Only reset if the type actually changed
    if (form.getValues('type') !== subscriberType) {
      form.reset(resetData);
    }
  }, [subscriberType]); // Remove form and initialData from dependencies

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
