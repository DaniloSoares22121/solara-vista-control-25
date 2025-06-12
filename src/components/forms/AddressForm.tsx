
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CepInput } from '@/components/ui/cep-input';
import { UseFormReturn } from 'react-hook-form';
import { Address } from '@/types/subscriber';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix: string;
  title: string;
  onCepChange?: (cep: string) => void;
  onAddressChange?: (address: Partial<Address>) => void;
  className?: string;
}

const AddressForm = ({ form, prefix, title, onCepChange, onAddressChange, className }: AddressFormProps) => {
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

  const handleCepFound = (cepData: any) => {
    console.log('CEP encontrado:', cepData);
    
    // Mapear os campos da API ViaCEP para os campos do formulário
    const addressData = {
      endereco: cepData.logradouro || '',
      bairro: cepData.bairro || '',
      cidade: cepData.localidade || '',
      estado: cepData.uf || '',
    };

    // Atualizar os campos do formulário
    if (cepData.logradouro) {
      form.setValue(`${prefix}.endereco`, cepData.logradouro);
    }
    if (cepData.bairro) {
      form.setValue(`${prefix}.bairro`, cepData.bairro);
    }
    if (cepData.localidade) {
      form.setValue(`${prefix}.cidade`, cepData.localidade);
    }
    if (cepData.uf) {
      form.setValue(`${prefix}.estado`, cepData.uf);
    }

    // Callback opcional
    if (onAddressChange) {
      onAddressChange(addressData);
    }
  };

  return (
    <div className={className || "space-y-6"}>
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-500 rounded"></div>
          {title}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name={`${prefix}.cep`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">CEP *</FormLabel>
                <FormControl>
                  <CepInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    onCepFound={handleCepFound}
                    placeholder="00000-000"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <FormLabel className="text-sm font-medium text-gray-700">Endereço *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o endereço" 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                <FormLabel className="text-sm font-medium text-gray-700">Número *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Nº" 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                <FormLabel className="text-sm font-medium text-gray-700">Complemento</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Apto, Casa, etc." 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                <FormLabel className="text-sm font-medium text-gray-700">Bairro *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o bairro" 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                <FormLabel className="text-sm font-medium text-gray-700">Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite a cidade" 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                <FormLabel className="text-sm font-medium text-gray-700">Estado *</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Selecione" />
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
    </div>
  );
};

export default AddressForm;
