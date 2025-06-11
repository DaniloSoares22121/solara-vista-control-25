
import { supabase } from '@/integrations/supabase/client';
import { Representative, RepresentativeFormData } from '@/types/representative';

export const representativeService = {
  // Buscar todos os representantes do usuário
  async getRepresentatives(): Promise<Representative[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('representatives')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar representantes:', error);
      throw error;
    }

    return data || [];
  },

  // Criar novo representante
  async createRepresentative(representativeData: RepresentativeFormData): Promise<Representative> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('representatives')
      .insert({
        ...representativeData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar representante:', error);
      throw error;
    }

    return data;
  },

  // Atualizar representante
  async updateRepresentative(id: string, representativeData: Partial<RepresentativeFormData>): Promise<Representative> {
    const { data, error } = await supabase
      .from('representatives')
      .update(representativeData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar representante:', error);
      throw error;
    }

    return data;
  },

  // Deletar representante
  async deleteRepresentative(id: string): Promise<void> {
    const { error } = await supabase
      .from('representatives')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar representante:', error);
      throw error;
    }
  }
};
