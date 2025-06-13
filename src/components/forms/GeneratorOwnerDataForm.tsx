
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MaskedInput } from '@/components/ui/masked-input';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import AddressForm from './AddressForm';
import { User, Building2, Phone, Mail } from 'lucide-react';
import { useCepConsistency } from '@/hooks/useCepConsistency';

interface GeneratorOwnerDataFormProps {
  form: UseFormReturn<GeneratorFormData>;
  ownerType: 'fisica' | 'juridica';
}

const GeneratorOwnerDataForm = ({ form, ownerType }: GeneratorOwnerDataFormProps) => {
  const { handleCepLookup } = useCepConsistency();

  const handleOwnerCepFound = (cepData: any) => {
    console.log('📍 [OWNER] Preenchendo endereço do proprietário:', cepData);
    
    if (cepData) {
      form.setValue('owner.address.endereco', cepData.logradouro || '');
      form.setValue('owner.address.bairro', cepData.bairro || '');
      form.setValue('owner.address.cidade', cepData.localidade || '');
      form.setValue('owner.address.estado', cepData.uf || '');
    }
  };

  const handleOwnerCepChange = (cep: string) => {
    form.setValue('owner.address.cep', cep);
    handleCepLookup(cep, handleOwnerCepFound);
  };

  return (
    <div className="space-y-8">
      {/* Identificação */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            {ownerType === 'fisica' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Building2 className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              Identificação do {ownerType === 'fisica' ? 'Proprietário' : 'Empresa'}
            </h3>
            <p className="text-blue-600 text-sm">
              {ownerType === 'fisica' 
                ? 'Dados pessoais do proprietário da geradora' 
                : 'Dados da empresa proprietária da geradora'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="owner.cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  {ownerType === 'fisica' ? 'CPF' : 'CNPJ'} *
                </FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask={ownerType === 'fisica' ? '999.999.999-99' : '99.999.999/9999-99'}
                    placeholder={ownerType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.numeroParceiroNegocio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Número Parceiro de Negócio *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o número" 
                    {...field} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {ownerType === 'fisica' ? (
            <>
              <FormField
                control={form.control}
                name="owner.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nome Completo do Titular *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome completo" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner.dataNascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Data de Nascimento *
                    </FormLabel>
                    <FormControl>
                      <MaskedInput 
                        {...field} 
                        mask="99/99/9999"
                        placeholder="DD/MM/AAAA"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="owner.razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Razão Social *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Razão social da empresa" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner.nomeFantasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nome Fantasia
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome fantasia" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </div>

      {/* Contato */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">Informações de Contato</h3>
            <p className="text-green-600 text-sm">Telefone e e-mail para comunicação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="owner.telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Telefone *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">E-mail *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field} 
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Endereço */}
      <AddressForm 
        form={form} 
        prefix="owner.address" 
        title="Endereço do Proprietário"
        className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100"
        onCepChange={handleOwnerCepChange}
      />

      {/* Observações */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
        <FormField
          control={form.control}
          name="owner.observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-6 bg-amber-500 rounded"></div>
                Observações
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais sobre o proprietário..." 
                  {...field} 
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GeneratorOwnerDataForm;
