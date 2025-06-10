
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';

interface GeneratorConcessionariaFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorConcessionariaForm = ({ form }: GeneratorConcessionariaFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">1</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Concessionária</h3>
      </div>

      <FormField
        control={form.control}
        name="concessionaria"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Concessionária *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a concessionária" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="equatorial-goias">Equatorial Goiás</SelectItem>
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
