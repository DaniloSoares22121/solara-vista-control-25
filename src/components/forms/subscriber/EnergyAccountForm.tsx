
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EnergyAccount, Address } from '@/types/subscriber';
import { CepInput } from '@/components/ui/cep-input';

interface EnergyAccountFormProps {
  data: EnergyAccount;
  onUpdate: (data: Partial<EnergyAccount>) => void;
  onCepLookup: (cep: string) => void;
  onAutoFill: () => void;
  form: UseFormReturn<any>;
  subscriberData?: any;
}

const EnergyAccountForm = ({ data, onUpdate, onCepLookup, form, subscriberData }: EnergyAccountFormProps) => {
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

  const handleCopyFromResidentialAddress = () => {
    let residentialAddress = null;
    
    // Buscar endereço residencial dependendo do tipo de assinante
    if (subscriberData?.subscriberType === 'person' && subscriberData?.personalData?.address) {
      residentialAddress = subscriberData.personalData.address;
    } else if (subscriberData?.subscriberType === 'company' && subscriberData?.companyData?.address) {
      residentialAddress = subscriberData.companyData.address;
    }
    
    if (residentialAddress) {
      console.log('Copiando endereço residencial para conta de energia:', residentialAddress);
      
      // Atualizar o estado local
      handleAddressChange({
        cep: residentialAddress.cep || '',
        street: residentialAddress.street || residentialAddress.endereco || '',
        number: residentialAddress.number || residentialAddress.numero || '',
        complement: residentialAddress.complement || residentialAddress.complemento || '',
        neighborhood: residentialAddress.neighborhood || residentialAddress.bairro || '',
        city: residentialAddress.city || residentialAddress.cidade || '',
        state: residentialAddress.state || residentialAddress.estado || '',
      });
      
      // Atualizar os campos do formulário
      setTimeout(() => {
        form.setValue('energyAccount.address.cep', residentialAddress.cep || '');
        form.setValue('energyAccount.address.street', residentialAddress.street || residentialAddress.endereco || '');
        form.setValue('energyAccount.address.number', residentialAddress.number || residentialAddress.numero || '');
        form.setValue('energyAccount.address.complement', residentialAddress.complement || residentialAddress.complemento || '');
        form.setValue('energyAccount.address.neighborhood', residentialAddress.neighborhood || residentialAddress.bairro || '');
        form.setValue('energyAccount.address.city', residentialAddress.city || residentialAddress.cidade || '');
        form.setValue('energyAccount.address.state', residentialAddress.state || residentialAddress.estado || '');
      }, 100);
    }
  };

  // Sincronizar os valores do estado com o formulário quando data mudar
  React.useEffect(() => {
    if (data.cpfCnpj && form.getValues('energyAccount.cpfCnpj') !== data.cpfCnpj) {
      form.setValue('energyAccount.cpfCnpj', data.cpfCnpj);
    }
    if (data.holderName && form.getValues('energyAccount.holderName') !== data.holderName) {
      form.setValue('energyAccount.holderName', data.holderName);
    }
    if (data.birthDate && form.getValues('energyAccount.birthDate') !== data.birthDate) {
      form.setValue('energyAccount.birthDate', data.birthDate);
    }
    if (data.partnerNumber && form.getValues('energyAccount.partnerNumber') !== data.partnerNumber) {
      form.setValue('energyAccount.partnerNumber', data.partnerNumber);
    }
    if (data.address?.cep && form.getValues('energyAccount.address.cep') !== data.address.cep) {
      form.setValue('energyAccount.address.cep', data.address.cep);
    }
    if (data.address?.street && form.getValues('energyAccount.address.street') !== data.address.street) {
      form.setValue('energyAccount.address.street', data.address.street);
    }
    if (data.address?.number && form.getValues('energyAccount.address.number') !== data.address.number) {
      form.setValue('energyAccount.address.number', data.address.number);
    }
    if (data.address?.complement && form.getValues('energyAccount.address.complement') !== data.address.complement) {
      form.setValue('energyAccount.address.complement', data.address.complement);
    }
    if (data.address?.neighborhood && form.getValues('energyAccount.address.neighborhood') !== data.address.neighborhood) {
      form.setValue('energyAccount.address.neighborhood', data.address.neighborhood);
    }
    if (data.address?.city && form.getValues('energyAccount.address.city') !== data.address.city) {
      form.setValue('energyAccount.address.city', data.address.city);
    }
    if (data.address?.state && form.getValues('energyAccount.address.state') !== data.address.state) {
      form.setValue('energyAccount.address.state', data.address.state);
    }
  }, [data, form]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">4</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Cadastro Original da Conta de Energia</h3>
        <div className="ml-auto text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Preenchimento automático ativo
        </div>
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
                  value={field.value || data.holderType || 'person'} 
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
                  {(data.holderType || 'person') === 'person' ? 'CPF' : 'CNPJ'} *
                </FormLabel>
                <FormControl>
                  <MaskedInput 
                    value={field.value || data.cpfCnpj || ''}
                    mask={(data.holderType || 'person') === 'person' ? "999.999.999-99" : "99.999.999/9999-99"}
                    placeholder={(data.holderType || 'person') === 'person' ? "000.000.000-00" : "00.000.000/0000-00"}
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
                  {(data.holderType || 'person') === 'person' ? 'Nome da Pessoa Física' : 'Nome da Empresa'} *
                </FormLabel>
                <FormControl>
                  <Input 
                    value={field.value || data.holderName || ''}
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

          {(data.holderType || 'person') === 'person' && (
            <FormField
              control={form.control}
              name="energyAccount.birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || data.birthDate || ''}
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
                    value={field.value || data.uc || ''}
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
                    value={field.value || data.partnerNumber || ''}
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
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">📍</span>
            </div>
            Endereço da Conta de Energia
          </h4>
          
          {subscriberData && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyFromResidentialAddress}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar Endereço Residencial
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="energyAccount.address.cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <CepInput
                    value={field.value || data.address?.cep || ''}
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
