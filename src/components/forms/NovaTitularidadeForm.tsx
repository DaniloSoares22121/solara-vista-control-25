
import React from 'react';
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
  const ucOriginal = form.watch('energyAccount.originalAccount.uc');

  console.log('NovaTitularidadeForm - tipoNovaTitularidade:', tipoNovaTitularidade);
  console.log('NovaTitularidadeForm - trocaConcluida:', trocaConcluida);

  // Auto-preencher UC com o valor da conta original
  React.useEffect(() => {
    if (ucOriginal) {
      form.setValue('energyAccount.newTitularity.uc', ucOriginal);
    }
  }, [ucOriginal, form]);

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
                {tipoNovaTitularidade === 'fisica' ? 'CPF' : 'CNPJ'} na Conta de Energia *
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
                {tipoNovaTitularidade === 'fisica' ? 'Nome da PF' : 'Nome da Empresa'} na Conta de Energia *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={tipoNovaTitularidade === 'fisica' ? 'Digite o nome' : 'Digite o nome da empresa'} 
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
                <FormLabel>Data de Nascimento na Conta de Energia</FormLabel>
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
                  placeholder="Puxado da conta original" 
                  disabled
                  className="bg-gray-100"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">UC será o mesmo da conta original</p>
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

      <FormField
        control={form.control}
        name="energyAccount.newTitularity.trocaConcluida"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <FormLabel className="text-base font-medium">Troca de Titularidade Concluída?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            <p className="text-xs text-gray-500 ml-4">
              Deixe desmarcado inicialmente. Após concluir a troca na distribuidora, volte aqui e marque como concluída.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {trocaConcluida && (
        <div className="space-y-4 p-4 border rounded-lg bg-green-50">
          <h5 className="text-sm font-semibold text-green-800">Informações da Troca Concluída</h5>
          
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
                  <p className="text-xs text-gray-500">Anexe o protocolo da distribuidora (PDF, JPG, JPEG, PNG)</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NovaTitularidadeForm;
