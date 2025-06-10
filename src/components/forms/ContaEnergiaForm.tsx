
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import AddressForm from './AddressForm';
import NovaTitularidadeForm from './NovaTitularidadeForm';

interface ContaEnergiaFormProps {
  form: UseFormReturn<any>;
}

const ContaEnergiaForm = ({ form }: ContaEnergiaFormProps) => {
  const realizarTroca = form.watch('energyAccount.realizarTrocaTitularidade');
  const tipoContaOriginal = form.watch('energyAccount.originalAccount.type');
  
  // Dados do assinante para pré-preenchimento
  const tipoAssinante = form.watch('subscriber.type');
  const cpfCnpjAssinante = form.watch('subscriber.cpfCnpj');
  const nomeAssinante = form.watch('subscriber.name');
  const razaoSocialAssinante = form.watch('subscriber.razaoSocial');
  const dataNascimentoAssinante = form.watch('subscriber.dataNascimento');
  const numeroParceiroAssinante = form.watch('subscriber.numeroParceiroNegocio');

  // Pré-preencher dados automaticamente quando o tipo da conta mudar
  useEffect(() => {
    if (tipoContaOriginal && tipoAssinante) {
      // Definir o tipo da conta igual ao tipo do assinante por padrão
      if (!form.getValues('energyAccount.originalAccount.type')) {
        form.setValue('energyAccount.originalAccount.type', tipoAssinante);
      }
      
      // Pré-preencher CPF/CNPJ
      if (cpfCnpjAssinante && !form.getValues('energyAccount.originalAccount.cpfCnpj')) {
        form.setValue('energyAccount.originalAccount.cpfCnpj', cpfCnpjAssinante);
      }
      
      // Pré-preencher nome
      const nomeParaPreencher = tipoAssinante === 'fisica' ? nomeAssinante : razaoSocialAssinante;
      if (nomeParaPreencher && !form.getValues('energyAccount.originalAccount.name')) {
        form.setValue('energyAccount.originalAccount.name', nomeParaPreencher);
      }
      
      // Pré-preencher data de nascimento (apenas para PF)
      if (tipoAssinante === 'fisica' && dataNascimentoAssinante && !form.getValues('energyAccount.originalAccount.dataNascimento')) {
        form.setValue('energyAccount.originalAccount.dataNascimento', dataNascimentoAssinante);
      }
      
      // Pré-preencher número do parceiro
      if (numeroParceiroAssinante && !form.getValues('energyAccount.originalAccount.numeroParceiroUC')) {
        form.setValue('energyAccount.originalAccount.numeroParceiroUC', numeroParceiroAssinante);
      }
    }
  }, [tipoContaOriginal, tipoAssinante, cpfCnpjAssinante, nomeAssinante, razaoSocialAssinante, dataNascimentoAssinante, numeroParceiroAssinante, form]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">4. Adicionar Conta de Energia UC</h3>
      
      <div className="space-y-6 border p-4 rounded-lg">
        <h4 className="text-md font-semibold">Cadastro Original da Conta de Energia</h4>
        
        <FormField
          control={form.control}
          name="energyAccount.originalAccount.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Pessoa na Conta *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fisica" id="conta-fisica" />
                    <Label htmlFor="conta-fisica">Pessoa Física</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="juridica" id="conta-juridica" />
                    <Label htmlFor="conta-juridica">Pessoa Jurídica</Label>
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
            name="energyAccount.originalAccount.cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {tipoContaOriginal === 'fisica' ? 'CPF' : 'CNPJ'} na Conta de Energia *
                </FormLabel>
                <FormControl>
                  {tipoContaOriginal === 'fisica' ? (
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
            name="energyAccount.originalAccount.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {tipoContaOriginal === 'fisica' ? 'Nome da Pessoa Física' : 'Razão Social'} na Conta *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={tipoContaOriginal === 'fisica' ? 'Digite o nome' : 'Digite a razão social'} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {tipoContaOriginal === 'fisica' && (
            <FormField
              control={form.control}
              name="energyAccount.originalAccount.dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento na conta de Energia</FormLabel>
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
            name="energyAccount.originalAccount.uc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UC - Unidade Consumidora *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite a UC" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyAccount.originalAccount.numeroParceiroUC"
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

        <AddressForm form={form} prefix="energyAccount.originalAccount.address" title="Endereço da Conta de Energia" />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="energyAccount.realizarTrocaTitularidade"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Realizará Troca de Titularidade?</FormLabel>
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

        {realizarTroca && (
          <NovaTitularidadeForm form={form} />
        )}
      </div>
    </div>
  );
};

export default ContaEnergiaForm;
