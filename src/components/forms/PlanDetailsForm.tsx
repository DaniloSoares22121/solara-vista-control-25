
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { PlanDetails } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import DetalhesPlanoForm from './DetalhesPlanoForm';

interface PlanDetailsFormProps {
  initialValues: PlanDetails;
  onChange: (value: PlanDetails) => void;
  isEditing?: boolean;
}

const PlanDetailsForm = forwardRef<HTMLFormElement, PlanDetailsFormProps>(
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
          <CardTitle>6. Detalhes do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} className="space-y-4">
              <DetalhesPlanoForm form={form} />
              <input type="hidden" name="planDetails" required />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

PlanDetailsForm.displayName = 'PlanDetailsForm';

export default PlanDetailsForm;
