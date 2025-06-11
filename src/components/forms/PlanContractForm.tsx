
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { PlanContract } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanContractFormProps {
  initialValues: PlanContract;
  onChange: (value: PlanContract) => void;
  isEditing?: boolean;
}

const PlanContractForm = forwardRef<HTMLFormElement, PlanContractFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>5. Plano Contratado</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário do plano contratado em desenvolvimento...
            </div>
            <input type="hidden" name="planContract" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

PlanContractForm.displayName = 'PlanContractForm';

export default PlanContractForm;
