
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';

interface GeneratorPaymentFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorPaymentForm = ({ form }: GeneratorPaymentFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">4</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Dados para Recebimento</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="paymentData.banco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banco *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 001 - Banco do Brasil" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentData.agencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agência *</FormLabel>
              <FormControl>
                <Input placeholder="0000-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentData.conta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta *</FormLabel>
              <FormControl>
                <Input placeholder="00000000-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentData.pix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave PIX</FormLabel>
              <FormControl>
                <Input placeholder="CPF, e-mail, telefone ou chave aleatória" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GeneratorPaymentForm;
