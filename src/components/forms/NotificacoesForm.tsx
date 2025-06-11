
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
          <CardTitle className="text-md">Notificações Antes do Vencimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">Evento</div>
            <div className="font-medium text-center">WhatsApp</div>
            <div className="font-medium text-center">E-Mail</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>Ao Criar Nova Cobrança</div>
            <FormField
              control={form.control}
              name="notifications.notifications.criarCobranca.whatsapp"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.notifications.criarCobranca.email"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>Alteração de Valor ou Data de Vencimento</div>
            <FormField
              control={form.control}
              name="notifications.notifications.alteracaoValor.whatsapp"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.notifications.alteracaoValor.email"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>Aviso do Vencimento 1 dia antes</div>
            <FormField
              control={form.control}
              name="notifications.notifications.vencimento1Dia.whatsapp"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.notifications.vencimento1Dia.email"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>Aviso do Vencimento hoje (no dia do vencimento)</div>
            <FormField
              control={form.control}
              name="notifications.notifications.vencimentoHoje.whatsapp"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications.notifications.vencimentoHoje.email"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Notificações de Cobranças Vencidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">Período</div>
            <div className="font-medium text-center">WhatsApp</div>
            <div className="font-medium text-center">E-Mail</div>
          </div>

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
            <div key={item.key} className="grid grid-cols-3 gap-4 items-center">
              <div>{item.label}</div>
              <FormField
                control={form.control}
                name={`notifications.overdueNotifications.${item.key}.whatsapp`}
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`notifications.overdueNotifications.${item.key}.email`}
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificacoesForm;
