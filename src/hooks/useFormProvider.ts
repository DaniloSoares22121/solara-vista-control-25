
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import { SubscriberFormData } from '@/types/subscriber';

export const useFormProvider = (formData: SubscriberFormData): UseFormReturn<any> => {
  const form = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  // Sincronizar valores quando formData mudar
  useEffect(() => {
    const currentValues = form.getValues();
    
    // Verificar se precisa atualizar apenas se os valores realmente mudaram
    if (JSON.stringify(currentValues) !== JSON.stringify(formData)) {
      console.log('🔄 Sincronizando formulário com formData:', formData);
      form.reset(formData);
    }
  }, [formData, form]);

  return form;
};
