
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ data, onSave, delay = 2000, enabled = true }: UseAutoSaveOptions) => {
  const [status, setStatus] = useState<'saving' | 'saved' | 'error' | 'idle'>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  const debouncedData = useDebounce(data, delay);
  const initialRender = useRef(true);

  useEffect(() => {
    if (!enabled || initialRender.current) {
      initialRender.current = false;
      return;
    }

    const saveData = async () => {
      try {
        setStatus('saving');
        await onSave(debouncedData);
        setStatus('saved');
        setLastSaved(new Date());
        
        // Reset to idle after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } catch (error) {
        console.error('Auto-save error:', error);
        setStatus('error');
        
        // Reset to idle after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      }
    };

    saveData();
  }, [debouncedData, onSave, enabled]);

  return { status, lastSaved };
};
