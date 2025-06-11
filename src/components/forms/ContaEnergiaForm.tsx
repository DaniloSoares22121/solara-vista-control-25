
import React, { useEffect, useRef, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
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
  
  const hasAutoFilledRef = useRef(false);
  const realizarTroca = form.watch('energyAccount.realizarTrocaTitularidade');
  const tipoContaOriginal = form.watch('energyAccount.originalAccount.type');
  
  // Função para preencher automaticamente com dados do assinante
  const preencherComDadosAssinante = useCallback(() => {
    if (!subscriberData) {
      console.log('Nenhum dado do assinante disponível');
      return;
    }

    console.log('Preenchendo conta de energia com dados do assinante...');
    
    // Preencher tipo da conta
    if (subscriberData.type) {
      form.setValue('energyAccount.originalAccount.type', subscriberData.type, { shouldValidate: true });
    }

    // Preencher CPF/CNPJ
    if (subscriberData.cpfCnpj) {
      form.setValue('energyAccount.originalAccount.cpfCnpj', subscriberData.cpfCnpj, { shouldValidate: true });
    }

    // Preencher nome/razão social
    const name = subscriberData.type === 'fisica' 
      ? subscriberData.name 
      : subscriberData.razaoSocial || subscriberData.name;
    if (name) {
      form.setValue('energyAccount.originalAccount.name', name, { shouldValidate: true });
    }

    // Preencher data de nascimento para pessoa física
    if (subscriberData.type === 'fisica' && subscriberData.dataNascimento) {
      form.setValue('energyAccount.originalAccount.dataNascimento', subscriberData.dataNascimento, { shouldValidate: true });
    }

    // Preencher número do parceiro
    if (subscriberData.numeroParceiroNegocio) {
      form.setValue('energyAccount.originalAccount.numeroParceiroUC', subscriberData.numeroParceiroNegocio, { shouldValidate: true });
    }

    // Preencher endereço completo
    if (subscriberData.address) {
      const address = subscriberData.address;
      
      if (address.cep) {
        form.setValue('energyAccount.originalAccount.address.cep', address.cep, { shouldValidate: true });
      }
      if (address.endereco) {
        form.setValue('energyAccount.originalAccount.address.endereco', address.endereco, { shouldValidate: true });
      }
      if (address.numero) {
        form.setValue('energyAccount.originalAccount.address.numero', address.numero, { shouldValidate: true });
      }
      if (address.complemento) {
        form.setValue('energyAccount.originalAccount.address.complemento', address.complemento, { shouldValidate: true });
      }
      if (address.bairro) {
        form.setValue('energyAccount.originalAccount.address.bairro', address.bairro, { shouldValidate: true });
      }
      if (address.cidade) {
        form.setValue('energyAccount.originalAccount.address.cidade', address.cidade, { shouldValidate: true });
      }
      if (address.estado) {
        form.setValue('energyAccount.originalAccount.address.estado', address.estado, { shouldValidate: true });
      }
    }
  }, [subscriberData, form]);

  // Preencher automaticamente assim que o componente monta e tem dados do assinante
  useEffect(() => {
    if (subscriberData && !hasAutoFilledRef.current) {
      console.log('Auto-preenchendo na montagem do componente...');
      hasAutoFilledRef.current = true;
      // Usar setTimeout para garantir que o DOM está pronto
      setTimeout(() => {
        preencherComDadosAssinante();
      }, 100);
    }
  }, [subscriberData, preencherComDadosAssinante]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Adicionar Conta de Energia UC</h3>
        {subscriberData && (
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={preencherComDadosAssinante}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Preencher com dados do assinante
          </Button>
        )}
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
                  {tipoContaOriginal === 'fisica' ? 'Nome da PF' : 'Nome da Empresa'} na Conta de Energia *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={tipoContaOriginal === 'fisica' ? 'Digite o nome' : 'Digite o nome da empresa'} 
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

        <div className="space-y-4">
          <h5 className="text-sm font-medium">Endereço da Conta de Energia</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <MaskedInput {...field} mask="99999-999" placeholder="00000-000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o endereço" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o número" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o complemento" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o bairro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite a cidade" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energyAccount.originalAccount.address.estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o estado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="energyAccount.realizarTrocaTitularidade"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <FormLabel className="text-base font-medium">Realizará Troca de Titularidade?</FormLabel>
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
