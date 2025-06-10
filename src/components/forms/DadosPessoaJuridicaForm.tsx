
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import AddressForm from './AddressForm';
import ContactsForm from './ContactsForm';
import DadosAdministradorForm from './DadosAdministradorForm';

interface DadosPessoaJuridicaFormProps {
  form: UseFormReturn<any>;
  contacts: any[];
  onContactsChange: (contacts: any[]) => void;
}

const DadosPessoaJuridicaForm = ({ form, contacts, onContactsChange }: DadosPessoaJuridicaFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">3B. Dados do Assinante (Pessoa Jurídica)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="subscriber.cpfCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="00.000.000/0000-00" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriber.numeroParceiroNegocio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Parceiro de Negócio *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o número do parceiro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriber.razaoSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite a razão social" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriber.nomeFantasia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Fantasia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome fantasia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriber.telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone da empresa *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="(00) 00000-0000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriber.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail *</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="email@empresa.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AddressForm form={form} prefix="subscriber.address" title="Endereço da Empresa" />

      <FormField
        control={form.control}
        name="subscriber.observacoes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Observações adicionais" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ContactsForm contacts={contacts} onChange={onContactsChange} />

      <DadosAdministradorForm form={form} />
    </div>
  );
};

export default DadosPessoaJuridicaForm;
