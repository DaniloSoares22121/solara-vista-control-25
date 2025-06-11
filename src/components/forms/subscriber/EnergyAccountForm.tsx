
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { EnergyAccount, Address } from '@/types/subscriber';
import AddressForm from '../AddressForm';

interface EnergyAccountFormProps {
  data: EnergyAccount;
  onUpdate: (data: Partial<EnergyAccount>) => void;
  onCepLookup: (cep: string) => void;
  form: UseFormReturn<any>;
}

const EnergyAccountForm = ({ data, onUpdate, onCepLookup, form }: EnergyAccountFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">4. Cadastro Original da Conta de Energia</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="energyAccount.holderType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Titular *</FormLabel>
              <FormControl>
                <RadioGroup 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ holderType: value as 'person' | 'company' });
                  }}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="person" id="person-holder" />
                    <Label htmlFor="person-holder">Pessoa Física</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company-holder" />
                    <Label htmlFor="company-holder">Pessoa Jurídica</Label>
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
                <FormLabel>{data.holderType === 'person' ? 'CPF' : 'CNPJ'} *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask={data.holderType === 'person' ? "999.999.999-99" : "99.999.999/9999-99"}
                    placeholder={data.holderType === 'person' ? "000.000.000-00" : "00.000.000/0000-00"}
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
                <FormLabel>{data.holderType === 'person' ? 'Nome da Pessoa Física' : 'Nome da Empresa'} *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o nome" 
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
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date" 
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
                <FormLabel>UC - Unidade Consumidora *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite a UC" 
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
                <FormLabel>Número do Parceiro</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o número do parceiro" 
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

        <AddressForm 
          form={form} 
          prefix="energyAccount.address" 
          title="Endereço da Conta de Energia"
          onCepChange={onCepLookup}
          onAddressChange={(address: Partial<Address>) => onUpdate({ 
            address: { 
              ...data.address, 
              ...address 
            } as Address 
          })}
        />
      </div>
    </div>
  );
};

export default EnergyAccountForm;
