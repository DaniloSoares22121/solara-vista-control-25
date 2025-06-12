
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PersonalData, Address } from '@/types/subscriber';
import { CepInput } from '@/components/ui/cep-input';
import ContactsSection from './ContactsSection';

interface PersonalDataFormProps {
  data?: PersonalData;
  onUpdate: (data: Partial<PersonalData>) => void;
  onCepLookup: (cep: string) => void;
  onAddContact: () => void;
  onRemoveContact: (contactId: string) => void;
  form: UseFormReturn<any>;
}

const PersonalDataForm = ({
  data,
  onUpdate,
  onCepLookup,
  onAddContact,
  onRemoveContact,
  form
}: PersonalDataFormProps) => {
  const handleAddressChange = (addressUpdate: Partial<Address>) => {
    const currentAddress = data?.address || {
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
    console.log('CEP encontrado no PersonalDataForm:', cepData);
    const addressUpdate = {
      cep: cepData.cep,
      street: cepData.logradouro,
      neighborhood: cepData.bairro,
      city: cepData.localidade,
      state: cepData.uf,
    };
    
    handleAddressChange(addressUpdate);
    
    // Atualizar os campos do formulário
    form.setValue('personalData.address.street', cepData.logradouro);
    form.setValue('personalData.address.neighborhood', cepData.bairro);
    form.setValue('personalData.address.city', cepData.localidade);
    form.setValue('personalData.address.state', cepData.uf);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">3A. Dados do Assinante (Pessoa Física)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="personalData.cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="999.999.999-99" 
                  placeholder="000.000.000-00" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ cpf: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.partnerNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Parceiro de Negócio *</FormLabel>
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

        <FormField
          control={form.control}
          name="personalData.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo do Titular *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite o nome completo" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ fullName: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento *</FormLabel>
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

        <FormField
          control={form.control}
          name="personalData.maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ maritalStatus: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite a profissão" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ profession: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="(99) 99999-9999" 
                  placeholder="(00) 00000-0000" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ phone: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalData.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ email: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Endereço Residencial */}
      <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <h4 className="text-md font-semibold text-green-900">Endereço Residencial</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="personalData.address.cep"
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
            name="personalData.address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
            name="personalData.address.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
            name="personalData.address.complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
            name="personalData.address.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
            name="personalData.address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
            name="personalData.address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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

      <FormField
        control={form.control}
        name="personalData.observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Observações adicionais" 
                onChange={(e) => {
                  field.onChange(e);
                  onUpdate({ observations: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ContactsSection
        contacts={data?.contacts || []}
        onAddContact={onAddContact}
        onRemoveContact={onRemoveContact}
        form={form}
        fieldPrefix="personalData"
      />
    </div>
  );
};

export default PersonalDataForm;
