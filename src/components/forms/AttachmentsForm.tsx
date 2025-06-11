
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { SubscriberFormData } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttachmentsFormProps {
  initialValues: SubscriberFormData['attachments'];
  onChange: (value: SubscriberFormData['attachments']) => void;
  isEditing?: boolean;
}

const AttachmentsForm = forwardRef<HTMLFormElement, AttachmentsFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>8. Anexos</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário de anexos em desenvolvimento...
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
);

AttachmentsForm.displayName = 'AttachmentsForm';

export default AttachmentsForm;
