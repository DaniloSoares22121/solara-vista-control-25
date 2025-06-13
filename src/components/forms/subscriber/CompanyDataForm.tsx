import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CompanyData, AdministratorData, Address } from '@/types/subscriber';
import { CepInput } from '@/components/ui/cep-input';
import { CnpjInput } from '@/components/ui/cnpj-input';
import { CpfInput } from '@/components/ui/cpf-input';
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

  const handleCnpjFound = (cnpjData: any) => {
    console.log('📋 Dados do CNPJ encontrados:', cnpjData);
    
    // Preencher dados da empresa
    const companyUpdates: Partial<CompanyData> = {
      companyName: cnpjData.nome,
      fantasyName: cnpjData.fantasia || '',
      phone: cnpjData.telefone || '',
      email: cnpjData.email || '',
    };
    
    // Preencher endereço
    const addressUpdates: Partial<Address> = {
      cep: cnpjData.cep?.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2') || '',
      street: cnpjData.logradouro || '',
      number: cnpjData.numero || '',
      complement: cnpjData.complemento || '',
      neighborhood: cnpjData.bairro || '',
      city: cnpjData.municipio || '',
      state: cnpjData.uf || '',
    };
    
    // Atualizar dados da empresa
    onUpdateCompany({
      ...companyUpdates,
      address: { ...companyData?.address, ...addressUpdates }
    });
    
    // Atualizar campos do formulário
    setTimeout(() => {
      if (cnpjData.nome) form.setValue('companyData.companyName', cnpjData.nome);
      if (cnpjData.fantasia) form.setValue('companyData.fantasyName', cnpjData.fantasia);
      if (cnpjData.telefone) form.setValue('companyData.phone', cnpjData.telefone);
      if (cnpjData.email) form.setValue('companyData.email', cnpjData.email);
      
      // Endereço
      if (cnpjData.cep) form.setValue('companyData.address.cep', cnpjData.cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'));
      if (cnpjData.logradouro) form.setValue('companyData.address.street', cnpjData.logradouro);
      if (cnpjData.numero) form.setValue('companyData.address.number', cnpjData.numero);
      if (cnpjData.complemento) form.setValue('companyData.address.complement', cnpjData.complemento);
      if (cnpjData.bairro) form.setValue('companyData.address.neighborhood', cnpjData.bairro);
      if (cnpjData.municipio) form.setValue('companyData.address.city', cnpjData.municipio);
      if (cnpjData.uf) form.setValue('companyData.address.state', cnpjData.uf);
    }, 100);
  };

  const handleAdministratorCpfFound = (cpfData: any) => {
    console.log('📋 [COMPANY DATA] Dados do CPF do administrador encontrados:', cpfData);
    
    // Preenche os dados disponíveis do administrador
    if (cpfData.nome && cpfData.nome !== 'Nome será preenchido manualmente') {
      form.setValue('administratorData.fullName', cpfData.nome);
      onUpdateAdministrator({ fullName: cpfData.nome });
    }
    
    // Se a data de nascimento vier da API, também preenche
    if (cpfData.nascimento) {
      // Converte de DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = cpfData.nascimento.split('/');
      if (day && month && year) {
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        form.setValue('administratorData.birthDate', isoDate);
        onUpdateAdministrator({ birthDate: isoDate });
      }
    }
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

  const handleCompanyCepFound = (cepData: any) => {
    console.log('CEP encontrado para empresa:', cepData);
    const addressUpdate = {
      cep: cepData.cep,
      street: cepData.logradouro,
      neighborhood: cepData.bairro,
      city: cepData.localidade,
      state: cepData.uf,
    };
    
    handleCompanyAddressChange(addressUpdate);
    
    // Atualizar os campos do formulário
    setTimeout(() => {
      form.setValue('companyData.address.street', cepData.logradouro);
      form.setValue('companyData.address.neighborhood', cepData.bairro);
      form.setValue('companyData.address.city', cepData.localidade);
      form.setValue('companyData.address.state', cepData.uf);
    }, 100);
  };

  const handleAdministratorCepFound = (cepData: any) => {
    console.log('📍 [ADMIN CEP] CEP encontrado para administrador:', cepData);
    
    const addressUpdate = {
      cep: cepData.cep,
      street: cepData.logradouro,
      neighborhood: cepData.bairro,
      city: cepData.localidade,
      state: cepData.uf,
    };
    
    handleAdministratorAddressChange(addressUpdate);
    
    // Atualizar os campos do formulário do administrador
    setTimeout(() => {
      console.log('📍 [ADMIN CEP] Preenchendo campos do formulário...');
      form.setValue('administratorData.address.street', cepData.logradouro || '');
      form.setValue('administratorData.address.neighborhood', cepData.bairro || '');
      form.setValue('administratorData.address.city', cepData.localidade || '');
      form.setValue('administratorData.address.state', cepData.uf || '');
    }, 100);
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
                  <CnpjInput
                    value={getStringValue(companyData?.cnpj)}
                    onChange={(value) => {
                      field.onChange(value);
                      onUpdateCompany({ cnpj: value });
                    }}
                    onCnpjFound={handleCnpjFound}
                    placeholder="00.000.000/0000-00"
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
                    placeholder="Digite o número do parceiro" 
                    value={getStringValue(companyData?.partnerNumber)}
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
                    placeholder="Digite a razão social" 
                    value={getStringValue(companyData?.companyName)}
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
                    placeholder="Digite o nome fantasia" 
                    value={getStringValue(companyData?.fantasyName)}
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
                    mask="(99) 99999-9999" 
                    placeholder="(00) 00000-0000" 
                    value={getStringValue(companyData?.phone)}
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
                    type="email" 
                    placeholder="email@empresa.com" 
                    value={getStringValue(companyData?.email)}
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

        {/* Endereço da Empresa */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">📍</span>
            </div>
            Endereço da Empresa
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyData.address.cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <CepInput
                      value={field.value || ''}
                      onChange={(value) => {
                        field.onChange(value);
                        handleCompanyAddressChange({ cep: value });
                      }}
                      onCepFound={handleCompanyCepFound}
                      placeholder="00000-000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyData.address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o endereço" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyAddressChange({ street: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyData.address.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o número" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyAddressChange({ number: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyData.address.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Apto, bloco, etc." 
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyAddressChange({ complement: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyData.address.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o bairro" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyAddressChange({ neighborhood: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyData.address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite a cidade" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyAddressChange({ city: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyData.address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o estado" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleCompanyAddressChange({ state: e.target.value });
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
          name="companyData.observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais" 
                  value={getStringValue(companyData?.observations)}
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
                  <CpfInput
                    value={getStringValue(administratorData?.cpf)}
                    onChange={(value) => {
                      field.onChange(value);
                      onUpdateAdministrator({ cpf: value });
                    }}
                    onCpfFound={handleAdministratorCpfFound}
                    birthDate={form.getValues('administratorData.birthDate')}
                    placeholder="000.000.000-00"
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
                    placeholder="Digite o nome completo" 
                    value={getStringValue(administratorData?.fullName)}
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
                    type="date" 
                    value={getStringValue(administratorData?.birthDate)}
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
                    value={getStringValue(administratorData?.maritalStatus)} 
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
                    placeholder="Digite a profissão" 
                    value={getStringValue(administratorData?.profession)}
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
                    mask="(99) 99999-9999" 
                    placeholder="(00) 00000-0000" 
                    value={getStringValue(administratorData?.phone)}
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
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={getStringValue(administratorData?.email)}
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

        {/* Endereço do Administrador */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">📍</span>
            </div>
            Endereço Residencial do Administrador
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="administratorData.address.cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <CepInput
                      value={field.value || ''}
                      onChange={(value) => {
                        field.onChange(value);
                        handleAdministratorAddressChange({ cep: value });
                      }}
                      onCepFound={handleAdministratorCepFound}
                      placeholder="00000-000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administratorData.address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o endereço" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleAdministratorAddressChange({ street: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administratorData.address.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o número" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleAdministratorAddressChange({ number: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administratorData.address.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Apto, bloco, etc." 
                      onChange={(e) => {
                        field.onChange(e);
                        handleAdministratorAddressChange({ complement: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administratorData.address.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o bairro" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleAdministratorAddressChange({ neighborhood: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administratorData.address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite a cidade" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleAdministratorAddressChange({ city: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administratorData.address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <FormControl>
                    <Input 
                      value={field.value || ''}
                      placeholder="Digite o estado" 
                      onChange={(e) => {
                        field.onChange(e);
                        handleAdministratorAddressChange({ state: e.target.value });
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
    </div>
  );
};

export default CompanyDataForm;
