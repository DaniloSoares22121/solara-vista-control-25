
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { SubscriberFormData } from '@/types/subscriber';
import { Percent, FileText, CreditCard, Clock, Award } from 'lucide-react';
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold">Detalhes do Plano Contratado</div>
              <div className="text-blue-100 text-sm font-normal">Configure o plano de energia e fidelidade</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          {/* Consumo Contratado */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Percent className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-green-900">Consumo e Desconto</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="planContract.contractedKwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-800 font-medium">Consumo Contratado (kWh/mês) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Ex: 500"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planContract.discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-800 font-medium">Desconto Aplicado (%)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Será preenchido automaticamente"
                        className="border-green-200 bg-green-50/50"
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

          {/* Fidelidade */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-amber-900">Período de Fidelidade</h4>
            </div>
            
            <FormField
              control={form.control}
              name="planContract.loyalty"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup 
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="flex-1 cursor-pointer">
                          <div className="font-medium text-amber-800">Sem Fidelidade</div>
                          <div className="text-sm text-amber-600">Maior flexibilidade</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                        <RadioGroupItem value="oneYear" id="oneYear" />
                        <Label htmlFor="oneYear" className="flex-1 cursor-pointer">
                          <div className="font-medium text-amber-800">12 Meses</div>
                          <div className="text-sm text-amber-600">Desconto intermediário</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                        <RadioGroupItem value="twoYears" id="twoYears" />
                        <Label htmlFor="twoYears" className="flex-1 cursor-pointer">
                          <div className="font-medium text-amber-800">24 Meses</div>
                          <div className="text-sm text-amber-600">Máximo desconto</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Plano e Compensação */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-blue-900">Plano e Compensação</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="planContract.selectedPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Plano Selecionado *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basico">Plano Básico</SelectItem>
                        <SelectItem value="intermediario">Plano Intermediário</SelectItem>
                        <SelectItem value="premium">Plano Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planContract.compensationMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Modalidade de Compensação *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="autoConsumption">Autoconsumo Remoto</SelectItem>
                        <SelectItem value="sharedGeneration">Geração Compartilhada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Data de Início e kWh Informado */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-purple-900">Informações do Contrato</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="planContract.adhesionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-800 font-medium">Data de Adesão *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="date"
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
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
                    <FormLabel className="text-purple-800 font-medium">kWh Informado *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="Ex: 450"
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Tabela de Descontos Interativa */}
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
