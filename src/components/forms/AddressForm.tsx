
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { MapPin } from 'lucide-react';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix: string;
  title?: string;
  className?: string;
}

const AddressForm = ({ form, prefix, title = "Endereço", className = "" }: AddressFormProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-medium text-gray-900 border-b pb-2">{title}</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Input placeholder="Rua, Avenida, etc." {...field} />
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
                <Input placeholder="Apto, Sala, etc." {...field} />
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
              <FormLabel>Cidade *</FormLabel>
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
              <FormLabel>Estado *</FormLabel>
              <FormControl>
                <Input placeholder="UF" maxLength={2} {...field} />
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
