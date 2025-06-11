
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { NotificationSettings } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationSettingsFormProps {
  initialValues: NotificationSettings;
  onChange: (value: NotificationSettings) => void;
  isEditing?: boolean;
}

const NotificationSettingsForm = forwardRef<HTMLFormElement, NotificationSettingsFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>7. Configurações de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário das notificações em desenvolvimento...
            </div>
            <input type="hidden" name="notifications" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

NotificationSettingsForm.displayName = 'NotificationSettingsForm';

export default NotificationSettingsForm;
