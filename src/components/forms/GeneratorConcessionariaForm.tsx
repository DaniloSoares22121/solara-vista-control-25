
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Zap } from 'lucide-react';
import React from 'react';

interface GeneratorConcessionariaFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorConcessionariaForm = ({ form }: GeneratorConcessionariaFormProps) => {
  // Define automaticamente como Equatorial Goiás se não houver valor
  React.useEffect(() => {
    const currentValue = form.getValues('concessionaria');
    if (!currentValue) {
      form.setValue('concessionaria', 'equatorial-goias');
    }
  }, [form]);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-yellow-900">Concessionária de Energia</h3>
          <p className="text-yellow-600 text-sm">Selecione a distribuidora de energia elétrica</p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="concessionaria"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Concessionária *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || 'equatorial-goias'}>
              <FormControl>
                <SelectTrigger className="h-12 transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                  <SelectValue placeholder="Selecione a concessionária" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="equatorial-goias">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Equatorial Goiás
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GeneratorConcessionariaForm;
