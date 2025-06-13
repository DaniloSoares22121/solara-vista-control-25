
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { UserCheck, Phone, Mail, Info, MapPin } from 'lucide-react';
import { CepInput } from '@/components/ui/cep-input';

interface GeneratorAdministratorFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorAdministratorForm = ({ form }: GeneratorAdministratorFormProps) => {
  const handleAdministratorCepFound = (cepData: any) => {
    console.log('📍 [ADMIN CEP] CEP encontrado para administrador:', cepData);
    
    if (cepData && !cepData.erro) {
      // Atualizar os campos do formulário do administrador
      setTimeout(() => {
        console.log('📍 [ADMIN CEP] Preenchendo campos do formulário...');
        form.setValue('administrator.address.endereco', cepData.logradouro || '');
        form.setValue('administrator.address.bairro', cepData.bairro || '');
        form.setValue('administrator.address.cidade', cepData.localidade || '');
        form.setValue('administrator.address.estado', cepData.uf || '');
      }, 100);
    }
  };

  return (
    <div className="space-y-8">
      {/* Aviso sobre campos opcionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Informação Importante</h4>
          <p className="text-sm text-blue-700 mt-1">
            Os dados do administrador são <strong>opcionais</strong> para Pessoa Jurídica. 
            Preencha apenas se necessário ou exigido pela concessionária.
          </p>
        </div>
      </div>

      {/* Dados do Administrador */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-900">Administrador da Pessoa Jurídica (Opcional)</h3>
            <p className="text-indigo-600 text-sm">Dados do responsável legal pela empresa (se aplicável)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="administrator.cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">CPF do Administrador</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
                    className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Nome do Administrador</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome completo" 
                    {...field} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Data de Nascimento</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="99/99/9999"
                    placeholder="DD/MM/AAAA"
                    className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Telefone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <MaskedInput 
                      {...field} 
                      mask="(99) 99999-9999"
                      placeholder="(00) 00000-0000"
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">E-mail</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field} 
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Endereço do Administrador */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-teal-900 text-lg">Endereço Residencial do Administrador (Opcional)</h4>
            <p className="text-sm text-teal-700 mt-1">
              Preencha apenas se diferente do endereço da empresa
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="administrator.address.cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">CEP</FormLabel>
                <FormControl>
                  <CepInput
                    value={field.value || ''}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    onCepFound={handleAdministratorCepFound}
                    placeholder="00000-000"
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.address.endereco"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-semibold text-gray-700">Endereço</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Rua, Avenida, etc." 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.address.numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Número</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.address.complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Complemento</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Apto, Sala, etc." 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.address.bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Bairro</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome do bairro" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.address.cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Cidade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome da cidade" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administrator.address.estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Estado</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="UF" 
                    maxLength={2} 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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

export default GeneratorAdministratorForm;
