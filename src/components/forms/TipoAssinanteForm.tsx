
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface TipoAssinanteFormProps {
  form: UseFormReturn<any>;
}

const TipoAssinanteForm = ({ form }: TipoAssinanteFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">2. Tipo de Assinante</h3>
      
      <FormField
        control={form.control}
        name="subscriber.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa *</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="fisica" />
                  <Label htmlFor="fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="juridica" />
                  <Label htmlFor="juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TipoAssinanteForm;
