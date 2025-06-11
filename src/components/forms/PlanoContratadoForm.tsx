
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import DiscountTable from './DiscountTable';

interface PlanoContratadoFormProps {
  form: UseFormReturn<any>;
}

const PlanoContratadoForm = ({ form }: PlanoContratadoFormProps) => {
  // Watch specific form values
  const planContract = form.watch('planContract') || {};
  const faixaConsumo = planContract.faixaConsumo || '';
  const fidelidade = planContract.fidelidade || '';
  const anosFidelidade = planContract.anosFidelidade || '';
  const kwhVendedor = planContract.kwhVendedor || 0;

  console.log('PlanoContratadoForm - Valores atuais:', {
    faixaConsumo,
    fidelidade,
    anosFidelidade,
    kwhVendedor,
    planContract
  });

  // Função para determinar a faixa de consumo automaticamente baseada no kWh do vendedor
  const determinarFaixaConsumo = (kwh: number): string => {
    if (kwh >= 400 && kwh <= 599) return '400-599';
    if (kwh >= 600 && kwh <= 1099) return '600-1099';
    if (kwh >= 1100 && kwh <= 3099) return '1100-3099';
    if (kwh >= 3100 && kwh <= 7000) return '3100-7000';
    if (kwh > 7000) return '7000+';
    return '400-599'; // default
  };

  // Atualizar automaticamente a faixa de consumo quando o kWh do vendedor mudar
  React.useEffect(() => {
    if (kwhVendedor && kwhVendedor > 0) {
      const novaFaixa = determinarFaixaConsumo(kwhVendedor);
      if (novaFaixa !== faixaConsumo) {
        form.setValue('planContract.faixaConsumo', novaFaixa);
      }
    }
  }, [kwhVendedor, faixaConsumo, form]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">5. Contratação Plano Escolhido</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="planContract.modalidadeCompensacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalidade de Compensação *</FormLabel>
              <FormControl>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autoconsumo">AutoConsumo</SelectItem>
                    <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.dataAdesao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Adesão *</FormLabel>
              <FormControl>
                <Input {...field} type="date" value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.kwhVendedor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>kWh Vendedor Informou *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Valor informado pelo vendedor"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                  min="0"
                />
              </FormControl>
              <FormMessage />
              {kwhVendedor > 0 && kwhVendedor < 400 && (
                <p className="text-sm text-amber-600">
                  ⚠️ Consumo abaixo de 400 kWh. Faixa mínima será aplicada.
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.kwhContratado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>kWh Contratado *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Valor definido pelo gestor"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="planContract.faixaConsumo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faixa de Consumo *</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa de consumo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400-599">400 kWh a 599 kWh</SelectItem>
                  <SelectItem value="600-1099">600 kWh a 1099 kWh</SelectItem>
                  <SelectItem value="1100-3099">1100 kWh a 3099 kWh</SelectItem>
                  <SelectItem value="3100-7000">3100 kWh a 7000 kWh</SelectItem>
                  <SelectItem value="7000+">Maior que 7099 kWh</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
            {kwhVendedor > 0 && (
              <p className="text-sm text-muted-foreground">
                Baseado no kWh informado pelo vendedor: {kwhVendedor} kWh
              </p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="planContract.fidelidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Fidelidade *</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value || ''}
                onValueChange={field.onChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sem" id="sem-fidelidade" />
                  <Label htmlFor="sem-fidelidade">Sem Fidelidade</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="com" id="com-fidelidade" />
                  <Label htmlFor="com-fidelidade">Com Fidelidade</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {fidelidade === 'com' && (
        <FormField
          control={form.control}
          name="planContract.anosFidelidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anos de Fidelidade *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="1-ano" />
                    <Label htmlFor="1-ano">1 Ano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="2-anos" />
                    <Label htmlFor="2-anos">2 Anos</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <DiscountTable 
        faixaConsumo={faixaConsumo}
        fidelidade={fidelidade}
        anosFidelidade={anosFidelidade}
      />
    </div>
  );
};

export default PlanoContratadoForm;
