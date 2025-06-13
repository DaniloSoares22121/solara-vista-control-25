
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import AddressForm from './AddressForm';
import { UserCheck, Phone, Mail, Info } from 'lucide-react';

interface GeneratorAdministratorFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorAdministratorForm = ({ form }: GeneratorAdministratorFormProps) => {
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
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-teal-600" />
          <p className="text-sm text-teal-700">
            Endereço do administrador (opcional - preencha apenas se diferente do endereço da empresa)
          </p>
        </div>
        <AddressForm 
          form={form} 
          prefix="administrator.address" 
          title="Endereço do Administrador (Opcional)"
        />
      </div>
    </div>
  );
};

export default GeneratorAdministratorForm;
