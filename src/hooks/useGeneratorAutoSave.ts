
import { useState, useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { useDebounce } from '@/hooks/useDebounce';

export const useGeneratorAutoSave = (form: UseFormReturn<GeneratorFormData>) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const formData = form.watch();
  const debouncedFormData = useDebounce(formData, 2000); // Auto-save a cada 2 segundos de inatividade

  const saveToLocalStorage = useCallback((data: GeneratorFormData) => {
    try {
      setIsAutoSaving(true);
      const saveKey = `generator-form-autosave-${Date.now()}`;
      const existingKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('generator-form-autosave-')
      );
      
      // Manter apenas os últimos 3 auto-saves
      if (existingKeys.length >= 3) {
        existingKeys.sort();
        existingKeys.slice(0, -2).forEach(key => localStorage.removeItem(key));
      }
      
      localStorage.setItem(saveKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));
      
      setLastSaved(new Date());
      console.log('✅ [AUTO-SAVE] Dados salvos automaticamente');
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao salvar:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, []);

  const loadFromLocalStorage = useCallback((): GeneratorFormData | null => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('generator-form-autosave-')
      );
      
      if (keys.length === 0) return null;
      
      // Pegar o save mais recente
      keys.sort();
      const latestKey = keys[keys.length - 1];
      const saved = localStorage.getItem(latestKey);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📥 [AUTO-SAVE] Dados recuperados do auto-save');
        return parsed.data;
      }
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao carregar dados salvos:', error);
    }
    return null;
  }, []);

  const clearAutoSave = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('generator-form-autosave-')
      );
      keys.forEach(key => localStorage.removeItem(key));
      console.log('🗑️ [AUTO-SAVE] Auto-save limpo');
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao limpar auto-save:', error);
    }
  }, []);

  const getAutoSaveInfo = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('generator-form-autosave-')
      );
      
      if (keys.length === 0) return null;
      
      keys.sort();
      const latestKey = keys[keys.length - 1];
      const saved = localStorage.getItem(latestKey);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          timestamp: new Date(parsed.timestamp),
          hasData: true
        };
      }
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao obter info do auto-save:', error);
    }
    return null;
  }, []);

  // Auto-save quando dados mudarem
  useEffect(() => {
    if (debouncedFormData && Object.keys(debouncedFormData).length > 0) {
      // Verificar se há dados suficientes para justificar o auto-save
      const hasSignificantData = debouncedFormData.owner?.name || 
                                debouncedFormData.owner?.cpfCnpj || 
                                debouncedFormData.plants?.length > 0;
      
      if (hasSignificantData) {
        saveToLocalStorage(debouncedFormData);
      }
    }
  }, [debouncedFormData, saveToLocalStorage]);

  return {
    lastSaved,
    isAutoSaving,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearAutoSave,
    getAutoSaveInfo
  };
};
