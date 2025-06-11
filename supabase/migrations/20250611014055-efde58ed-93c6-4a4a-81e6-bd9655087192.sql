
-- Criar tabela para representantes
CREATE TABLE public.representatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  region TEXT NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.representatives ENABLE ROW LEVEL SECURITY;

-- Política para visualizar representantes próprios
CREATE POLICY "Users can view their own representatives" 
  ON public.representatives 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para inserir representantes próprios
CREATE POLICY "Users can create their own representatives" 
  ON public.representatives 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para atualizar representantes próprios
CREATE POLICY "Users can update their own representatives" 
  ON public.representatives 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para deletar representantes próprios
CREATE POLICY "Users can delete their own representatives" 
  ON public.representatives 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_representatives
  BEFORE UPDATE ON public.representatives
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
