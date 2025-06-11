
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
  const faixaConsumo = form.watch('planContract.faixaConsumo');
  const fidelidade = form.watch('planContract.fidelidade');
  const anosFidelidade = form.watch('planContract.anosFidelidade');

  const discountRates = {
    '400-599': { sem: 13, com: { '1': 15, '2': 20 } },
    '600-1099': { sem: 15, com: { '1': 18, '2': 20 } },
    '1100-3099': { sem: 18, com: { '1': 20, '2': 22 } },
    '3100-7000': { sem: 20, com: { '1': 22, '2': 25 } },
    '7000+': { sem: 22, com: { '1': 25, '2': 27 } }
  };

  const getCurrentDiscount = () => {
    if (!faixaConsumo || !fidelidade) return 0;
    
    const rates = discountRates[faixaConsumo as keyof typeof discountRates];
    if (fidelidade === 'sem') {
      return rates.sem;
    } else if (fidelidade === 'com' && anosFidelidade) {
      return rates.com[anosFidelidade as '1' | '2'];
    }
    return 0;
  };

  // Atualizar o desconto automaticamente quando as seleções mudarem
  React.useEffect(() => {
    const currentDiscount = getCurrentDiscount();
    form.setValue('planContract.desconto', currentDiscount);
  }, [faixaConsumo, fidelidade, anosFidelidade, form]);

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
                <Select value={field.value} onValueChange={field.onChange}>
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
                <Input {...field} type="date" />
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
                  {...field} 
                  type="number" 
                  placeholder="Valor informado pelo vendedor"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
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
                  {...field} 
                  type="number" 
                  placeholder="Valor definido pelo gestor"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
              <Select value={field.value} onValueChange={field.onChange}>
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
                value={field.value}
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
                  value={field.value}
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
