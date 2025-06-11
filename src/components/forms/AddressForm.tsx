
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { useCepLookup } from '@/hooks/useCepLookup';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix: string;
  title: string;
}

const AddressForm = ({ form, prefix, title }: AddressFormProps) => {
  const { lookupCep, loading } = useCepLookup();

  const handleCepBlur = async (cep: string) => {
    if (cep && cep.length === 9) {
      const address = await lookupCep(cep);
      if (address) {
        form.setValue(`${prefix}.endereco`, address.logradouro);
        form.setValue(`${prefix}.bairro`, address.bairro);
        form.setValue(`${prefix}.cidade`, address.localidade);
        form.setValue(`${prefix}.estado`, address.uf);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">{title}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${prefix}.cep`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP *</FormLabel>
              <FormControl>
                <MaskedInput
                  {...field}
                  mask="99999-999"
                  placeholder="00000-000"
                  onBlur={(e) => handleCepBlur(e.target.value)}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.endereco`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Endereço *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Rua, Avenida, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.numero`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.complemento`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Apt, Bloco, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.bairro`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome do bairro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.cidade`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome da cidade" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.estado`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="UF" maxLength={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressForm;
