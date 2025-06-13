
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { CepInput } from '@/components/ui/cep-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { SubscriberFormData } from '@/types/subscriber';
import { Zap, MapPin, FileText } from 'lucide-react';
import { useCepLookup } from '@/hooks/useCepLookup';

interface EnergyAccountFormProps {
  form: UseFormReturn<SubscriberFormData>;
}

const EnergyAccountForm = ({ form }: EnergyAccountFormProps) => {
  const { lookupCep } = useCepLookup();

  const handleCepLookup = async (cep: string) => {
    try {
      const address = await lookupCep(cep);
      if (address) {
        form.setValue('energyAccount.address.endereco', address.logradouro || '');
        form.setValue('energyAccount.address.bairro', address.bairro || '');
        form.setValue('energyAccount.address.cidade', address.localidade || '');
        form.setValue('energyAccount.address.estado', address.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold">Conta de Energia</div>
              <div className="text-green-100 text-sm font-normal">Informações da unidade consumidora</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          {/* Dados da Conta */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-blue-900">Identificação da Conta</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="energyAccount.uc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Unidade Consumidora (UC) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="00000000000000"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energyAccount.averageConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Consumo Médio (kWh/mês) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Ex: 450"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Endereço da Instalação */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-purple-900">Endereço da Instalação</h4>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="energyAccount.address.cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 font-medium">CEP *</FormLabel>
                      <FormControl>
                        <CepInput
                          value={field.value}
                          onChange={field.onChange}
                          onCepComplete={handleCepLookup}
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energyAccount.address.numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 font-medium">Número *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="123"
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energyAccount.address.complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 font-medium">Complemento</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Apto 101"
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="energyAccount.address.endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-800 font-medium">Endereço *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Rua/Avenida será preenchida automaticamente"
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-purple-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="energyAccount.address.bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 font-medium">Bairro *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Será preenchido automaticamente"
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-purple-50/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energyAccount.address.cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 font-medium">Cidade *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Será preenchida automaticamente"
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-purple-50/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energyAccount.address.estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-800 font-medium">Estado *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="UF"
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-purple-50/50"
                          maxLength={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyAccountForm;
