
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { EnergyAccount } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EnergyAccountFormProps {
  initialValues: EnergyAccount;
  onChange: (value: EnergyAccount) => void;
  isEditing?: boolean;
}

const EnergyAccountForm = forwardRef<HTMLFormElement, EnergyAccountFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>4. Conta de Energia</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário da conta de energia em desenvolvimento...
            </div>
            <input type="hidden" name="energyAccount" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

EnergyAccountForm.displayName = 'EnergyAccountForm';

export default EnergyAccountForm;
