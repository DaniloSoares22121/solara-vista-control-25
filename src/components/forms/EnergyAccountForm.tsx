
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { EnergyAccount } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import ContaEnergiaForm from './ContaEnergiaForm';

interface EnergyAccountFormProps {
  initialValues: EnergyAccount;
  onChange: (value: EnergyAccount) => void;
  isEditing?: boolean;
  subscriberData?: any;
}

const EnergyAccountForm = forwardRef<HTMLFormElement, EnergyAccountFormProps>(
  ({ initialValues, onChange, isEditing, subscriberData }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    
    console.log('EnergyAccountForm - initialValues:', initialValues);
    console.log('EnergyAccountForm - subscriberData recebido:', subscriberData);
    
    const form = useForm({
      defaultValues: initialValues,
      mode: 'onChange'
    });

    const watchedValues = form.watch();

    // Update data when form changes
    useEffect(() => {
      console.log('EnergyAccountForm - watchedValues changed:', watchedValues);
      onChange(watchedValues);
    }, [watchedValues, onChange]);

    // Update form when initialValues change
    useEffect(() => {
      console.log('EnergyAccountForm - resetting form with:', initialValues);
      form.reset(initialValues);
    }, [initialValues, form]);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>2. Conta de Energia</CardTitle>
          <p className="text-sm text-gray-600">
            Os dados do assinante serão preenchidos automaticamente. Confirme e complete as informações da conta de energia.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} className="space-y-4">
              <ContaEnergiaForm form={form} subscriberData={subscriberData} />
              <input type="hidden" name="energyAccount" required />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

EnergyAccountForm.displayName = 'EnergyAccountForm';

export default EnergyAccountForm;
