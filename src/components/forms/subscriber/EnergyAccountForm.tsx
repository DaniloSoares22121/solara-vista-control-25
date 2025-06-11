
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MaskedInput } from '@/components/ui/masked-input';
import { useForm } from 'react-hook-form';
import { EnergyAccount, Address } from '@/types/subscriber';
import { Copy, Zap, MapPin, RefreshCw } from 'lucide-react';
import AddressForm from '@/components/forms/AddressForm';

interface EnergyAccountFormProps {
  data: EnergyAccount;
  onUpdate: (data: Partial<EnergyAccount>) => void;
  onCepChange: (cep: string) => Promise<void>;
  onAutoFill: () => void;
  subscriberType: 'person' | 'company';
}

const EnergyAccountForm = ({ 
  data, 
  onUpdate, 
  onCepChange, 
  onAutoFill, 
  subscriberType 
}: EnergyAccountFormProps) => {
  const form = useForm({
    defaultValues: data,
  });

  const handleFieldChange = (field: keyof EnergyAccount, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleAddressChange = (addressUpdate: Partial<Address>) => {
    const updatedAddress = { ...data.address, ...addressUpdate };
    onUpdate({ address: updatedAddress });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conta de Energia</h3>
          <p className="text-gray-600">Dados da unidade consumidora</p>
        </div>
        
        <Button
          type="button"
          onClick={onAutoFill}
          variant="outline"
          className="flex items-center space-x-2 border-green-300 text-green-700 hover:bg-green-50"
        >
          <Copy className="w-4 h-4" />
          <span>Auto-preencher</span>
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span>Dados da Conta</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="holderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Titular *</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={(value: 'person' | 'company') => {
                        field.onChange(value);
                        handleFieldChange('holderType', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="person">Pessoa Física</SelectItem>
                        <SelectItem value="company">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {data.holderType === 'company' ? 'CNPJ' : 'CPF'} do Titular *
                  </FormLabel>
                  <FormControl>
                    <MaskedInput
                      {...field}
                      mask={data.holderType === 'company' ? '99.999.999/9999-99' : '999.999.999-99'}
                      placeholder={data.holderType === 'company' ? '00.000.000/0000-00' : '000.000.000-00'}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange('cpfCnpj', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Titular *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite o nome completo"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange('holderName', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade Consumidora (UC) *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite o número da UC"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange('uc', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partnerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número Parceiro de Negócio</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite o número do parceiro"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange('partnerNumber', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {subscriberType === 'person' && (
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange('birthDate', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Endereço da Instalação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AddressForm
            form={form}
            prefix="address"
            title=""
            onCepChange={onCepChange}
            onAddressChange={handleAddressChange}
            className="space-y-4"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyAccountForm;
