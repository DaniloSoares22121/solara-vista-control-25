
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MaskedInput } from '@/components/ui/masked-input';
import { Plus, Trash2 } from 'lucide-react';
import { Contact } from '@/types/subscriber';
import { UseFormReturn } from 'react-hook-form';

interface ContactsSectionProps {
  contacts: Contact[];
  onAddContact: () => void;
  onRemoveContact: (contactId: string) => void;
  form: UseFormReturn<any>;
  fieldPrefix: string;
}

const ContactsSection = ({ 
  contacts, 
  onAddContact, 
  onRemoveContact, 
  form,
  fieldPrefix 
}: ContactsSectionProps) => {
  const roleOptions = [
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'responsavel-legal', label: 'Responsável Legal' },
    { value: 'operacional', label: 'Operacional' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'outro', label: 'Outro' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-gray-900">Contatos Adicionais</h4>
        {contacts.length < 5 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddContact}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Contato</span>
          </Button>
        )}
      </div>

      {contacts.map((contact, index) => (
        <div key={contact.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-700">Contato {index + 1}</h5>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveContact(contact.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`${fieldPrefix}.contacts.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o nome" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${fieldPrefix}.contacts.${index}.phone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
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
              name={`${fieldPrefix}.contacts.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      {contacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum contato adicional cadastrado.</p>
          <p className="text-sm">Clique em "Adicionar Contato" para incluir um novo contato.</p>
        </div>
      )}
    </div>
  );
};

export default ContactsSection;
