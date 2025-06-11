
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { PersonData, AdministratorData } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConcessionariaSelector from './subscriber/ConcessionariaSelector';
import SubscriberTypeSelector from './subscriber/SubscriberTypeSelector';
import SubscriberDataManager from './subscriber/SubscriberDataManager';

interface SubscriberFormProps {
  initialValues: PersonData;
  initialAdministrator?: AdministratorData;
  onChange: (value: PersonData, concessionaria: string, administrator?: AdministratorData) => void;
  isEditing?: boolean;
  concessionaria?: string;
}

const SubscriberForm = forwardRef<HTMLFormElement, SubscriberFormProps>(
  ({ initialValues, initialAdministrator, onChange, isEditing, concessionaria = '' }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [subscriberType, setSubscriberType] = useState<'fisica' | 'juridica'>(initialValues.type || 'fisica');
    const [currentConcessionaria, setCurrentConcessionaria] = useState(concessionaria);
    const [subscriberData, setSubscriberData] = useState<PersonData>(initialValues);
    const [administrator, setAdministrator] = useState<AdministratorData | undefined>(initialAdministrator);

    useImperativeHandle(ref, () => formRef.current!);

    console.log('SubscriberForm - subscriberType:', subscriberType);
    console.log('SubscriberForm - currentConcessionaria:', currentConcessionaria);

    // Update parent when any data changes
    useEffect(() => {
      onChange(subscriberData, currentConcessionaria, administrator);
    }, [subscriberData, currentConcessionaria, administrator, onChange]);

    // Update form when initial values change
    useEffect(() => {
      setSubscriberData(initialValues);
      setSubscriberType(initialValues.type || 'fisica');
    }, [initialValues]);

    // Update administrator when initial administrator changes
    useEffect(() => {
      setAdministrator(initialAdministrator);
    }, [initialAdministrator]);

    const handleSubscriberTypeChange = (newType: 'fisica' | 'juridica') => {
      console.log('Subscriber type changing to:', newType);
      setSubscriberType(newType);
    };

    const handleConcessionariaChange = (value: string) => {
      setCurrentConcessionaria(value);
    };

    const handleSubscriberDataChange = (data: PersonData, adminData?: AdministratorData) => {
      setSubscriberData(data);
      if (adminData !== undefined) {
        setAdministrator(adminData);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>1. Dados do Assinante</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-6">
            <ConcessionariaSelector 
              value={currentConcessionaria} 
              onChange={handleConcessionariaChange} 
            />

            <SubscriberTypeSelector 
              value={subscriberType} 
              onChange={handleSubscriberTypeChange} 
            />

            <SubscriberDataManager
              subscriberType={subscriberType}
              initialData={subscriberData}
              initialAdministrator={administrator}
              onChange={handleSubscriberDataChange}
            />

            {/* Hidden fields for form validation */}
            <input type="hidden" name="subscriber" required />
            <input type="hidden" name="concessionaria" value={currentConcessionaria} required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

SubscriberForm.displayName = 'SubscriberForm';

export default SubscriberForm;
