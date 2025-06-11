
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { PersonData } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SubscriberFormProps {
  initialValues: PersonData;
  onChange: (value: PersonData) => void;
  isEditing?: boolean;
}

const SubscriberForm = forwardRef<HTMLFormElement, SubscriberFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>2. Dados do Assinante</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário do assinante em desenvolvimento...
            </div>
            <input type="hidden" name="subscriber" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

SubscriberForm.displayName = 'SubscriberForm';

export default SubscriberForm;
