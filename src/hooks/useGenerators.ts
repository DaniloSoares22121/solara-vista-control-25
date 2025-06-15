
import { useState, useEffect, useRef } from 'react';
import { supabaseGeneratorService } from '@/services/supabaseGeneratorService';
import { GeneratorFormData } from '@/types/generator';
import { supabase } from '@/integrations/supabase/client';

export const useGenerators = () => {
  const [generators, setGenerators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

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
      console.log('✅ [HOOK] Geradora criada com sucesso:', newGenerator);
      
      // NÃO adicionar localmente aqui - deixar o realtime fazer isso
      // O realtime vai capturar o INSERT e adicionar automaticamente
      
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
      // NÃO remover localmente aqui - deixar o realtime fazer isso
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
      // NÃO atualizar localmente aqui - deixar o realtime fazer isso
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

    // Cleanup any existing channel before creating a new one
    if (channelRef.current) {
      console.log('🔄 [REALTIME] Removendo canal existente antes de criar novo');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create a unique channel name
    const channelName = `generators-changes-${Date.now()}-${Math.random()}`;
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
          setGenerators(prev => {
            // Verificar se a geradora já existe na lista
            const exists = prev.some(gen => gen.id === payload.new.id);
            if (!exists) {
              console.log('📝 [REALTIME] Adicionando nova geradora à lista');
              return [payload.new, ...prev];
            }
            console.log('⚠️ [REALTIME] Geradora já existe na lista, ignorando');
            return prev;
          });
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
          setGenerators(prev => {
            const updated = prev.map(gen => gen.id === payload.new.id ? payload.new : gen);
            console.log('📝 [REALTIME] Lista atualizada após UPDATE');
            return updated;
          });
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
          setGenerators(prev => {
            const filtered = prev.filter(gen => gen.id !== payload.old.id);
            console.log('📝 [REALTIME] Lista atualizada após DELETE');
            return filtered;
          });
        }
      );

    // Store the channel reference
    channelRef.current = channel;

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('✅ [REALTIME] Status da inscrição:', status);
      if (status === 'SUBSCRIBED') {
        console.log('🔔 [REALTIME] Canal inscrito com sucesso, realtime ativo!');
      }
    });

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('🔄 [REALTIME] Removendo canal:', channelName);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once

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
