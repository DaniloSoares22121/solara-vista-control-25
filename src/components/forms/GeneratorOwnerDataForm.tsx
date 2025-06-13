
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { User, Building, Phone, Mail, MapPin } from 'lucide-react';
import { CpfInput } from '@/components/ui/cpf-input';
import { CnpjInput } from '@/components/ui/cnpj-input';
import { CepInput } from '@/components/ui/cep-input';
import { MaskedInput } from '@/components/ui/masked-input';

interface GeneratorOwnerDataFormProps {
  form: UseFormReturn<GeneratorFormData>;
  ownerType: 'fisica' | 'juridica';
}

const GeneratorOwnerDataForm = ({ form, ownerType }: GeneratorOwnerDataFormProps) => {
  const handleCpfFound = (cpfData: any) => {
    console.log('📍 [GENERATOR CPF] CPF encontrado:', cpfData);
    
    if (cpfData) {
      // Preencher nome
      if (cpfData.nome && !form.getValues('owner.name')) {
        form.setValue('owner.name', cpfData.nome);
      }
      
      // Preencher data de nascimento (converter DD/MM/YYYY para YYYY-MM-DD)
      if (cpfData.nascimento && !form.getValues('owner.dataNascimento')) {
        const [day, month, year] = cpfData.nascimento.split('/');
        if (day && month && year) {
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          form.setValue('owner.dataNascimento', isoDate);
        }
      }
    }
  };

  const handleCnpjFound = (cnpjData: any) => {
    console.log('📍 [GENERATOR CNPJ] CNPJ encontrado:', cnpjData);
    
    if (cnpjData) {
      // Preencher razão social
      if (cnpjData.nome && !form.getValues('owner.razaoSocial')) {
        form.setValue('owner.razaoSocial', cnpjData.nome);
        // Se não tem nome fantasia, usar razão social como nome
        if (!form.getValues('owner.name')) {
          form.setValue('owner.name', cnpjData.nome);
        }
      }
      
      // Preencher nome fantasia
      if (cnpjData.fantasia && !form.getValues('owner.nomeFantasia')) {
        form.setValue('owner.nomeFantasia', cnpjData.fantasia);
        // Se tem fantasia, usar como nome principal
        if (!form.getValues('owner.name')) {
          form.setValue('owner.name', cnpjData.fantasia);
        }
      }
      
      // Preencher telefone
      if (cnpjData.telefone && !form.getValues('owner.telefone')) {
        form.setValue('owner.telefone', cnpjData.telefone);
      }
      
      // Preencher email
      if (cnpjData.email && !form.getValues('owner.email')) {
        form.setValue('owner.email', cnpjData.email);
      }
      
      // Preencher endereço
      if (cnpjData.cep && !form.getValues('owner.address.cep')) {
        form.setValue('owner.address.cep', cnpjData.cep);
        form.setValue('owner.address.endereco', cnpjData.logradouro || '');
        form.setValue('owner.address.numero', cnpjData.numero || '');
        form.setValue('owner.address.complemento', cnpjData.complemento || '');
        form.setValue('owner.address.bairro', cnpjData.bairro || '');
        form.setValue('owner.address.cidade', cnpjData.municipio || '');
        form.setValue('owner.address.estado', cnpjData.uf || '');
      }
    }
  };

  const handleCepFound = (cepData: any) => {
    console.log('📍 [GENERATOR CEP] CEP encontrado:', cepData);
    
    if (cepData && !cepData.erro) {
      // Preencher campos de endereço apenas se estiverem vazios
      if (!form.getValues('owner.address.endereco')) {
        form.setValue('owner.address.endereco', cepData.logradouro || '');
      }
      if (!form.getValues('owner.address.bairro')) {
        form.setValue('owner.address.bairro', cepData.bairro || '');
      }
      if (!form.getValues('owner.address.cidade')) {
        form.setValue('owner.address.cidade', cepData.localidade || '');
      }
      if (!form.getValues('owner.address.estado')) {
        form.setValue('owner.address.estado', cepData.uf || '');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Dados do Proprietário */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            {ownerType === 'fisica' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Building className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              {ownerType === 'fisica' ? 'Dados da Pessoa Física' : 'Dados da Pessoa Jurídica'}
            </h3>
            <p className="text-blue-600 text-sm">
              {ownerType === 'fisica' 
                ? 'Informações pessoais do proprietário' 
                : 'Informações da empresa proprietária'
              }
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ownerType === 'fisica' ? (
            <FormField
              control={form.control}
              name="owner.cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">CPF *</FormLabel>
                  <FormControl>
                    <CpfInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      onCpfFound={handleCpfFound}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="owner.cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">CNPJ *</FormLabel>
                  <FormControl>
                    <CnpjInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      onCnpjFound={handleCnpjFound}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="owner.numeroParceiroNegocio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Número Parceiro de Negócio *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 1234567" 
                    {...field} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  {ownerType === 'fisica' ? 'Nome Completo *' : 'Nome/Razão Social *'}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={ownerType === 'fisica' ? 'Nome completo' : 'Nome da empresa'} 
                    {...field} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {ownerType === 'fisica' ? (
            <FormField
              control={form.control}
              name="owner.dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="owner.razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Razão Social</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Razão social da empresa" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="owner.nomeFantasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Nome Fantasia</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome fantasia" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="owner.telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Telefone *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <MaskedInput 
                      {...field} 
                      mask="(99) 99999-9999"
                      placeholder="(00) 00000-0000"
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">E-mail *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field} 
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-green-900 text-lg">Endereço do Proprietário</h4>
            <p className="text-sm text-green-700 mt-1">
              Endereço principal para correspondências
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="owner.address.cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">CEP *</FormLabel>
                <FormControl>
                  <CepInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    onCepFound={handleCepFound}
                    placeholder="00000-000"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.address.endereco"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-semibold text-gray-700">Endereço *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Rua, Avenida, etc." 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.address.numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Número *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.address.complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Complemento</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Apto, Sala, etc." 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.address.bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Bairro *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome do bairro" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.address.cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome da cidade" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.address.estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Estado *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="UF" 
                    maxLength={2} 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Observações */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <FormField
          control={form.control}
          name="owner.observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre o proprietário..."
                  className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GeneratorOwnerDataForm;
