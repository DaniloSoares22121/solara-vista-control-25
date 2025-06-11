
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PersonalData, Address } from '@/types/subscriber';
import AddressForm from '../AddressForm';
import ContactsSection from './ContactsSection';

interface PersonalDataFormProps {
  data?: PersonalData;
  onUpdate: (data: Partial<PersonalData>) => void;
  onCepLookup: (cep: string) => void;
  onAddContact: () => void;
  onRemoveContact: (contactId: string) => void;
  form: UseFormReturn<any>;
}

const PersonalDataForm = ({
  data,
  onUpdate,
  onCepLookup,
  onAddContact,
  onRemoveContact,
  form
}: PersonalDataFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">3A. Dados do Assinante (Pessoa Física)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="personalData.cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="999.999.999-99" 
                  placeholder="000.000.000-00" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ cpf: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.partnerNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Parceiro de Negócio *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite o número do parceiro" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ partnerNumber: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo do Titular *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite o nome completo" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ fullName: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="date" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ birthDate: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ maritalStatus: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite a profissão" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ profession: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="(99) 99999-9999" 
                  placeholder="(00) 00000-0000" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ phone: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ email: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AddressForm 
        form={form} 
        prefix="personalData.address" 
        title="Endereço Residencial"
        onCepChange={onCepLookup}
        onAddressChange={(address: Partial<Address>) => {
          const currentAddress = data?.address || {
            cep: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
          };
          onUpdate({ 
            address: { 
              ...currentAddress, 
              ...address 
            } as Address 
          });
        }}
      />

      <FormField
        control={form.control}
        name="personalData.observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Observações adicionais" 
                onChange={(e) => {
                  field.onChange(e);
                  onUpdate({ observations: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ContactsSection
        contacts={data?.contacts || []}
        onAddContact={onAddContact}
        onRemoveContact={onRemoveContact}
        form={form}
        fieldPrefix="personalData"
      />
    </div>
  );
};

export default PersonalDataForm;
