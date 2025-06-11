
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EnergyAccount, Address } from '@/types/subscriber';
import AddressForm from '../AddressForm';
import { toast } from 'sonner';

interface EnergyAccountFormProps {
  data: EnergyAccount;
  onUpdate: (data: Partial<EnergyAccount>) => void;
  onCepLookup: (cep: string) => void;
  onAutoFill: () => void;
  form: UseFormReturn<any>;
}

const EnergyAccountForm = ({ data, onUpdate, onCepLookup, onAutoFill, form }: EnergyAccountFormProps) => {
  const [isAutoFilling, setIsAutoFilling] = React.useState(false);

  const handleAddressChange = (addressUpdate: Partial<Address>) => {
    const currentAddress = data.address || {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };
    
    const newAddress: Address = { ...currentAddress, ...addressUpdate };
    onUpdate({ address: newAddress });
  };

  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    try {
      await onAutoFill();
      // Auto-buscar CEP se disponível
      if (data.address?.cep) {
        await onCepLookup(data.address.cep);
      }
    } catch (error) {
      toast.error('Erro ao preencher automaticamente');
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Auto-buscar CEP quando for alterado
  const handleCepChange = async (cep: string) => {
    handleAddressChange({ cep });
    if (cep.replace(/\D/g, '').length === 8) {
      await onCepLookup(cep);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">4. Cadastro Original da Conta de Energia</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoFill}
          disabled={isAutoFilling}
          className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          {isAutoFilling ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{isAutoFilling ? 'Preenchendo...' : 'Preencher com dados do assinante'}</span>
        </Button>
      </div>
      
      <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <FormField
          control={form.control}
          name="energyAccount.holderType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-900 font-medium">Tipo de Titular *</FormLabel>
              <FormControl>
                <RadioGroup 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ holderType: value as 'person' | 'company' });
                  }}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm border">
                    <RadioGroupItem value="person" id="person-holder" />
                    <Label htmlFor="person-holder" className="text-gray-700">Pessoa Física</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm border">
                    <RadioGroupItem value="company" id="company-holder" />
                    <Label htmlFor="company-holder" className="text-gray-700">Pessoa Jurídica</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="energyAccount.cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900 font-medium">
                  {data.holderType === 'person' ? 'CPF' : 'CNPJ'} *
                </FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask={data.holderType === 'person' ? "999.999.999-99" : "99.999.999/9999-99"}
                    placeholder={data.holderType === 'person' ? "000.000.000-00" : "00.000.000/0000-00"}
                    className="bg-white border-blue-200 focus:border-blue-400"
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdate({ cpfCnpj: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.holderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900 font-medium">
                  {data.holderType === 'person' ? 'Nome da Pessoa Física' : 'Nome da Empresa'} *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o nome" 
                    className="bg-white border-blue-200 focus:border-blue-400"
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdate({ holderName: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {data.holderType === 'person' && (
            <FormField
              control={form.control}
              name="energyAccount.birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-900 font-medium">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date" 
                      className="bg-white border-blue-200 focus:border-blue-400"
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
          )}

          <FormField
            control={form.control}
            name="energyAccount.uc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900 font-medium">UC - Unidade Consumidora *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite a UC" 
                    className="bg-white border-blue-200 focus:border-blue-400"
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdate({ uc: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.partnerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900 font-medium">Número do Parceiro</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o número do parceiro" 
                    className="bg-white border-blue-200 focus:border-blue-400"
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
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
        <AddressForm 
          form={form} 
          prefix="energyAccount.address" 
          title="Endereço da Conta de Energia"
          onCepChange={handleCepChange}
          onAddressChange={handleAddressChange}
          className="space-y-4"
        />
      </div>
    </div>
  );
};

export default EnergyAccountForm;
