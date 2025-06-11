
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { NotificationSettings } from '@/types/subscriber';

interface NotificationSettingsFormProps {
  data: NotificationSettings;
  onUpdate: (data: Partial<NotificationSettings>) => void;
  form: UseFormReturn<any>;
}

const NotificationSettingsForm = ({ data, onUpdate, form }: NotificationSettingsFormProps) => {
  const updateWhatsApp = (key: keyof NotificationSettings['whatsapp'], value: boolean) => {
    onUpdate({
      whatsapp: {
        ...data.whatsapp,
        [key]: value
      }
    });
  };

  const updateEmail = (key: keyof NotificationSettings['email'], value: boolean) => {
    onUpdate({
      email: {
        ...data.email,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">8. Cadência de Mensagens (WhatsApp e E-mail)</h3>
      
      {/* WhatsApp Básico */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">WhatsApp - Configurações Básicas</h4>
        
        <FormField
          control={form.control}
          name="notificationSettings.whatsapp.sendInvoices"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    updateWhatsApp('sendInvoices', checked as boolean);
                  }}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Enviar por WhatsApp Faturas de Energia
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationSettings.whatsapp.paymentReceived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    updateWhatsApp('paymentReceived', checked as boolean);
                  }}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Informar por WhatsApp Pagamento Recebido
              </FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Notificações Antes do Vencimento */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Notificações Antes do Vencimento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">WhatsApp</h5>
            
            {[
              { key: 'createCharge', label: 'Ao Criar Nova Cobrança' },
              { key: 'changeValueOrDate', label: 'Alteração de Valor ou Data de Vencimento' },
              { key: 'oneDayBefore', label: 'Aviso do Vencimento 1 Dia Antes' },
              { key: 'onVencimentoDay', label: 'Aviso do Vencimento no Dia' },
            ].map(({ key, label }) => (
              <FormField
                key={key}
                control={form.control}
                name={`notificationSettings.whatsapp.${key}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateWhatsApp(key as keyof NotificationSettings['whatsapp'], checked as boolean);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">E-mail</h5>
            
            {[
              { key: 'createCharge', label: 'Ao Criar Nova Cobrança' },
              { key: 'changeValueOrDate', label: 'Alteração de Valor ou Data de Vencimento' },
              { key: 'oneDayBefore', label: 'Aviso do Vencimento 1 Dia Antes' },
              { key: 'onVencimentoDay', label: 'Aviso do Vencimento no Dia' },
            ].map(({ key, label }) => (
              <FormField
                key={key}
                control={form.control}
                name={`notificationSettings.email.${key}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateEmail(key as keyof NotificationSettings['email'], checked as boolean);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notificações de Cobranças Vencidas */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Notificações de Cobranças Vencidas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">WhatsApp</h5>
            
            {[
              { key: 'oneDayAfter', label: '1 Dia Após' },
              { key: 'threeDaysAfter', label: '3 Dias Após' },
              { key: 'fiveDaysAfter', label: '5 Dias Após' },
              { key: 'sevenDaysAfter', label: '7 Dias Após' },
              { key: 'fifteenDaysAfter', label: '15 Dias Após' },
              { key: 'twentyDaysAfter', label: '20 Dias Após' },
              { key: 'twentyFiveDaysAfter', label: '25 Dias Após' },
              { key: 'thirtyDaysAfter', label: '30 Dias Após' },
              { key: 'afterThirtyDays', label: 'Após 30 Dias (de 5 em 5 dias)' },
            ].map(({ key, label }) => (
              <FormField
                key={key}
                control={form.control}
                name={`notificationSettings.whatsapp.${key}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateWhatsApp(key as keyof NotificationSettings['whatsapp'], checked as boolean);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">E-mail</h5>
            
            {[
              { key: 'oneDayAfter', label: '1 Dia Após' },
              { key: 'threeDaysAfter', label: '3 Dias Após' },
              { key: 'fiveDaysAfter', label: '5 Dias Após' },
              { key: 'sevenDaysAfter', label: '7 Dias Após' },
              { key: 'fifteenDaysAfter', label: '15 Dias Após' },
              { key: 'twentyDaysAfter', label: '20 Dias Após' },
              { key: 'twentyFiveDaysAfter', label: '25 Dias Após' },
              { key: 'thirtyDaysAfter', label: '30 Dias Após' },
              { key: 'afterThirtyDays', label: 'Após 30 Dias (de 5 em 5 dias)' },
            ].map(({ key, label }) => (
              <FormField
                key={key}
                control={form.control}
                name={`notificationSettings.email.${key}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateEmail(key as keyof NotificationSettings['email'], checked as boolean);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsForm;
