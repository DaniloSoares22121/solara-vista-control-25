import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

interface GeneratorDistributorLoginFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorDistributorLoginForm = ({ form }: GeneratorDistributorLoginFormProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

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

  const validateCredentials = async () => {
    const uc = form.getValues('distributorLogin.uc');
    const cpfCnpj = form.getValues('distributorLogin.cpfCnpj');
    const dataNascimento = form.getValues('distributorLogin.dataNascimento');

    if (!uc || !cpfCnpj) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha UC e CPF/CNPJ antes de validar.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se data de nascimento é obrigatória para CPF
    const isCpf = cpfCnpj.replace(/\D/g, '').length === 11;
    if (isCpf && !dataNascimento) {
      toast({
        title: "Data de nascimento obrigatória",
        description: "Para CPF, a data de nascimento é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const requestBody: any = {
        uc: uc,
        documento: cpfCnpj,
      };

      // Adicionar data de nascimento se for CPF
      if (isCpf && dataNascimento) {
        requestBody.data_nascimento = dataNascimento;
      }

      // Usar a edge function do Supabase ao invés de fazer requisição direta
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase.functions.invoke('verificar-credenciais', {
        body: requestBody
      });

      if (error) {
        throw error;
      }

      if (data.status === 'success' && data.result === true) {
        setValidationResult({
          isValid: true,
          message: data.message || 'Credenciais validadas com sucesso!',
        });
        toast({
          title: "Sucesso!",
          description: "Credenciais validadas com sucesso.",
        });
      } else {
        setValidationResult({
          isValid: false,
          message: data.message || 'Falha na validação das credenciais.',
        });
        toast({
          title: "Falha na validação",
          description: data.message || 'Credenciais inválidas.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao validar credenciais:', error);
      setValidationResult({
        isValid: false,
        message: 'Erro de conexão com o servidor.',
      });
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar com o servidor de validação.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
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
            disabled={isValidating}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Validar Credenciais
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resultado da Validação */}
      {validationResult && (
        <div className={`p-4 rounded-lg border ${
          validationResult.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              validationResult.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationResult.isValid ? 'Credenciais válidas!' : 'Erro na validação'}
            </span>
          </div>
          <p className={`mt-1 text-sm ${
            validationResult.isValid ? 'text-green-700' : 'text-red-700'
          }`}>
            {validationResult.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneratorDistributorLoginForm;
