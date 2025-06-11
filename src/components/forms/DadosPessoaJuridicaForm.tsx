
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { AdministratorData } from '@/types/subscriber';
import AddressForm from './AddressForm';
import ContactsForm from './ContactsForm';
import DadosAdministradorForm from './DadosAdministradorForm';

interface DadosPessoaJuridicaFormProps {
  form: UseFormReturn<any>;
  contacts: any[];
  onContactsChange: (contacts: any[]) => void;
  administrator?: AdministratorData;
  onAdministratorChange: (administrator: AdministratorData | undefined) => void;
}

const DadosPessoaJuridicaForm = ({ 
  form, 
  contacts, 
  onContactsChange, 
  administrator,
  onAdministratorChange 
}: DadosPessoaJuridicaFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">3B. Dados do Assinante (Pessoa Jurídica)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cpfCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask="99.999.999/9999-99" 
                  placeholder="00.000.000/0000-00" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroParceiroNegocio"
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
          name="razaoSocial"
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
          name="nomeFantasia"
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
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone da empresa *</FormLabel>
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
          name="email"
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

      <AddressForm form={form} prefix="address" title="Endereço da Empresa" />

      <FormField
        control={form.control}
        name="observacoes"
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

      <DadosAdministradorForm 
        administrator={administrator} 
        onChange={onAdministratorChange} 
      />
    </div>
  );
};

export default DadosPessoaJuridicaForm;
