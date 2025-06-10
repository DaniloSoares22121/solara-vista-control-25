
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { CheckCircle } from 'lucide-react';

interface GeneratorDistributorLoginFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorDistributorLoginForm = ({ form }: GeneratorDistributorLoginFormProps) => {
  const ownerType = form.watch('owner.type');
  const ownerCpfCnpj = form.watch('owner.cpfCnpj');
  const ownerDataNascimento = form.watch('owner.dataNascimento');

  // Preencher automaticamente com dados do dono da usina
  const fillFromOwnerData = () => {
    form.setValue('distributorLogin.cpfCnpj', ownerCpfCnpj || '');
    if (ownerType === 'fisica' && ownerDataNascimento) {
      form.setValue('distributorLogin.dataNascimento', ownerDataNascimento);
    }
  };

  const validateCredentials = () => {
    console.log('Validando credenciais da distribuidora...');
    // TODO: Implementar validação real
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">3</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Login da Distribuidora</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-blue-800 text-sm">
          Para a concessionária Equatorial, os dados serão preenchidos automaticamente com as informações do dono da usina.
        </p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={fillFromOwnerData}
          className="mt-2 text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          Preencher com Dados do Dono
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="distributorLogin.uc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade Consumidora *</FormLabel>
              <FormControl>
                <Input placeholder="00000000000000" {...field} />
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
              <FormLabel>{ownerType === 'fisica' ? 'CPF' : 'CNPJ'} *</FormLabel>
              <FormControl>
                <MaskedInput 
                  {...field} 
                  mask={ownerType === 'fisica' ? '999.999.999-99' : '99.999.999/9999-99'}
                  placeholder={ownerType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
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
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="99/99/9999"
                    placeholder="DD/MM/AAAA"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex items-end">
          <Button 
            type="button" 
            onClick={validateCredentials}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Validar Credenciais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratorDistributorLoginForm;
