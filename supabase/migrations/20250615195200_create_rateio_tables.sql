
-- Criar tabela para rateios
CREATE TABLE IF NOT EXISTS public.rateios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  geradora_id TEXT NOT NULL,
  geradora_nome TEXT NOT NULL,
  geradora_uc TEXT NOT NULL,
  data_rateio DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_rateio TEXT NOT NULL CHECK (tipo_rateio IN ('porcentagem', 'prioridade')),
  geracao_esperada NUMERIC NOT NULL DEFAULT 0,
  total_distribuido NUMERIC NOT NULL DEFAULT 0,
  energia_sobra NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pending', 'processed', 'completed')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para itens do rateio
CREATE TABLE IF NOT EXISTS public.rateio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rateio_id UUID NOT NULL REFERENCES public.rateios(id) ON DELETE CASCADE,
  assinante_id TEXT NOT NULL,
  assinante_nome TEXT NOT NULL,
  assinante_uc TEXT NOT NULL,
  consumo_numero NUMERIC NOT NULL DEFAULT 0,
  porcentagem NUMERIC,
  prioridade INTEGER,
  valor_alocado NUMERIC NOT NULL DEFAULT 0,
  is_new BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.rateios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rateio_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para rateios
CREATE POLICY "Users can view their own rateios" 
  ON public.rateios 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rateios" 
  ON public.rateios 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rateios" 
  ON public.rateios 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rateios" 
  ON public.rateios 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para rateio_items
CREATE POLICY "Users can view their own rateio items" 
  ON public.rateio_items 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.rateios 
    WHERE rateios.id = rateio_items.rateio_id 
    AND rateios.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own rateio items" 
  ON public.rateio_items 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.rateios 
    WHERE rateios.id = rateio_items.rateio_id 
    AND rateios.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own rateio items" 
  ON public.rateio_items 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.rateios 
    WHERE rateios.id = rateio_items.rateio_id 
    AND rateios.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own rateio items" 
  ON public.rateio_items 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.rateios 
    WHERE rateios.id = rateio_items.rateio_id 
    AND rateios.user_id = auth.uid()
  ));

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rateios_updated_at
  BEFORE UPDATE ON public.rateios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
