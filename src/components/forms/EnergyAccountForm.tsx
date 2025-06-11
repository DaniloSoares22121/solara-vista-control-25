
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { EnergyAccount } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import ContaEnergiaForm from './ContaEnergiaForm';

interface EnergyAccountFormProps {
  initialValues: EnergyAccount;
  onChange: (value: EnergyAccount) => void;
  isEditing?: boolean;
  subscriberData?: any;
}

const EnergyAccountForm = forwardRef<HTMLFormElement, EnergyAccountFormProps>(
  ({ initialValues, onChange, isEditing, subscriberData }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    
    console.log('EnergyAccountForm - initialValues:', initialValues);
    console.log('EnergyAccountForm - subscriberData recebido:', subscriberData);
    
    const form = useForm({
      defaultValues: initialValues,
      mode: 'onChange'
    });

    const watchedValues = form.watch();

    // Update data when form changes
    useEffect(() => {
      console.log('EnergyAccountForm - watchedValues changed:', watchedValues);
      onChange(watchedValues);
    }, [watchedValues, onChange]);

    // Update form when initialValues change
    useEffect(() => {
      console.log('EnergyAccountForm - resetting form with:', initialValues);
      form.reset(initialValues);
    }, [initialValues, form]);

    // Garantir que sempre comece no topo
    useEffect(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = 0;
        }
      }
    }, [subscriberData]);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>2. Conta de Energia</CardTitle>
          <p className="text-sm text-gray-600">
            Os dados do assinante serão preenchidos automaticamente. Confirme e complete as informações da conta de energia.
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea ref={scrollAreaRef} className="h-[600px] w-full">
            <Form {...form}>
              <form ref={formRef} className="space-y-4 pr-4">
                <ContaEnergiaForm form={form} subscriberData={subscriberData} />
                <input type="hidden" name="energyAccount" required />
              </form>
            </Form>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
);

EnergyAccountForm.displayName = 'EnergyAccountForm';

export default EnergyAccountForm;
