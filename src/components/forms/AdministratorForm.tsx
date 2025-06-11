
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { AdministratorData } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdministratorFormProps {
  initialValues: AdministratorData | undefined;
  onChange: (value: AdministratorData | undefined) => void;
  isEditing?: boolean;
}

const AdministratorForm = forwardRef<HTMLFormElement, AdministratorFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>3. Dados do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário do administrador em desenvolvimento...
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
);

AdministratorForm.displayName = 'AdministratorForm';

export default AdministratorForm;
