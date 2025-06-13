
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
    form.setValue('planContract.discountPercentage', percentage);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">6. Contrato do Plano</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="planContract.selectedPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano Selecionado *</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  onUpdate({ selectedPlan: value });
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="empresarial">Empresarial</SelectItem>
                </SelectContent>
              </Select>
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
                  type="date" 
                  {...field}
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
      </div>

      <div>
        <FormField
          control={form.control}
          name="planContract.compensationMode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Modalidade de Compensação *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onUpdate({ compensationMode: value as 'autoConsumption' | 'sharedGeneration' });
                  }}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="autoConsumption" id="autoConsumption" />
                    <Label htmlFor="autoConsumption">Autoconsumo Remoto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sharedGeneration" id="sharedGeneration" />
                    <Label htmlFor="sharedGeneration">Geração Compartilhada</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="planContract.informedKwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>kWh Informado pelo Vendedor *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 400"
                  {...field}
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
                  type="number" 
                  placeholder="Ex: 400"
                  {...field}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="planContract.loyalty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fidelidade</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  onUpdate({ loyalty: value as 'none' | 'oneYear' | 'twoYears' });
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fidelidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sem Fidelidade</SelectItem>
                  <SelectItem value="oneYear">1 Ano</SelectItem>
                  <SelectItem value="twoYears">2 Anos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planContract.discountPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentual de Desconto (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.1"
                  placeholder="Ex: 15"
                  {...field}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    onUpdate({ discountPercentage: value });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tabela interativa de desconto baseada no kWh contratado */}
      <DiscountTable
        contractedKwh={data.contractedKwh || 0}
        loyalty={data.loyalty || 'none'}
        onDiscountSelect={handleDiscountSelect}
        selectedDiscount={data.discountPercentage}
      />
    </div>
  );
};

export default PlanContractForm;
