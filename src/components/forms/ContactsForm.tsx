
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Contact } from '@/types/subscriber';

interface ContactsFormProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

const ContactsForm = ({ contacts, onChange }: ContactsFormProps) => {
  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      role: ''
    };
    onChange([...contacts, newContact]);
  };

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    const updated = contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    );
    onChange(updated);
  };

  const removeContact = (id: string) => {
    onChange(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Contatos</h4>
        <Button type="button" variant="outline" size="sm" onClick={addContact}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Contato
        </Button>
      </div>

      {contacts.map((contact, index) => (
        <Card key={contact.id} className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium">Contato {index + 1}</h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeContact(contact.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Nome do contato"
                value={contact.name}
                onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
              />
              <Input
                placeholder="Telefone"
                value={contact.phone}
                onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
              />
              <Input
                placeholder="Função"
                value={contact.role}
                onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {contacts.length === 0 && (
        <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <p>Nenhum contato adicionado</p>
          <p className="text-sm">Clique em "Adicionar Contato" para começar</p>
        </div>
      )}
    </div>
  );
};

export default ContactsForm;
