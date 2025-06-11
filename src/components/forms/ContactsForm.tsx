
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Contact } from '@/types/subscriber';
import { v4 as uuidv4 } from 'uuid';

interface ContactsFormProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

const ContactsForm = ({ contacts, onChange }: ContactsFormProps) => {
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '',
    phone: '',
    role: ''
  });

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        ...newContact,
        id: uuidv4()
      };
      onChange([...contacts, contact]);
      setNewContact({ name: '', phone: '', role: '' });
    }
  };

  const removeContact = (id: string) => {
    onChange(contacts.filter(contact => contact.id !== id));
  };

  const updateContact = (id: string, field: keyof Omit<Contact, 'id'>, value: string) => {
    onChange(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contatos Adicionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de contatos existentes */}
        {contacts.map((contact) => (
          <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <Input
              placeholder="Nome"
              value={contact.name}
              onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
            />
            <MaskedInput
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
              value={contact.phone}
              onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
            />
            <Input
              placeholder="Cargo/Função"
              value={contact.role}
              onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => removeContact(contact.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {/* Formulário para novo contato */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <Input
            placeholder="Nome do contato"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <MaskedInput
            mask="(99) 99999-9999"
            placeholder="(00) 00000-0000"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <Input
            placeholder="Cargo/Função"
            value={newContact.role}
            onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
          />
          <Button
            type="button"
            onClick={addContact}
            disabled={!newContact.name || !newContact.phone}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsForm;
