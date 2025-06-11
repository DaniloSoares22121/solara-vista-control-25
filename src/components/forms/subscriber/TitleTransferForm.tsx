
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { TitleTransfer } from '@/types/subscriber';

interface TitleTransferFormProps {
  data: TitleTransfer;
  onUpdate: (data: Partial<TitleTransfer>) => void;
  form: UseFormReturn<any>;
}

const TitleTransferForm = ({ data, onUpdate, form }: TitleTransferFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">5. Troca de Titularidade</h3>
      
      <FormField
        control={form.control}
        name="titleTransfer.willTransfer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Realizará Troca de Titularidade? *</FormLabel>
            <FormControl>
              <RadioGroup 
                value={field.value ? 'yes' : 'no'} 
                onValueChange={(value) => {
                  const willTransfer = value === 'yes';
                  field.onChange(willTransfer);
                  onUpdate({ willTransfer });
                }}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-transfer" />
                  <Label htmlFor="no-transfer">Não</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes-transfer" />
                  <Label htmlFor="yes-transfer">Sim</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {data.willTransfer && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-gray-900">Dados da Nova Titularidade</h4>
          
          <FormField
            control={form.control}
            name="titleTransfer.holderType"
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
                      <RadioGroupItem value="person" id="new-person" />
                      <Label htmlFor="new-person">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="new-company" />
                      <Label htmlFor="new-company">Pessoa Jurídica</Label>
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
              name="titleTransfer.cpfCnpj"
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
              name="titleTransfer.holderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
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
                name="titleTransfer.birthDate"
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
              name="titleTransfer.partnerNumber"
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

          <FormField
            control={form.control}
            name="titleTransfer.transferCompleted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Troca de Titularidade Concluída?</FormLabel>
                <FormControl>
                  <RadioGroup 
                    value={field.value ? 'yes' : 'no'} 
                    onValueChange={(value) => {
                      const completed = value === 'yes';
                      field.onChange(completed);
                      onUpdate({ transferCompleted: completed });
                    }}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="not-completed" />
                      <Label htmlFor="not-completed">Não</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="completed" />
                      <Label htmlFor="completed">Sim</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {data.transferCompleted && (
            <FormField
              control={form.control}
              name="titleTransfer.transferDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Transferência</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date" 
                      onChange={(e) => {
                        field.onChange(e);
                        onUpdate({ transferDate: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TitleTransferForm;
