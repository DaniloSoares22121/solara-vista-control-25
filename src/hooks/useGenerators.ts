
import { useState, useEffect } from 'react';
import { supabaseGeneratorService } from '@/services/supabaseGeneratorService';
import { GeneratorFormData } from '@/types/generator';

export const useGenerators = () => {
  const [generators, setGenerators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGenerators = async () => {
    console.log('🔄 [HOOK] Carregando geradoras...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await supabaseGeneratorService.getGenerators();
      setGenerators(data);
      console.log('✅ [HOOK] Geradoras carregadas:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ [HOOK] Erro ao carregar geradoras:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createGenerator = async (generatorData: GeneratorFormData) => {
    console.log('🔄 [HOOK] Criando geradora...', generatorData);
    setError(null);
    
    try {
      const newGenerator = await supabaseGeneratorService.createGenerator(generatorData);
      setGenerators(prev => [newGenerator, ...prev]);
      console.log('✅ [HOOK] Geradora criada com sucesso:', newGenerator);
      return newGenerator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar geradora';
      setError(errorMessage);
      console.error('❌ [HOOK] Erro ao criar geradora:', errorMessage);
      throw err;
    }
  };

  const deleteGenerator = async (id: string) => {
    console.log('🗑️ [HOOK] Excluindo geradora...', id);
    setError(null);
    
    try {
      await supabaseGeneratorService.deleteGenerator(id);
      setGenerators(prev => prev.filter(gen => gen.id !== id));
      console.log('✅ [HOOK] Geradora excluída com sucesso');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir geradora';
      setError(errorMessage);
      console.error('❌ [HOOK] Erro ao excluir geradora:', errorMessage);
      throw err;
    }
  };

  const updateGenerator = async (id: string, generatorData: Partial<GeneratorFormData>) => {
    console.log('🔄 [HOOK] Atualizando geradora...', id, generatorData);
    setError(null);
    
    try {
      const updatedGenerator = await supabaseGeneratorService.updateGenerator(id, generatorData);
      setGenerators(prev => prev.map(gen => gen.id === id ? updatedGenerator : gen));
      console.log('✅ [HOOK] Geradora atualizada com sucesso:', updatedGenerator);
      return updatedGenerator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar geradora';
      setError(errorMessage);
      console.error('❌ [HOOK] Erro ao atualizar geradora:', errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    loadGenerators();
  }, []);

  return {
    generators,
    loading,
    error,
    createGenerator,
    deleteGenerator,
    updateGenerator,
    refreshGenerators: loadGenerators
  };
};
