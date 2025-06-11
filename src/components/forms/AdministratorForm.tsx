
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AdministratorData } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import DadosAdministradorForm from './DadosAdministradorForm';

interface AdministratorFormProps {
  initialValues?: AdministratorData;
  onChange: (value?: AdministratorData) => void;
  isEditing?: boolean;
}

const AdministratorForm = forwardRef<HTMLFormElement, AdministratorFormProps>(
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
      if (initialValues) {
        form.reset(initialValues);
      }
    }, [initialValues, form]);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>3. Dados do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} className="space-y-4">
              <DadosAdministradorForm form={form} />
              <input type="hidden" name="administrator" />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

AdministratorForm.displayName = 'AdministratorForm';

export default AdministratorForm;
