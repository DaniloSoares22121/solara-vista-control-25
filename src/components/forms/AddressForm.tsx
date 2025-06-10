
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { useCepLookup } from '@/hooks/useCepLookup';
import { useEffect } from 'react';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix: string;
  title?: string;
}

const AddressForm = ({ form, prefix, title }: AddressFormProps) => {
  const { lookupCep, loading } = useCepLookup();
  const cep = form.watch(`${prefix}.cep`);

  useEffect(() => {
    const handleCepLookup = async () => {
      if (cep && cep.replace(/\D/g, '').length === 8) {
        try {
          const addressData = await lookupCep(cep.replace(/\D/g, ''));
          if (addressData) {
            form.setValue(`${prefix}.endereco`, addressData.endereco || '');
            form.setValue(`${prefix}.bairro`, addressData.bairro || '');
            form.setValue(`${prefix}.cidade`, addressData.cidade || '');
            form.setValue(`${prefix}.estado`, addressData.estado || '');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    };

    handleCepLookup();
  }, [cep, lookupCep, form, prefix]);

  return (
    <div className="space-y-4">
      {title && <h4 className="font-medium text-gray-900">{title}</h4>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${prefix}.cep`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="99999-999" 
                  placeholder="00000-000"
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
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, Avenida..." {...field} />
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
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
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
                <Input placeholder="Apt, Casa..." {...field} />
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
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Nome do bairro" {...field} />
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
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Nome da cidade" {...field} />
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
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="GO" {...field} />
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
