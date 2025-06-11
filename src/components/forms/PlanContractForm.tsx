
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { PlanContract } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import PlanoContratadoForm from './PlanoContratadoForm';

interface PlanContractFormProps {
  initialValues: PlanContract;
  onChange: (value: PlanContract) => void;
  isEditing?: boolean;
}

const PlanContractForm = forwardRef<HTMLFormElement, PlanContractFormProps>(
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
          <CardTitle>5. Plano Contratado</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <PlanoContratadoForm form={form} />
            <input type="hidden" name="planContract" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

PlanContractForm.displayName = 'PlanContractForm';

export default PlanContractForm;
