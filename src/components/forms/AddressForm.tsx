
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Address } from '@/types/subscriber';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix: string;
  title: string;
  onCepChange?: (cep: string) => void;
  onAddressChange?: (address: Partial<Address>) => void;
}

const AddressForm = ({ form, prefix, title, onCepChange, onAddressChange }: AddressFormProps) => {
  const states = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">Preencha os dados do endereço</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name={`${prefix}.cep`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">CEP *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="99999-999" 
                  placeholder="00000-000" 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e);
                    const cep = e.target.value.replace(/\D/g, '');
                    if (cep.length === 8 && onCepChange) {
                      onCepChange(cep);
                    }
                    if (onAddressChange) {
                      onAddressChange({ cep: e.target.value });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.street`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-sm font-medium text-gray-700">Endereço *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite o endereço completo" 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e);
                    if (onAddressChange) {
                      onAddressChange({ street: e.target.value });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.number`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Número *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nº" 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e);
                    if (onAddressChange) {
                      onAddressChange({ number: e.target.value });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.complement`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Complemento</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Apto, Casa, etc." 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e);
                    if (onAddressChange) {
                      onAddressChange({ complement: e.target.value });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.neighborhood`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Bairro *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite o bairro" 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e);
                    if (onAddressChange) {
                      onAddressChange({ neighborhood: e.target.value });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Cidade *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite a cidade" 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  onChange={(e) => {
                    field.onChange(e);
                    if (onAddressChange) {
                      onAddressChange({ city: e.target.value });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}.state`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Estado *</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (onAddressChange) {
                      onAddressChange({ state: value });
                    }
                  }}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
