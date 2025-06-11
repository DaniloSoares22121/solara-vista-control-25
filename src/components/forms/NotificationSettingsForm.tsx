
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { NotificationSettings } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import NotificacoesForm from './NotificacoesForm';

interface NotificationSettingsFormProps {
  initialValues: NotificationSettings;
  onChange: (value: NotificationSettings) => void;
  isEditing?: boolean;
}

const NotificationSettingsForm = forwardRef<HTMLFormElement, NotificationSettingsFormProps>(
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
          <CardTitle>7. Configurações de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} className="space-y-4">
              <NotificacoesForm form={form} />
              <input type="hidden" name="notifications" required />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

NotificationSettingsForm.displayName = 'NotificationSettingsForm';

export default NotificationSettingsForm;
