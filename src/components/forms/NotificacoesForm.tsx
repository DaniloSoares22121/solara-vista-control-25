
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificacoesFormProps {
  form: UseFormReturn<any>;
}

const NotificacoesForm = ({ form }: NotificacoesFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">7. Cadência de Mensagens (WhatsApp e E-Mail)</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="notifications.whatsappFaturas"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Enviar por WhatsApp Faturas de Energia?</FormLabel>
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
            name="notifications.whatsappPagamento"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Informar por WhatsApp Pagamento Recebido</FormLabel>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Notificações antes do vencimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">Ao Criar Nova Cobrança</h5>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">WhatsApp</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.criarCobranca.whatsapp"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">E-mail</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.criarCobranca.email"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium">Alteração de Valor ou Data</h5>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">WhatsApp</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.alteracaoValor.whatsapp"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">E-mail</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.alteracaoValor.email"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium">Vencimento 1 dia antes</h5>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">WhatsApp</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.vencimento1Dia.whatsapp"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">E-mail</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.vencimento1Dia.email"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium">Vencimento hoje</h5>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">WhatsApp</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.vencimentoHoje.whatsapp"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">E-mail</FormLabel>
                <FormField
                  control={form.control}
                  name="notifications.notifications.vencimentoHoje.email"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Notificações de cobranças vencidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'day1', label: '1 dia após o vencimento' },
            { key: 'day3', label: '3 dias após o vencimento' },
            { key: 'day5', label: '5 dias após o vencimento' },
            { key: 'day7', label: '7 dias após o vencimento' },
            { key: 'day15', label: '15 dias após o vencimento' },
            { key: 'day20', label: '20 dias após o vencimento' },
            { key: 'day25', label: '25 dias após o vencimento' },
            { key: 'day30', label: '30 dias após o vencimento' },
            { key: 'after30', label: 'Após 30 dias (de 5 em 5 dias)' }
          ].map((item) => (
            <div key={item.key} className="space-y-2 border-b pb-2">
              <h5 className="font-medium">{item.label}</h5>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">WhatsApp</FormLabel>
                <FormField
                  control={form.control}
                  name={`notifications.overdueNotifications.${item.key}.whatsapp`}
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">E-mail</FormLabel>
                <FormField
                  control={form.control}
                  name={`notifications.overdueNotifications.${item.key}.email`}
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificacoesForm;
