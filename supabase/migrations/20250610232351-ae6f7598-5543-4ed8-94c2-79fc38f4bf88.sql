
-- Criar tabela para geradoras
CREATE TABLE public.generators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  concessionaria TEXT NOT NULL,
  owner JSONB NOT NULL,
  administrator JSONB,
  plants JSONB NOT NULL,
  distributor_login JSONB NOT NULL,
  payment_data JSONB NOT NULL,
  attachments JSONB,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS)
ALTER TABLE public.generators ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias geradoras
CREATE POLICY "Users can view their own generators" 
  ON public.generators 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias geradoras
CREATE POLICY "Users can create their own generators" 
  ON public.generators 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias geradoras
CREATE POLICY "Users can update their own generators" 
  ON public.generators 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias geradoras
CREATE POLICY "Users can delete their own generators" 
  ON public.generators 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at 
  BEFORE UPDATE ON public.generators 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
