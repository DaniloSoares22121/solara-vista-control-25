
-- Criar tabela para faturas em validação
CREATE TABLE public.faturas_validacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subscriber_id UUID REFERENCES public.subscribers(id),
  uc TEXT NOT NULL,
  documento TEXT NOT NULL,
  data_nascimento TEXT,
  tipo_pessoa TEXT NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  fatura_url TEXT NOT NULL,
  pdf_path TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.faturas_validacao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para faturas_validacao
CREATE POLICY "Users can view their own faturas_validacao" 
  ON public.faturas_validacao 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own faturas_validacao" 
  ON public.faturas_validacao 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own faturas_validacao" 
  ON public.faturas_validacao 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own faturas_validacao" 
  ON public.faturas_validacao 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_faturas_validacao_updated_at
  BEFORE UPDATE ON public.faturas_validacao
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
