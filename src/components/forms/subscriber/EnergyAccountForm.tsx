
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CepInput } from '@/components/ui/cep-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SubscriberFormData } from '@/types/subscriber';
import { Zap, MapPin, FileText, Copy } from 'lucide-react';
import { useCepLookup } from '@/hooks/useCepLookup';
import { useEffect } from 'react';

interface EnergyAccountFormProps {
  form: UseFormReturn<SubscriberFormData>;
}

const EnergyAccountForm = ({ form }: EnergyAccountFormProps) => {
  const { lookupCep } = useCepLookup();

  const handleCepLookup = async (cep: string) => {
    try {
      const address = await lookupCep(cep);
      if (address) {
        form.setValue('energyAccount.address.street', address.logradouro || '');
        form.setValue('energyAccount.address.neighborhood', address.bairro || '');
        form.setValue('energyAccount.address.city', address.localidade || '');
        form.setValue('energyAccount.address.state', address.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  // Auto-preenchimento com dados do assinante
  const autoFillWithSubscriberData = () => {
    console.log('🔄 [ENERGY ACCOUNT] Preenchendo com dados do assinante...');
    
    const subscriberType = form.getValues('subscriberType');
    
    if (subscriberType === 'person') {
      const personalData = form.getValues('personalData');
      
      console.log('📋 [ENERGY ACCOUNT] Dados pessoais encontrados:', personalData);
      
      if (personalData?.cpf && personalData?.fullName) {
        // Preencher dados básicos
        form.setValue('energyAccount.holderType', 'person');
        form.setValue('energyAccount.cpfCnpj', personalData.cpf);
        form.setValue('energyAccount.holderName', personalData.fullName);
        
        // Preencher data de nascimento SEMPRE que existir
        console.log('📅 [ENERGY ACCOUNT] Data de nascimento:', personalData.birthDate);
        if (personalData.birthDate) {
          form.setValue('energyAccount.birthDate', personalData.birthDate);
          console.log('✅ [ENERGY ACCOUNT] Data de nascimento preenchida:', personalData.birthDate);
        }
        
        form.setValue('energyAccount.partnerNumber', personalData.partnerNumber || '');
        
        // Preencher endereço INDEPENDENTE do CEP - copiar todos os campos disponíveis
        console.log('🏠 [ENERGY ACCOUNT] Endereço encontrado:', personalData.address);
        if (personalData.address) {
          const address = personalData.address;
          
          // Preencher todos os campos de endereço que existem
          if (address.cep) {
            form.setValue('energyAccount.address.cep', address.cep);
            console.log('✅ [ENERGY ACCOUNT] CEP preenchido:', address.cep);
          }
          if (address.street) {
            form.setValue('energyAccount.address.street', address.street);
            console.log('✅ [ENERGY ACCOUNT] Rua preenchida:', address.street);
          }
          if (address.number) {
            form.setValue('energyAccount.address.number', address.number);
            console.log('✅ [ENERGY ACCOUNT] Número preenchido:', address.number);
          }
          if (address.complement) {
            form.setValue('energyAccount.address.complement', address.complement);
            console.log('✅ [ENERGY ACCOUNT] Complemento preenchido:', address.complement);
          }
          if (address.neighborhood) {
            form.setValue('energyAccount.address.neighborhood', address.neighborhood);
            console.log('✅ [ENERGY ACCOUNT] Bairro preenchido:', address.neighborhood);
          }
          if (address.city) {
            form.setValue('energyAccount.address.city', address.city);
            console.log('✅ [ENERGY ACCOUNT] Cidade preenchida:', address.city);
          }
          if (address.state) {
            form.setValue('energyAccount.address.state', address.state);
            console.log('✅ [ENERGY ACCOUNT] Estado preenchido:', address.state);
          }
        }
        
        console.log('✅ [ENERGY ACCOUNT] Dados PF preenchidos automaticamente');
      } else {
        console.log('⚠️ [ENERGY ACCOUNT] Dados pessoais incompletos - CPF:', personalData?.cpf, 'Nome:', personalData?.fullName);
      }
    } else if (subscriberType === 'company') {
      const companyData = form.getValues('companyData');
      
      console.log('📋 [ENERGY ACCOUNT] Dados da empresa encontrados:', companyData);
      
      if (companyData?.cnpj && companyData?.companyName) {
        // Preencher dados básicos
        form.setValue('energyAccount.holderType', 'company');
        form.setValue('energyAccount.cpfCnpj', companyData.cnpj);
        form.setValue('energyAccount.holderName', companyData.companyName);
        form.setValue('energyAccount.birthDate', ''); // PJ não tem data de nascimento
        form.setValue('energyAccount.partnerNumber', companyData.partnerNumber || '');
        
        // Preencher endereço INDEPENDENTE do CEP - copiar todos os campos disponíveis
        console.log('🏠 [ENERGY ACCOUNT] Endereço da empresa encontrado:', companyData.address);
        if (companyData.address) {
          const address = companyData.address;
          
          // Preencher todos os campos de endereço que existem
          if (address.cep) {
            form.setValue('energyAccount.address.cep', address.cep);
            console.log('✅ [ENERGY ACCOUNT] CEP preenchido:', address.cep);
          }
          if (address.street) {
            form.setValue('energyAccount.address.street', address.street);
            console.log('✅ [ENERGY ACCOUNT] Rua preenchida:', address.street);
          }
          if (address.number) {
            form.setValue('energyAccount.address.number', address.number);
            console.log('✅ [ENERGY ACCOUNT] Número preenchido:', address.number);
          }
          if (address.complement) {
            form.setValue('energyAccount.address.complement', address.complement);
            console.log('✅ [ENERGY ACCOUNT] Complemento preenchido:', address.complement);
          }
          if (address.neighborhood) {
            form.setValue('energyAccount.address.neighborhood', address.neighborhood);
            console.log('✅ [ENERGY ACCOUNT] Bairro preenchido:', address.neighborhood);
          }
          if (address.city) {
            form.setValue('energyAccount.address.city', address.city);
            console.log('✅ [ENERGY ACCOUNT] Cidade preenchida:', address.city);
          }
          if (address.state) {
            form.setValue('energyAccount.address.state', address.state);
            console.log('✅ [ENERGY ACCOUNT] Estado preenchido:', address.state);
          }
        }
        
        console.log('✅ [ENERGY ACCOUNT] Dados PJ preenchidos automaticamente');
      } else {
        console.log('⚠️ [ENERGY ACCOUNT] Dados da empresa incompletos - CNPJ:', companyData?.cnpj, 'Nome:', companyData?.companyName);
      }
    }
  };

  // Auto-preenchimento quando o componente é montado
  useEffect(() => {
    const subscriberType = form.getValues('subscriberType');
    const energyAccountData = form.getValues('energyAccount');
    
    console.log('🔄 [ENERGY ACCOUNT] Verificando auto-preenchimento na montagem...');
    console.log('📋 [ENERGY ACCOUNT] Tipo de assinante:', subscriberType);
    console.log('📋 [ENERGY ACCOUNT] Dados atuais da conta:', energyAccountData);
    
    // Se a conta de energia está vazia, tentar preencher automaticamente
    if (subscriberType && !energyAccountData?.cpfCnpj) {
      console.log('🔄 [ENERGY ACCOUNT] Auto-preenchimento na montagem do componente');
      autoFillWithSubscriberData();
    }
  }, []);

  // Monitorar mudanças nos dados do assinante para auto-preencher em tempo real
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Se mudaram dados pessoais ou da empresa, tentar auto-preencher
      if (name?.startsWith('personalData') || name?.startsWith('companyData')) {
        console.log('🔄 [ENERGY ACCOUNT] Detectada mudança nos dados do assinante:', name);
        setTimeout(() => {
          autoFillWithSubscriberData();
        }, 100);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold">Conta de Energia</div>
                <div className="text-green-100 text-sm font-normal">Informações da unidade consumidora</div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={autoFillWithSubscriberData}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Copy className="w-4 h-4 mr-2" />
              Preencher com dados do assinante
            </Button>
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
                name="energyAccount.partnerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Número do Parceiro</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Digite o número do parceiro"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energyAccount.cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">CPF/CNPJ do Titular *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energyAccount.holderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Nome do Titular *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Nome completo do titular"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energyAccount.birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-medium">Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="date"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                          onCepFound={handleCepLookup}
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energyAccount.address.number"
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
                  name="energyAccount.address.complement"
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
                name="energyAccount.address.street"
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
                  name="energyAccount.address.neighborhood"
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
                  name="energyAccount.address.city"
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
                  name="energyAccount.address.state"
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
