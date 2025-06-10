
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface DetalhesPlanoFormProps {
  form: UseFormReturn<any>;
}

const DetalhesPlanoForm = ({ form }: DetalhesPlanoFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">6. Detalhes do Plano</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="planDetails.clientePagaPisCofins"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Cliente Paga PIS e COFINS</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDetails.clientePagaFioB"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Cliente Paga Fio B</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDetails.adicionarValorDistribuidora"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Adicionar Valor da Distribuidora na Fatura</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDetails.assinanteIsento"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Assinante ISENTO de pagamento das Faturas de Energia?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DetalhesPlanoForm;
