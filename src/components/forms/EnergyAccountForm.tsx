
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { EnergyAccount } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import ContaEnergiaForm from './ContaEnergiaForm';

interface EnergyAccountFormProps {
  initialValues: EnergyAccount;
  onChange: (value: EnergyAccount) => void;
  isEditing?: boolean;
}

const EnergyAccountForm = forwardRef<HTMLFormElement, EnergyAccountFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    
    const form = useForm({
      defaultValues: initialValues,
      mode: 'onChange'
    });

    const watchedValues = form.watch();

    // Update data when form changes
    useEffect(() => {
      onChange(watchedValues);
    }, [watchedValues, onChange]);

    // Update form when initialValues change
    useEffect(() => {
      form.reset(initialValues);
    }, [initialValues, form]);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>4. Conta de Energia</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <ContaEnergiaForm form={form} />
            <input type="hidden" name="energyAccount" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

EnergyAccountForm.displayName = 'EnergyAccountForm';

export default EnergyAccountForm;
