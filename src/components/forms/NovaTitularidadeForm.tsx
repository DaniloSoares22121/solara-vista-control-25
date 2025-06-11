
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface NovaTitularidadeFormProps {
  form: UseFormReturn<any>;
}

const NovaTitularidadeForm = ({ form }: NovaTitularidadeFormProps) => {
  const tipoNovaTitularidade = form.watch('energyAccount.newTitularity.type');
  const trocaConcluida = form.watch('energyAccount.newTitularity.trocaConcluida');

  return (
    <div className="space-y-6 border p-4 rounded-lg bg-blue-50">
      <h4 className="text-md font-semibold text-blue-800">Nova Titularidade da Conta de Energia</h4>
      
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
              <FormLabel>
                {tipoNovaTitularidade === 'fisica' ? 'CPF' : 'CNPJ'} da Nova Titularidade *
              </FormLabel>
              <FormControl>
                {tipoNovaTitularidade === 'fisica' ? (
                  <MaskedInput 
                    {...field} 
                    mask="999.999.999-99" 
                    placeholder="000.000.000-00" 
                  />
                ) : (
                  <MaskedInput 
                    {...field} 
                    mask="99.999.999/9999-99" 
                    placeholder="00.000.000/0000-00" 
                  />
                )}
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
              <FormLabel>
                {tipoNovaTitularidade === 'fisica' ? 'Nome da Pessoa Física' : 'Razão Social'} da Nova Titularidade *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={tipoNovaTitularidade === 'fisica' ? 'Digite o nome' : 'Digite a razão social'} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {tipoNovaTitularidade === 'fisica' && (
          <FormField
            control={form.control}
            name="energyAccount.newTitularity.dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento da Nova Titularidade</FormLabel>
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
                <Input 
                  {...field} 
                  placeholder="Mesmo UC da conta original" 
                  value={form.watch('energyAccount.originalAccount.uc')}
                  disabled
                />
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
              <FormLabel>Número do Parceiro da Nova Titularidade *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o número do parceiro" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="energyAccount.newTitularity.trocaConcluida"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Troca de Titularidade Concluída?</FormLabel>
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
                <FormLabel>Data da Troca de Titularidade *</FormLabel>
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
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Protocolo de Troca de Titularidade</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default NovaTitularidadeForm;
