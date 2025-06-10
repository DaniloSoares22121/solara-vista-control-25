
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface ConcessionariaFormProps {
  form: UseFormReturn<any>;
}

const ConcessionariaForm = ({ form }: ConcessionariaFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">1. Seleção da Concessionária</h3>
      
      <FormField
        control={form.control}
        name="concessionaria"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Concessionária *</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a concessionária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equatorial-goias">Equatorial Goiás</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ConcessionariaForm;
