
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
  const isFillingRef = useRef(false);
  const clickCountRef = useRef(0);
  const realizarTroca = form.watch('energyAccount.realizarTrocaTitularidade');
  const tipoContaOriginal = form.watch('energyAccount.originalAccount.type');
  
  // Função para preencher automaticamente com dados do assinante
  const preencherComDadosAssinante = useCallback(() => {
    if (!subscriberData || isFillingRef.current) {
      console.log('Nenhum dado do assinante disponível ou já preenchendo');
      return;
    }

    console.log(`Preenchendo conta de energia com dados do assinante... (click ${clickCountRef.current + 1})`);
    isFillingRef.current = true;
    
    // Usar batch para definir todos os valores de uma vez
    const updates = {};
    
    // Preparar todos os valores
    if (subscriberData.type) {
      updates['energyAccount.originalAccount.type'] = subscriberData.type;
    }

    if (subscriberData.cpfCnpj) {
      updates['energyAccount.originalAccount.cpfCnpj'] = subscriberData.cpfCnpj;
    }

    const name = subscriberData.type === 'fisica' 
      ? subscriberData.name 
      : subscriberData.razaoSocial || subscriberData.name;
    if (name) {
      updates['energyAccount.originalAccount.name'] = name;
    }

    if (subscriberData.type === 'fisica' && subscriberData.dataNascimento) {
      updates['energyAccount.originalAccount.dataNascimento'] = subscriberData.dataNascimento;
    }

    if (subscriberData.numeroParceiroNegocio) {
      updates['energyAccount.originalAccount.numeroParceiroUC'] = subscriberData.numeroParceiroNegocio;
    }

    // Preencher endereço completo
    if (subscriberData.address) {
      const address = subscriberData.address;
      
      if (address.cep) {
        updates['energyAccount.originalAccount.address.cep'] = address.cep;
      }
      if (address.endereco) {
        updates['energyAccount.originalAccount.address.endereco'] = address.endereco;
      }
      if (address.numero) {
        updates['energyAccount.originalAccount.address.numero'] = address.numero;
      }
      if (address.complemento) {
        updates['energyAccount.originalAccount.address.complemento'] = address.complemento;
      }
      if (address.bairro) {
        updates['energyAccount.originalAccount.address.bairro'] = address.bairro;
      }
      if (address.cidade) {
        updates['energyAccount.originalAccount.address.cidade'] = address.cidade;
      }
      if (address.estado) {
        updates['energyAccount.originalAccount.address.estado'] = address.estado;
      }
    }

    // Aplicar todos os valores de uma vez
    Object.entries(updates).forEach(([path, value]) => {
      form.setValue(path as any, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    });

    // Validar tudo de uma vez no final
    setTimeout(() => {
      form.trigger();
      isFillingRef.current = false;
      clickCountRef.current++;
      
      // Se ainda não completou 5 cliques, continuar
      if (clickCountRef.current < 5) {
        setTimeout(() => {
          preencherComDadosAssinante();
        }, 500);
      }
    }, 300);
  }, [subscriberData, form]);

  // Automação para clicar 5 vezes automaticamente
  const executarAutomacao = useCallback(() => {
    if (!subscriberData || hasAutoFilledRef.current) {
      return;
    }
    
    console.log('Iniciando automação de 5 cliques...');
    hasAutoFilledRef.current = true;
    clickCountRef.current = 0;
    
    // Aguardar um momento e começar a automação
    setTimeout(() => {
      preencherComDadosAssinante();
    }, 1000);
  }, [subscriberData, preencherComDadosAssinante]);

  // Preencher automaticamente assim que o componente monta e tem dados do assinante
  useEffect(() => {
    if (subscriberData && !hasAutoFilledRef.current) {
      console.log('Auto-preenchendo na montagem do componente com automação...');
      executarAutomacao();
    }
  }, [subscriberData, executarAutomacao]);

  // Função manual do botão (reinicia a automação)
  const handleManualClick = () => {
    console.log('Clique manual - reiniciando automação...');
    hasAutoFilledRef.current = false;
    clickCountRef.current = 0;
    executarAutomacao();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Adicionar Conta de Energia UC</h3>
        {subscriberData && (
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={handleManualClick}
            className="flex items-center gap-2"
            disabled={isFillingRef.current}
          >
            <Copy className="w-4 h-4" />
            {isFillingRef.current ? 'Preenchendo...' : 'Preencher com dados do assinante'}
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
              <FormLabel>Tipo de Pessoa na Conta</FormLabel>
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
                  {tipoContaOriginal === 'fisica' ? 'CPF' : 'CNPJ'} na Conta de Energia
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
                  {tipoContaOriginal === 'fisica' ? 'Nome da PF' : 'Nome da Empresa'} na Conta de Energia
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
                <FormLabel>UC - Unidade Consumidora</FormLabel>
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
                <FormLabel>Número do Parceiro</FormLabel>
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
                  <FormLabel>CEP</FormLabel>
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
                  <FormLabel>Endereço</FormLabel>
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
                  <FormLabel>Número</FormLabel>
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
                  <FormLabel>Bairro</FormLabel>
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
                  <FormLabel>Cidade</FormLabel>
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
                  <FormLabel>Estado</FormLabel>
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
