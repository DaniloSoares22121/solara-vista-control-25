
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import AddressForm from './AddressForm';
import NovaTitularidadeForm from './NovaTitularidadeForm';

interface ContaEnergiaFormProps {
  form: UseFormReturn<any>;
  subscriberData?: any;
}

const ContaEnergiaForm = ({ form, subscriberData }: ContaEnergiaFormProps) => {
  console.log('ContaEnergiaForm rendering...');
  console.log('ContaEnergiaForm - subscriberData recebido:', subscriberData);
  
  const realizarTroca = form.watch('energyAccount.realizarTrocaTitularidade');
  const tipoContaOriginal = form.watch('energyAccount.originalAccount.type');
  
  // Auto-preencher dados apenas uma vez quando subscriberData estiver disponível
  useEffect(() => {
    if (subscriberData && subscriberData.name && subscriberData.cpfCnpj) {
      console.log('Auto-preenchendo dados da conta de energia com subscriberData...');
      
      // Verificar se os dados já estão preenchidos para evitar loop
      const currentCpf = form.getValues('energyAccount.originalAccount.cpfCnpj');
      const currentName = form.getValues('energyAccount.originalAccount.name');
      
      if (!currentCpf || currentCpf !== subscriberData.cpfCnpj) {
        // Auto-preencher tipo da conta
        if (subscriberData.type) {
          console.log('Preenchendo tipo:', subscriberData.type);
          form.setValue('energyAccount.originalAccount.type', subscriberData.type);
        }

        // Auto-preencher CPF/CNPJ
        if (subscriberData.cpfCnpj) {
          console.log('Preenchendo CPF/CNPJ:', subscriberData.cpfCnpj);
          form.setValue('energyAccount.originalAccount.cpfCnpj', subscriberData.cpfCnpj);
        }

        // Auto-preencher nome/razão social
        const name = subscriberData.type === 'fisica' 
          ? subscriberData.name 
          : subscriberData.razaoSocial;
        if (name) {
          console.log('Preenchendo nome:', name);
          form.setValue('energyAccount.originalAccount.name', name);
        }

        // Auto-preencher data de nascimento para pessoa física
        if (subscriberData.type === 'fisica' && subscriberData.dataNascimento) {
          console.log('Preenchendo data nascimento:', subscriberData.dataNascimento);
          form.setValue('energyAccount.originalAccount.dataNascimento', subscriberData.dataNascimento);
        }

        // Auto-preencher número do parceiro
        if (subscriberData.numeroParceiroNegocio) {
          console.log('Preenchendo número parceiro:', subscriberData.numeroParceiroNegocio);
          form.setValue('energyAccount.originalAccount.numeroParceiroUC', subscriberData.numeroParceiroNegocio);
        }

        // Auto-preencher endereço apenas se ainda não foi preenchido
        const currentCep = form.getValues('energyAccount.originalAccount.address.cep');
        if (subscriberData.address && (!currentCep || currentCep === '')) {
          console.log('Preenchendo endereço:', subscriberData.address);
          form.setValue('energyAccount.originalAccount.address.cep', subscriberData.address.cep || '');
          form.setValue('energyAccount.originalAccount.address.endereco', subscriberData.address.endereco || '');
          form.setValue('energyAccount.originalAccount.address.numero', subscriberData.address.numero || '');
          form.setValue('energyAccount.originalAccount.address.complemento', subscriberData.address.complemento || '');
          form.setValue('energyAccount.originalAccount.address.bairro', subscriberData.address.bairro || '');
          form.setValue('energyAccount.originalAccount.address.cidade', subscriberData.address.cidade || '');
          form.setValue('energyAccount.originalAccount.address.estado', subscriberData.address.estado || '');
        }
      }
    }
  }, [subscriberData?.cpfCnpj, subscriberData?.name]); // Dependências específicas para evitar loop

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Adicionar Conta de Energia UC</h3>
      </div>
      
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
