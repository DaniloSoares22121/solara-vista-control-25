import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PersonalData, Address } from '@/types/subscriber';
import { CepInput } from '@/components/ui/cep-input';
import { CpfInput } from '@/components/ui/cpf-input';
import ContactsSection from './ContactsSection';
import { useCepLookup } from '@/hooks/useCepLookup';

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
  const { lookupCep, loading } = useCepLookup();

  const handleCpfFound = (cpfData: any) => {
    console.log('📋 [PERSONAL DATA] Dados do CPF encontrados:', cpfData);
    
    // Por enquanto, apenas logamos os dados
    // Em produção com API real, preencheria os dados disponíveis
    if (cpfData.nome && cpfData.nome !== 'Nome será preenchido manualmente') {
      form.setValue('personalData.fullName', cpfData.nome);
      onUpdate({ fullName: cpfData.nome });
    }
  };

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

  const handleCepChange = async (cep: string) => {
    console.log('🔍 [PERSONAL DATA] CEP alterado:', cep);
    
    // Atualizar o CEP no formulário
    form.setValue('personalData.address.cep', cep);
    handleAddressChange({ cep });
    
    // Se o CEP está completo, fazer a busca
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const cepData = await lookupCep(cleanCep);
        console.log('📍 [PERSONAL DATA] Dados do CEP encontrados:', cepData);
        
        if (cepData) {
          const addressUpdate = {
            cep: cepData.cep,
            street: cepData.logradouro,
            neighborhood: cepData.bairro,
            city: cepData.localidade,
            state: cepData.uf,
          };
          
          // Atualizar no formulário
          form.setValue('personalData.address.street', cepData.logradouro);
          form.setValue('personalData.address.neighborhood', cepData.bairro);
          form.setValue('personalData.address.city', cepData.localidade);
          form.setValue('personalData.address.state', cepData.uf);
          
          // Atualizar nos dados
          handleAddressChange(addressUpdate);
          
          console.log('✅ [PERSONAL DATA] Endereço preenchido automaticamente');
        }
      } catch (error) {
        console.error('❌ [PERSONAL DATA] Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">3</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Dados do Assinante (Pessoa Física)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="personalData.cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <CpfInput
                  value={field.value || ''}
                  onChange={(value) => {
                    field.onChange(value);
                    onUpdate({ cpf: value });
                  }}
                  onCpfFound={handleCpfFound}
                  placeholder="000.000.000-00"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  value={field.value || ''}
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
                  value={field.value || ''}
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
                  value={field.value || ''}
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
                  value={field.value || ''} 
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
                  value={field.value || ''}
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
                  value={field.value || ''}
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
                  value={field.value || ''}
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
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">📍</span>
          </div>
          Endereço Residencial
        </h4>
        
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
                    onChange={handleCepChange}
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
            name="personalData.address.number"
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
            name="personalData.address.complement"
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
            name="personalData.address.neighborhood"
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
            name="personalData.address.city"
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
            name="personalData.address.state"
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

      <FormField
        control={form.control}
        name="personalData.observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                value={field.value || ''}
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
