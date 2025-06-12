
import { useCallback, useState } from 'react';
import { SubscriberFormData, Contact } from '@/types/subscriber';
import { subscriberService } from '@/services/supabaseSubscriberService';
import { toast } from 'sonner';

export const useSubscriberFormActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addContact = useCallback((formData: SubscriberFormData, setFormData: (data: SubscriberFormData) => void, type: 'personal' | 'company') => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      role: '',
    };

    setFormData({
      ...formData,
      [type === 'personal' ? 'personalData' : 'companyData']: {
        ...formData[type === 'personal' ? 'personalData' : 'companyData'],
        contacts: [
          ...(formData[type === 'personal' ? 'personalData' : 'companyData']?.contacts || []),
          newContact
        ].slice(0, 5) // Máximo 5 contatos
      }
    });

    if ((formData[type === 'personal' ? 'personalData' : 'companyData']?.contacts?.length || 0) >= 5) {
      toast.error('Máximo de 5 contatos permitidos', { duration: 1000 });
    }
  }, []);

  const removeContact = useCallback((formData: SubscriberFormData, setFormData: (data: SubscriberFormData) => void, type: 'personal' | 'company', contactId: string) => {
    const dataKey = type === 'personal' ? 'personalData' : 'companyData';
    const currentData = formData[dataKey];
    
    if (currentData) {
      setFormData({
        ...formData,
        [dataKey]: {
          ...currentData,
          contacts: currentData.contacts?.filter(c => c.id !== contactId) || []
        }
      });
    }
  }, []);

  const submitForm = useCallback(async (formData: SubscriberFormData, subscriberId?: string) => {
    setIsSubmitting(true);
    try {
      console.log('📤 Enviando dados do formulário:', formData);
      
      if (subscriberId) {
        await subscriberService.updateSubscriber(subscriberId, formData);
        toast.success('Assinante atualizado com sucesso!', { duration: 1000 });
      } else {
        await subscriberService.createSubscriber(formData);
        toast.success('Assinante cadastrado com sucesso!', { duration: 1000 });
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar formulário:', error);
      toast.error(subscriberId ? 'Erro ao atualizar assinante. Tente novamente.' : 'Erro ao cadastrar assinante. Tente novamente.', { duration: 3000 });
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    addContact,
    removeContact,
    submitForm
  };
};
