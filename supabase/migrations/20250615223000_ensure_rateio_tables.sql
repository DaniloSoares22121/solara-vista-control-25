
-- Drop tables if they exist to recreate them properly
DROP TABLE IF EXISTS public.rateio_items CASCADE;
DROP TABLE IF EXISTS public.rateios CASCADE;

-- Create rateios table
CREATE TABLE public.rateios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  geradora_id TEXT NOT NULL,
  geradora_nome TEXT NOT NULL,
  geradora_uc TEXT NOT NULL,
  data_rateio DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_rateio TEXT NOT NULL CHECK (tipo_rateio IN ('porcentagem', 'prioridade')),
  geracao_esperada NUMERIC DEFAULT 0,
  total_distribuido NUMERIC DEFAULT 0,
  energia_sobra NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pending', 'processed', 'completed')),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rateio_items table
CREATE TABLE public.rateio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rateio_id UUID NOT NULL REFERENCES public.rateios(id) ON DELETE CASCADE,
  assinante_id TEXT NOT NULL,
  assinante_nome TEXT NOT NULL,
  assinante_uc TEXT NOT NULL,
  consumo_numero NUMERIC DEFAULT 0,
  porcentagem NUMERIC,
  prioridade INTEGER,
  valor_alocado NUMERIC DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rateios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rateio_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rateios
CREATE POLICY "rateios_user_access" ON public.rateios
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for rateio_items
CREATE POLICY "rateio_items_user_access" ON public.rateio_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rateios 
      WHERE rateios.id = rateio_items.rateio_id 
      AND rateios.user_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rateios_updated_at
  BEFORE UPDATE ON public.rateios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.rateios TO authenticated;
GRANT ALL ON public.rateio_items TO authenticated;
