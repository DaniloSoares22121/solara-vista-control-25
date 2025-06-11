
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { AdministratorData } from '@/types/subscriber';
import AddressForm from './AddressForm';

interface DadosAdministradorFormProps {
  administrator?: AdministratorData;
  onChange: (administrator: AdministratorData | undefined) => void;
}

const defaultAdministrator: AdministratorData = {
  cpf: '',
  nome: '',
  dataNascimento: '',
  estadoCivil: '',
  profissao: '',
  address: {
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  },
  telefone: '',
  email: '',
};

const DadosAdministradorForm = ({ administrator, onChange }: DadosAdministradorFormProps) => {
  const form = useForm({
    defaultValues: administrator || defaultAdministrator,
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  // Atualizar dados quando form mudar
  useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  // Atualizar form quando administrator mudar
  useEffect(() => {
    if (administrator) {
      form.reset(administrator);
    }
  }, [administrator, form]);

  return (
    <div className="space-y-6 border-t pt-6">
      <h4 className="text-md font-semibold">Dados do Administrador da Pessoa Jurídica</h4>
      
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF do Administrador *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="999.999.999-99" 
                    placeholder="000.000.000-00" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Administrador *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o nome completo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estadoCivil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado Civil *</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profissao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissão *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite a profissão" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <MaskedInput 
                    {...field} 
                    mask="(99) 99999-9999" 
                    placeholder="(00) 00000-0000" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="email@exemplo.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <AddressForm form={form} prefix="address" title="Endereço Residencial do Administrador" />
      </Form>
    </div>
  );
};

export default DadosAdministradorForm;
