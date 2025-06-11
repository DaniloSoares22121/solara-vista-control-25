
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PersonData, Contact } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import DadosPessoaFisicaForm from './DadosPessoaFisicaForm';
import DadosPessoaJuridicaForm from './DadosPessoaJuridicaForm';

interface SubscriberFormProps {
  initialValues: PersonData;
  onChange: (value: PersonData) => void;
  isEditing?: boolean;
}

const SubscriberForm = forwardRef<HTMLFormElement, SubscriberFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [contacts, setContacts] = React.useState<Contact[]>(initialValues.contacts || []);

    useImperativeHandle(ref, () => formRef.current!);

    const form = useForm({
      defaultValues: initialValues,
      mode: 'onChange'
    });

    const watchedValues = form.watch();
    const subscriberType = form.watch('type');

    // Atualizar dados quando form mudar
    useEffect(() => {
      const currentData = { ...watchedValues, contacts };
      onChange(currentData);
    }, [watchedValues, contacts, onChange]);

    // Atualizar form quando initialValues mudar
    useEffect(() => {
      form.reset(initialValues);
      setContacts(initialValues.contacts || []);
    }, [initialValues, form]);

    const handleContactsChange = (newContacts: Contact[]) => {
      setContacts(newContacts);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>2. Dados do Assinante</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} className="space-y-6">
              {/* Tipo de Pessoa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tipo de Pessoa</h3>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fisica" id="fisica" />
                            <Label htmlFor="fisica">Pessoa Física</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="juridica" id="juridica" />
                            <Label htmlFor="juridica">Pessoa Jurídica</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Formulários condicionais baseados no tipo */}
              {subscriberType === 'fisica' ? (
                <DadosPessoaFisicaForm 
                  form={form} 
                  contacts={contacts}
                  onContactsChange={handleContactsChange}
                />
              ) : (
                <DadosPessoaJuridicaForm 
                  form={form} 
                  contacts={contacts}
                  onContactsChange={handleContactsChange}
                />
              )}

              {/* Campo hidden obrigatório para validação */}
              <input type="hidden" name="subscriber" required />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

SubscriberForm.displayName = 'SubscriberForm';

export default SubscriberForm;
