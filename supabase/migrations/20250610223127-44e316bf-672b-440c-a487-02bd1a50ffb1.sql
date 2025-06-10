
-- Criar tabela de assinantes
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concessionaria TEXT,
  subscriber JSONB,
  administrator JSONB,
  energy_account JSONB,
  plan_contract JSONB,
  plan_details JSONB,
  notifications JSONB,
  attachments JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios assinantes
CREATE POLICY "Users can view their own subscribers" 
  ON public.subscribers 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários criem seus próprios assinantes
CREATE POLICY "Users can create their own subscribers" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem seus próprios assinantes
CREATE POLICY "Users can update their own subscribers" 
  ON public.subscribers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem seus próprios assinantes
CREATE POLICY "Users can delete their own subscribers" 
  ON public.subscribers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
