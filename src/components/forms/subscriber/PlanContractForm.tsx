
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { PlanContract } from '@/types/subscriber';
import DiscountTable from './DiscountTable';

interface PlanContractFormProps {
  data: PlanContract;
  onUpdate: (data: Partial<PlanContract>) => void;
  form: UseFormReturn<any>;
}

const PlanContractForm = ({ data, onUpdate, form }: PlanContractFormProps) => {
  const handleDiscountSelect = (percentage: number) => {
    onUpdate({ discountPercentage: percentage });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">6. Contratação do Plano</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="planContract.selectedPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano Escolhido *</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ selectedPlan: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Plano Básico</SelectItem>
                    <SelectItem value="intermediario">Plano Intermediário</SelectItem>
                    <SelectItem value="avancado">Plano Avançado</SelectItem>
                    <SelectItem value="premium">Plano Premium</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.compensationMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalidade de Compensação *</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ compensationMode: value as 'autoConsumption' | 'sharedGeneration' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autoConsumption">AutoConsumo</SelectItem>
                    <SelectItem value="sharedGeneration">Geração Compartilhada</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.adhesionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Adesão *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="date" 
                  onChange={(e) => {
                    field.onChange(e);
                    onUpdate({ adhesionDate: e.target.value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.informedKwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>kWh Vendedor Informou *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="Digite o kWh informado"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    onUpdate({ informedKwh: value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.contractedKwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>kWh Contratado *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="Digite o kWh contratado"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    onUpdate({ contractedKwh: value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="planContract.loyalty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fidelidade *</FormLabel>
            <FormControl>
              <RadioGroup 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  onUpdate({ loyalty: value as 'none' | 'oneYear' | 'twoYears' });
                }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="none" id="no-loyalty" />
                  <Label htmlFor="no-loyalty">Sem Fidelidade</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="oneYear" id="one-year" />
                  <Label htmlFor="one-year">Com Fidelidade (1 Ano)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="twoYears" id="two-years" />
                  <Label htmlFor="two-years">Com Fidelidade (2 Anos)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DiscountTable
        informedKwh={data.informedKwh || 0}
        loyalty={data.loyalty || 'none'}
        onDiscountSelect={handleDiscountSelect}
        selectedDiscount={data.discountPercentage}
      />
    </div>
  );
};

export default PlanContractForm;
