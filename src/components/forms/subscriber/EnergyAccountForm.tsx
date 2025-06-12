
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EnergyAccount, Address } from '@/types/subscriber';
import { CepInput } from '@/components/ui/cep-input';

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
    } catch (error) {
      console.error('Erro ao preencher automaticamente:', error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleCepFound = (cepData: any) => {
    console.log('CEP encontrado na conta de energia:', cepData);
    const addressUpdate = {
      cep: cepData.cep,
      street: cepData.logradouro,
      neighborhood: cepData.bairro,
      city: cepData.localidade,
      state: cepData.uf,
    };
    
    handleAddressChange(addressUpdate);
    
    // Atualizar os campos do formulário
    setTimeout(() => {
      form.setValue('energyAccount.address.street', cepData.logradouro);
      form.setValue('energyAccount.address.neighborhood', cepData.bairro);
      form.setValue('energyAccount.address.city', cepData.localidade);
      form.setValue('energyAccount.address.state', cepData.uf);
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">4</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Cadastro Original da Conta de Energia</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoFill}
          disabled={isAutoFilling}
          className="flex items-center space-x-2"
        >
          {isAutoFilling ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{isAutoFilling ? 'Preenchendo...' : 'Preencher com dados do assinante'}</span>
        </Button>
      </div>
      
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
        <FormField
          control={form.control}
          name="energyAccount.holderType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-medium">Tipo de Titular *</FormLabel>
              <FormControl>
                <RadioGroup 
                  value={field.value || 'person'} 
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
                <FormLabel className="text-gray-900 font-medium">
                  {data.holderType === 'person' ? 'CPF' : 'CNPJ'} *
                </FormLabel>
                <FormControl>
                  <MaskedInput 
                    value={field.value || ''}
                    mask={data.holderType === 'person' ? "999.999.999-99" : "99.999.999/9999-99"}
                    placeholder={data.holderType === 'person' ? "000.000.000-00" : "00.000.000/0000-00"}
                    className="bg-white"
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
                <FormLabel className="text-gray-900 font-medium">
                  {data.holderType === 'person' ? 'Nome da Pessoa Física' : 'Nome da Empresa'} *
                </FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite o nome" 
                    className="bg-white"
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
                  <FormLabel className="text-gray-900 font-medium">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      type="date" 
                      className="bg-white"
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
                <FormLabel className="text-gray-900 font-medium">UC - Unidade Consumidora *</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite a UC" 
                    className="bg-white"
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
                <FormLabel className="text-gray-900 font-medium">Número do Parceiro</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite o número do parceiro" 
                    className="bg-white"
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

      {/* Endereço da Conta de Energia */}
      <div className="p-6 bg-gray-50 rounded-lg border">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">📍</span>
          </div>
          Endereço da Conta de Energia
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="energyAccount.address.cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <CepInput
                    value={field.value || ''}
                    onChange={(value) => {
                      field.onChange(value);
                      handleAddressChange({ cep: value });
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
            name="energyAccount.address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite o endereço" 
                    onChange={(e) => {
                      field.onChange(e);
                      handleAddressChange({ street: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.address.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite o número" 
                    onChange={(e) => {
                      field.onChange(e);
                      handleAddressChange({ number: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.address.complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Apto, bloco, etc." 
                    onChange={(e) => {
                      field.onChange(e);
                      handleAddressChange({ complement: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.address.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro *</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite o bairro" 
                    onChange={(e) => {
                      field.onChange(e);
                      handleAddressChange({ neighborhood: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite a cidade" 
                    onChange={(e) => {
                      field.onChange(e);
                      handleAddressChange({ city: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || ''}
                    placeholder="Digite o estado" 
                    onChange={(e) => {
                      field.onChange(e);
                      handleAddressChange({ state: e.target.value });
                    }}
                  />
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

export default EnergyAccountForm;
