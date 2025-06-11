
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { PlanDetails } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanDetailsFormProps {
  initialValues: PlanDetails;
  onChange: (value: PlanDetails) => void;
  isEditing?: boolean;
}

const PlanDetailsForm = forwardRef<HTMLFormElement, PlanDetailsFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>6. Detalhes do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="text-sm text-gray-600">
              Formulário dos detalhes do plano em desenvolvimento...
            </div>
            <input type="hidden" name="planDetails" required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

PlanDetailsForm.displayName = 'PlanDetailsForm';

export default PlanDetailsForm;
