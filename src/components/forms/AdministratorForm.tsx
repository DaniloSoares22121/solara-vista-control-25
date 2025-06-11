
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
    const [administrator, setAdministrator] = useState<AdministratorData | undefined>(initialValues);

    useImperativeHandle(ref, () => formRef.current!);

    // Handle administrator changes from DadosAdministradorForm
    const handleAdministratorChange = (newAdministrator: AdministratorData | undefined) => {
      setAdministrator(newAdministrator);
      onChange(newAdministrator);
    };

    // Update administrator when initialValues change
    useEffect(() => {
      setAdministrator(initialValues);
    }, [initialValues]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>3. Dados do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <DadosAdministradorForm 
              administrator={administrator}
              onChange={handleAdministratorChange}
            />
            <input type="hidden" name="administrator" />
          </form>
        </CardContent>
      </Card>
    );
  }
);

AdministratorForm.displayName = 'AdministratorForm';

export default AdministratorForm;
