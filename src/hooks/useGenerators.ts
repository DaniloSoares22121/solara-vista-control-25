
import { useState, useEffect } from 'react';
import { supabaseGeneratorService } from '@/services/supabaseGeneratorService';
import { GeneratorFormData } from '@/types/generator';
import { supabase } from '@/integrations/supabase/client';

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
      // Não adicionar manualmente - deixar o realtime fazer isso
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
      // Não remover manualmente - deixar o realtime fazer isso
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
      // Não atualizar manualmente - deixar o realtime fazer isso
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

    // Criar um canal único com timestamp para evitar conflitos
    const channelName = `generators-changes-${Date.now()}`;
    console.log('🔄 [REALTIME] Criando canal:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generators'
        },
        (payload) => {
          console.log('✅ [REALTIME] Nova geradora inserida:', payload.new);
          setGenerators(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generators'
        },
        (payload) => {
          console.log('✅ [REALTIME] Geradora atualizada:', payload.new);
          setGenerators(prev => prev.map(gen => gen.id === payload.new.id ? payload.new : gen));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'generators'
        },
        (payload) => {
          console.log('✅ [REALTIME] Geradora excluída:', payload.old);
          setGenerators(prev => prev.filter(gen => gen.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        console.log('✅ [REALTIME] Status da inscrição:', status);
      });

    // Cleanup function para remover o canal quando o componente for desmontado
    return () => {
      console.log('🔄 [REALTIME] Removendo canal:', channelName);
      supabase.removeChannel(channel);
    };
  }, []); // Array de dependências vazio para executar apenas uma vez

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
