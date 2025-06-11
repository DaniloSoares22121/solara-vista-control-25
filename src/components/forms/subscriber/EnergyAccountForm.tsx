
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaskedInput } from '@/components/ui/masked-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { EnergyAccount, Address } from '@/types/subscriber';
import AddressForm from '../AddressForm';
import { Zap, User, Building, Copy, CheckCircle, Calendar, Hash, FileText, MapPin } from 'lucide-react';

interface EnergyAccountFormProps {
  data: EnergyAccount;
  onUpdate: (data: Partial<EnergyAccount>) => void;
  onCepLookup: (cep: string) => Promise<void>;
  onAutoFill: () => void;
  form: UseFormReturn<any>;
}

const EnergyAccountForm = ({ data, onUpdate, onCepLookup, onAutoFill, form }: EnergyAccountFormProps) => {
  const handleAddressChange = (addressUpdate: Partial<Address>) => {
    const currentAddress = data.address || {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };
    
    const newAddress = { ...currentAddress, ...addressUpdate };
    onUpdate({ address: newAddress });
  };

  const handleCepChange = async (cep: string) => {
    if (cep.replace(/\D/g, '').length === 8) {
      await onCepLookup(cep);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header com ação de auto-preenchimento */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-amber-900">4. Conta de Energia</CardTitle>
                <p className="text-amber-700 mt-1">Dados da conta de energia elétrica</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={onAutoFill}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Copy className="w-5 h-5 mr-2" />
              Preencher com Dados do Assinante
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tipo de Titular */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <User className="w-5 h-5" />
            <span>Tipo de Titular</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <FormField
            control={form.control}
            name="energyAccount.holderType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onUpdate({ holderType: value as 'person' | 'company' });
                    }}
                    className="grid grid-cols-2 gap-6"
                  >
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                      <RadioGroupItem value="person" id="person-holder" />
                      <Label htmlFor="person-holder" className="flex items-center space-x-2 cursor-pointer">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Pessoa Física</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                      <RadioGroupItem value="company" id="company-holder" />
                      <Label htmlFor="company-holder" className="flex items-center space-x-2 cursor-pointer">
                        <Building className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Pessoa Jurídica</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Dados do Titular */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <FileText className="w-5 h-5" />
            <span>Dados do Titular</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="energyAccount.uc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Unidade Consumidora *</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Digite a UC"
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-200"
                      onChange={(e) => {
                        field.onChange(e);
                        onUpdate({ uc: e.target.value });
                      }}
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
                  <FormLabel className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>{data.holderType === 'person' ? 'CPF' : 'CNPJ'} *</span>
                  </FormLabel>
                  <FormControl>
                    <MaskedInput 
                      {...field} 
                      mask={data.holderType === 'person' ? '999.999.999-99' : '99.999.999/9999-99'}
                      placeholder={data.holderType === 'person' ? '000.000.000-00' : '00.000.000/0000-00'}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-200"
                      onChange={(e) => {
                        field.onChange(e);
                        onUpdate({ cpfCnpj: e.target.value });
                      }}
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
                  <FormLabel className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nome do Titular *</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Digite o nome completo"
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-200"
                      onChange={(e) => {
                        field.onChange(e);
                        onUpdate({ holderName: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {data.holderType === 'person' && (
              <FormField
                control={form.control}
                name="energyAccount.birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Data de Nascimento</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="date"
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-200"
                        onChange={(e) => {
                          field.onChange(e);
                          onUpdate({ birthDate: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="energyAccount.partnerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Número do Parceiro</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Digite o número do parceiro"
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-200"
                      onChange={(e) => {
                        field.onChange(e);
                        onUpdate({ partnerNumber: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <MapPin className="w-5 h-5" />
            <span>Endereço da Unidade Consumidora</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AddressForm 
            form={form} 
            prefix="energyAccount.address" 
            title=""
            onCepChange={handleCepChange}
            onAddressChange={handleAddressChange}
            className="space-y-6"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyAccountForm;
