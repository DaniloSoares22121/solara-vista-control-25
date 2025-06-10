
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import AddressForm from './AddressForm';

interface GeneratorAdministratorFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorAdministratorForm = ({ form }: GeneratorAdministratorFormProps) => {
  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Dados do Administrador da Pessoa Jurídica</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="administrator.cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF do Administrador *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
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
                <FormLabel>Nome do Administrador *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
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
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="99/99/9999"
                    placeholder="DD/MM/AAAA"
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
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                  />
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
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <AddressForm 
            form={form} 
            prefix="administrator.address" 
            title="Endereço do Administrador"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratorAdministratorForm;
