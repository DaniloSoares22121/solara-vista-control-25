
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnexosFormProps {
  form: UseFormReturn<any>;
}

const AnexosForm = ({ form }: AnexosFormProps) => {
  const tipoAssinante = form.watch('subscriber.type');
  const realizarTroca = form.watch('energyAccount.realizarTrocaTitularidade');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">8. Anexos</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Documentos Obrigatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="attachments.contrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contrato do Assinante assinado *</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attachments.cnh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNH do assinante *</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attachments.conta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conta do assinante *</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {tipoAssinante === 'juridica' && (
            <FormField
              control={form.control}
              name="attachments.contratoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrato Social *</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {realizarTroca && (
            <FormField
              control={form.control}
              name="attachments.procuracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procuração para troca de titularidade *</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnexosForm;
