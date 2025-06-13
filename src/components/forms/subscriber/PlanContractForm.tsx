
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { SubscriberFormData } from '@/types/subscriber';
import { useState } from 'react';
import DiscountTable from './DiscountTable';

interface PlanContractFormProps {
  form: UseFormReturn<SubscriberFormData>;
}

const PlanContractForm = ({ form }: PlanContractFormProps) => {
  const [selectedDiscount, setSelectedDiscount] = useState<number | undefined>();
  
  const watchedValues = {
    contractedKwh: form.watch('planContract.contractedKwh') || 0,
    loyalty: form.watch('planContract.loyalty') || 'none'
  };

  const handleDiscountSelect = (percentage: number) => {
    setSelectedDiscount(percentage);
    form.setValue('planContract.discountPercentage', percentage);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">6. Contrato do Plano</h3>
        
        {/* Primeira linha: Plano Selecionado e Data de Adesão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="planContract.selectedPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Plano Selecionado *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
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
                <FormLabel className="text-gray-700 font-medium">Data de Adesão *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="date"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Segunda linha: Modalidade de Compensação */}
        <div>
          <FormField
            control={form.control}
            name="planContract.compensationMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Modalidade de Compensação *</FormLabel>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="autoConsumption" id="autoConsumption" />
                      <Label htmlFor="autoConsumption" className="cursor-pointer text-gray-700">
                        Autoconsumo Remoto
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sharedGeneration" id="sharedGeneration" />
                      <Label htmlFor="sharedGeneration" className="cursor-pointer text-gray-700">
                        Geração Compartilhada
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Terceira linha: kWh Informado pelo Vendedor e kWh Contratado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="planContract.informedKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">kWh Informado pelo Vendedor *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    placeholder="Ex: 450"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel className="text-gray-700 font-medium">kWh Contratado *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    placeholder="Ex: 500"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quarta linha: Fidelidade e Percentual de Desconto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="planContract.loyalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Fidelidade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione a fidelidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Sem Fidelidade</SelectItem>
                    <SelectItem value="oneYear">12 Meses</SelectItem>
                    <SelectItem value="twoYears">24 Meses</SelectItem>
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
                <FormLabel className="text-gray-700 font-medium">Percentual de Desconto (%)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    placeholder="Será preenchido automaticamente"
                    className="border-gray-300 bg-gray-50"
                    readOnly
                    value={selectedDiscount || field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Tabela de Descontos */}
      <DiscountTable
        contractedKwh={watchedValues.contractedKwh}
        loyalty={watchedValues.loyalty as 'none' | 'oneYear' | 'twoYears'}
        onDiscountSelect={handleDiscountSelect}
        selectedDiscount={selectedDiscount}
      />
    </div>
  );
};

export default PlanContractForm;
