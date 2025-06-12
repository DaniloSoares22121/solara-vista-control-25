
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CompanyData, AdministratorData, Address } from '@/types/subscriber';
import AddressForm from '../AddressForm';
import ContactsSection from './ContactsSection';

interface CompanyDataFormProps {
  companyData?: CompanyData;
  administratorData?: AdministratorData;
  onUpdateCompany: (data: Partial<CompanyData>) => void;
  onUpdateAdministrator: (data: Partial<AdministratorData>) => void;
  onCepLookup: (cep: string, type: 'company' | 'administrator') => void;
  onAddContact: () => void;
  onRemoveContact: (contactId: string) => void;
  form: UseFormReturn<any>;
}

const CompanyDataForm = ({
  companyData,
  administratorData,
  onUpdateCompany,
  onUpdateAdministrator,
  onCepLookup,
  onAddContact,
  onRemoveContact,
  form
}: CompanyDataFormProps) => {
  
  // Helper function to safely get string value
  const getStringValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return '';
    return String(value);
  };

  const handleCompanyAddressChange = (addressUpdate: Partial<Address>) => {
    const currentAddress = companyData?.address || {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };
    
    const newAddress: Address = { ...currentAddress, ...addressUpdate };
    onUpdateCompany({ address: newAddress });
  };

  const handleAdministratorAddressChange = (addressUpdate: Partial<Address>) => {
    const currentAddress = administratorData?.address || {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };
    
    const newAddress: Address = { ...currentAddress, ...addressUpdate };
    onUpdateAdministrator({ address: newAddress });
  };

  return (
    <div className="space-y-8">
      {/* Dados da Empresa */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">3B. Dados do Assinante (Pessoa Jurídica)</h3>
        <h4 className="text-md font-medium text-gray-700">Dados da Empresa</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyData.cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="99.999.999/9999-99" 
                    placeholder="00.000.000/0000-00" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateCompany({ cnpj: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyData.partnerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número Parceiro de Negócio *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o número do parceiro" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateCompany({ partnerNumber: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyData.companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite a razão social" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateCompany({ companyName: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyData.fantasyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o nome fantasia" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateCompany({ fantasyName: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyData.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone da Empresa *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="(99) 99999-9999" 
                    placeholder="(00) 00000-0000" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateCompany({ phone: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyData.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="email@empresa.com" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateCompany({ email: e.target.value });
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
          prefix="companyData.address" 
          title="Endereço da Empresa"
          onCepChange={(cep) => onCepLookup(cep, 'company')}
          onAddressChange={handleCompanyAddressChange}
        />

        <FormField
          control={form.control}
          name="companyData.observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Observações adicionais" 
                  value={getStringValue(field.value)}
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdateCompany({ observations: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ContactsSection
          contacts={companyData?.contacts || []}
          onAddContact={onAddContact}
          onRemoveContact={onRemoveContact}
          form={form}
          fieldPrefix="companyData"
        />
      </div>

      {/* Dados do Administrador */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-700">Dados do Administrador</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="administratorData.cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF do Administrador *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="999.999.999-99" 
                    placeholder="000.000.000-00" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateAdministrator({ cpf: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administratorData.fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Administrador *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o nome completo" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateAdministrator({ fullName: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administratorData.birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="date" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateAdministrator({ birthDate: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administratorData.maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado Civil *</FormLabel>
                <FormControl>
                  <Select 
                    value={getStringValue(field.value)} 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onUpdateAdministrator({ maritalStatus: value });
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
            name="administratorData.profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissão *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite a profissão" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateAdministrator({ profession: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administratorData.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="(99) 99999-9999" 
                    placeholder="(00) 00000-0000" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateAdministrator({ phone: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administratorData.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={getStringValue(field.value)}
                    onChange={(e) => {
                      field.onChange(e);
                      onUpdateAdministrator({ email: e.target.value });
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
          prefix="administratorData.address" 
          title="Endereço Residencial do Administrador"
          onCepChange={(cep) => onCepLookup(cep, 'administrator')}
          onAddressChange={handleAdministratorAddressChange}
        />
      </div>
    </div>
  );
};

export default CompanyDataForm;
