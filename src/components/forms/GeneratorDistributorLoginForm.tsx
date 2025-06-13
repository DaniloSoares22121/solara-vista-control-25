
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Lock, User, Calendar } from 'lucide-react';
import { CpfInput } from '@/components/ui/cpf-input';
import { CnpjInput } from '@/components/ui/cnpj-input';
import { useEffect } from 'react';

interface GeneratorDistributorLoginFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorDistributorLoginForm = ({ form }: GeneratorDistributorLoginFormProps) => {
  const ownerType = form.watch('owner.type');
  const ownerCpfCnpj = form.watch('owner.cpfCnpj');
  const ownerDataNascimento = form.watch('owner.dataNascimento');
  const plants = form.watch('plants');

  // Auto-preencher dados do distributor login com dados do proprietário
  useEffect(() => {
    console.log('🔄 [DISTRIBUTOR AUTO-FILL] Preenchendo dados automaticamente');
    
    // Preencher CPF/CNPJ se ainda não estiver preenchido
    if (ownerCpfCnpj && !form.getValues('distributorLogin.cpfCnpj')) {
      form.setValue('distributorLogin.cpfCnpj', ownerCpfCnpj);
    }
    
    // Preencher data de nascimento se for pessoa física e ainda não estiver preenchida
    if (ownerType === 'fisica' && ownerDataNascimento && !form.getValues('distributorLogin.dataNascimento')) {
      form.setValue('distributorLogin.dataNascimento', ownerDataNascimento);
    }

    // Preencher UC com a primeira usina cadastrada
    if (plants && plants.length > 0 && plants[0].uc && !form.getValues('distributorLogin.uc')) {
      console.log('🔄 [DISTRIBUTOR AUTO-FILL] Preenchendo UC da primeira usina:', plants[0].uc);
      form.setValue('distributorLogin.uc', plants[0].uc);
    }
  }, [ownerType, ownerCpfCnpj, ownerDataNascimento, plants, form]);

  const handleCpfFound = (cpfData: any) => {
    console.log('📍 [DISTRIBUTOR CPF] CPF encontrado:', cpfData);
    
    if (cpfData && cpfData.nascimento && !form.getValues('distributorLogin.dataNascimento')) {
      // Converter DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = cpfData.nascimento.split('/');
      if (day && month && year) {
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        form.setValue('distributorLogin.dataNascimento', isoDate);
      }
    }
  };

  const handleCnpjFound = (cnpjData: any) => {
    console.log('📍 [DISTRIBUTOR CNPJ] CNPJ encontrado:', cnpjData);
    // Para CNPJ, não temos data de nascimento específica
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">3</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Acesso à Distribuidora</h3>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-900">Dados para Acesso ao Portal</h4>
            <p className="text-sm text-purple-700 mt-1">
              Essas informações serão usadas para acessar automaticamente o portal da concessionária 
              e baixar faturas e dados de geração.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="distributorLogin.uc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">Unidade Consumidora (UC) *</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Ex: 12345678901" 
                    {...field} 
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distributorLogin.cpfCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                {ownerType === 'fisica' ? 'CPF *' : 'CNPJ *'}
              </FormLabel>
              <FormControl>
                {ownerType === 'fisica' ? (
                  <CpfInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    onCpfFound={handleCpfFound}
                    placeholder="000.000.000-00"
                  />
                ) : (
                  <CnpjInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    onCnpjFound={handleCnpjFound}
                    placeholder="00.000.000/0000-00"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {ownerType === 'fisica' && (
          <FormField
            control={form.control}
            name="distributorLogin.dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Data de Nascimento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      type="date" 
                      {...field} 
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 text-sm">
          <strong>Importante:</strong> Os dados informados devem ser exatamente os mesmos 
          utilizados para fazer login no site da concessionária. Estes dados são criptografados 
          e armazenados com segurança.
        </p>
      </div>
    </div>
  );
};

export default GeneratorDistributorLoginForm;
