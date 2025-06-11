
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PersonData, Contact, AdministratorData } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import DadosPessoaFisicaForm from './DadosPessoaFisicaForm';
import DadosPessoaJuridicaForm from './DadosPessoaJuridicaForm';

interface SubscriberFormProps {
  initialValues: PersonData;
  initialAdministrator?: AdministratorData;
  onChange: (value: PersonData, concessionaria: string, administrator?: AdministratorData) => void;
  isEditing?: boolean;
  concessionaria?: string;
}

const SubscriberForm = forwardRef<HTMLFormElement, SubscriberFormProps>(
  ({ initialValues, initialAdministrator, onChange, isEditing, concessionaria = '' }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [contacts, setContacts] = React.useState<Contact[]>(initialValues.contacts || []);
    const [currentConcessionaria, setCurrentConcessionaria] = React.useState(concessionaria);
    const [administrator, setAdministrator] = React.useState<AdministratorData | undefined>(initialAdministrator);

    useImperativeHandle(ref, () => formRef.current!);

    const form = useForm({
      defaultValues: initialValues,
      mode: 'onChange'
    });

    const watchedValues = form.watch();
    const subscriberType = form.watch('type');

    console.log('SubscriberForm - subscriberType:', subscriberType);
    console.log('SubscriberForm - watchedValues:', watchedValues);

    // Atualizar dados quando form mudar
    useEffect(() => {
      const currentData = { ...watchedValues, contacts };
      onChange(currentData, currentConcessionaria, administrator);
    }, [watchedValues, contacts, currentConcessionaria, administrator, onChange]);

    // Atualizar form quando initialValues mudar
    useEffect(() => {
      form.reset(initialValues);
      setContacts(initialValues.contacts || []);
    }, [initialValues, form]);

    // Atualizar administrator quando initialAdministrator mudar
    useEffect(() => {
      setAdministrator(initialAdministrator);
    }, [initialAdministrator]);

    const handleContactsChange = (newContacts: Contact[]) => {
      setContacts(newContacts);
    };

    const handleAdministratorChange = (newAdministrator: AdministratorData | undefined) => {
      setAdministrator(newAdministrator);
    };

    const handleConcessionariaChange = (value: string) => {
      setCurrentConcessionaria(value);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>1. Dados do Assinante</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form ref={formRef} className="space-y-6">
              {/* Seleção da Concessionária */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seleção da Concessionária</h3>
                <div className="space-y-2">
                  <Label htmlFor="concessionaria">Concessionária *</Label>
                  <Select value={currentConcessionaria} onValueChange={handleConcessionariaChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a concessionária" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equatorial-goias">Equatorial Goiás</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tipo de Assinante */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">2. Tipo de Assinante</h3>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            console.log('Radio button changed to:', value);
                            field.onChange(value);
                          }}
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
                  administrator={administrator}
                  onAdministratorChange={handleAdministratorChange}
                />
              )}

              {/* Campo hidden obrigatório para validação */}
              <input type="hidden" name="subscriber" required />
              <input type="hidden" name="concessionaria" value={currentConcessionaria} required />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

SubscriberForm.displayName = 'SubscriberForm';

export default SubscriberForm;
