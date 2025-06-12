
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { SubscriberFormData } from '@/types/subscriber';

export const useFormProvider = (formData: SubscriberFormData): UseFormReturn<any> => {
  const form = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const prevFormDataRef = useRef<SubscriberFormData>();

  // Sincronizar valores quando formData mudar - mas evitar loops infinitos
  useEffect(() => {
    // Só atualiza se os dados realmente mudaram
    if (prevFormDataRef.current !== formData) {
      console.log('🔄 Sincronizando formulário com formData:', formData);
      form.reset(formData);
      prevFormDataRef.current = formData;
    }
  }, [formData, form]);

  return form;
};
