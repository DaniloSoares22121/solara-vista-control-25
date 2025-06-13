
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { CepInput } from '@/components/ui/cep-input';

interface AddressFormProps {
  form: UseFormReturn<any>;
  prefix: string;
  title?: string;
  className?: string;
  onCepChange?: (cep: string) => void;
  onAddressChange?: (addressUpdate: any) => void;
}

const AddressForm = ({ 
  form, 
  prefix, 
  title = "Endereço", 
  className = "",
  onCepChange,
  onAddressChange 
}: AddressFormProps) => {
  
  const handleCepFound = (cepData: any) => {
    console.log('📍 CEP encontrado, preenchendo endereço:', cepData);
    
    if (cepData) {
      form.setValue(`${prefix}.endereco`, cepData.logradouro || '');
      form.setValue(`${prefix}.bairro`, cepData.bairro || '');
      form.setValue(`${prefix}.cidade`, cepData.localidade || '');
      form.setValue(`${prefix}.estado`, cepData.uf || '');
      
      if (onAddressChange) {
        onAddressChange({
          endereco: cepData.logradouro || '',
          bairro: cepData.bairro || '',
          cidade: cepData.localidade || '',
          estado: cepData.uf || ''
        });
      }
    }
  };

  const handleAddressFieldChange = (field: string, value: string) => {
    form.setValue(`${prefix}.${field}`, value);
    if (onAddressChange) {
      onAddressChange({ [field]: value });
    }
  };

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
                <CepInput
                  value={field.value || ''}
                  onChange={(value) => {
                    field.onChange(value);
                    if (onCepChange) {
                      onCepChange(value);
                    }
                  }}
                  onCepFound={handleCepFound}
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
                <Input 
                  placeholder="Rua, Avenida, etc." 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleAddressFieldChange('endereco', e.target.value);
                  }}
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
              <FormLabel>Número *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="123" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleAddressFieldChange('numero', e.target.value);
                  }}
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
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Apto, Sala, etc." 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleAddressFieldChange('complemento', e.target.value);
                  }}
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
              <FormLabel>Bairro *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome do bairro" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleAddressFieldChange('bairro', e.target.value);
                  }}
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
              <FormLabel>Cidade *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome da cidade" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleAddressFieldChange('cidade', e.target.value);
                  }}
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
              <FormLabel>Estado *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="UF" 
                  maxLength={2} 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleAddressFieldChange('estado', e.target.value);
                  }}
                />
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
