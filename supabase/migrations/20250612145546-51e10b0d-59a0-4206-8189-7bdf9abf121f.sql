
-- Criar tabela para faturas emitidas
CREATE TABLE public.faturas_emitidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscriber_id UUID,
  uc TEXT NOT NULL,
  documento TEXT NOT NULL,
  tipo_pessoa TEXT NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  fatura_url TEXT NOT NULL,
  valor_total NUMERIC DEFAULT 0,
  referencia TEXT,
  numero_fatura TEXT,
  data_emissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_vencimento TIMESTAMP WITH TIME ZONE,
  status_pagamento TEXT NOT NULL DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago', 'vencido')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.faturas_emitidas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para faturas emitidas
CREATE POLICY "Users can view their own faturas emitidas" 
  ON public.faturas_emitidas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own faturas emitidas" 
  ON public.faturas_emitidas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own faturas emitidas" 
  ON public.faturas_emitidas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own faturas emitidas" 
  ON public.faturas_emitidas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_faturas_emitidas_updated_at
  BEFORE UPDATE ON public.faturas_emitidas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
