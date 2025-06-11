
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PlanDetails } from '@/types/subscriber';

interface PlanDetailsFormProps {
  data: PlanDetails;
  onUpdate: (data: Partial<PlanDetails>) => void;
  form: UseFormReturn<any>;
}

const PlanDetailsForm = ({ data, onUpdate, form }: PlanDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">7. Detalhes do Plano</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="planDetails.paysPisAndCofins"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onUpdate({ paysPisAndCofins: checked as boolean });
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Cliente Paga PIS e COFINS
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Marque se o cliente deve pagar PIS e COFINS (padrão: Sim)
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDetails.paysWireB"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onUpdate({ paysWireB: checked as boolean });
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Cliente Paga Fio B
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Marque se o cliente deve pagar Fio B (padrão: Não)
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDetails.addDistributorValue"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onUpdate({ addDistributorValue: checked as boolean });
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Adicionar Valor da Distribuidora na Fatura
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Marque para incluir o valor da distribuidora na fatura (padrão: Não)
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDetails.exemptFromPayment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onUpdate({ exemptFromPayment: checked as boolean });
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Assinante Isento de Pagamento das Faturas
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Marque se o assinante está isento de pagamento (padrão: Não)
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PlanDetailsForm;
