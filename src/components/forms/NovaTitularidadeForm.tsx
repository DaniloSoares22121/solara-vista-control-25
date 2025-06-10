
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface NovaTitularidadeFormProps {
  form: UseFormReturn<any>;
}

const NovaTitularidadeForm = ({ form }: NovaTitularidadeFormProps) => {
  const trocaConcluida = form.watch('energyAccount.newTitularity.trocaConcluida');

  return (
    <div className="space-y-6 border p-4 rounded-lg bg-blue-50">
      <h4 className="text-md font-semibold">Nova Titularidade da Conta de Energia</h4>
      
      <FormField
        control={form.control}
        name="energyAccount.newTitularity.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa na Nova Titularidade *</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="nova-fisica" />
                  <Label htmlFor="nova-fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="nova-juridica" />
                  <Label htmlFor="nova-juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="energyAccount.newTitularity.cpfCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF ou CNPJ na Nova Conta *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o CPF ou CNPJ" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="energyAccount.newTitularity.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da PF ou Empresa na Nova Conta *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('energyAccount.newTitularity.type') === 'fisica' && (
          <FormField
            control={form.control}
            name="energyAccount.newTitularity.dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="energyAccount.newTitularity.uc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UC - Unidade Consumidora</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Será a mesma da conta original" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="energyAccount.newTitularity.numeroParceiroUC"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Parceiro *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o número do parceiro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="energyAccount.newTitularity.trocaConcluida"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Troca de Titularidade Concluída</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {trocaConcluida && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="energyAccount.newTitularity.dataTroca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Troca</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.newTitularity.protocoloAnexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocolo de Troca de Titularidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NovaTitularidadeForm;
