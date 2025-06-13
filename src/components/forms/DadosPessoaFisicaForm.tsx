import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CpfInput } from '@/components/ui/cpf-input';
import AddressForm from './AddressForm';

interface DadosPessoaFisicaFormProps {
  form: UseFormReturn<any>;
}

const DadosPessoaFisicaForm = ({ form }: DadosPessoaFisicaFormProps) => {
  const handleCpfFound = (cpfData: any) => {
    console.log('📋 [GENERATOR PF] Dados do CPF encontrados:', cpfData);
    
    // Por enquanto, apenas logamos os dados
    // Em produção com API real, preencheria os dados disponíveis
    if (cpfData.nome && cpfData.nome !== 'Nome será preenchido manualmente') {
      form.setValue('name', cpfData.nome);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">3A. Dados do Assinante (Pessoa Física)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cpfCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <CpfInput
                  value={field.value || ''}
                  onChange={field.onChange}
                  onCpfFound={handleCpfFound}
                  placeholder="000.000.000-00"
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo do Titular *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome completo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento *</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estadoCivil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profissao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite a profissão" />
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail *</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="email@exemplo.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AddressForm form={form} prefix="address" title="Endereço Residencial" />

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
    </div>
  );
};

export default DadosPessoaFisicaForm;
