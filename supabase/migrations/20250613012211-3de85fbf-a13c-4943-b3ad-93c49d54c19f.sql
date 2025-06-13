
-- Criar bucket para armazenar PDFs das faturas
INSERT INTO storage.buckets (id, name, public)
VALUES ('faturas', 'faturas', true);

-- Criar tabela para armazenar informações dos PDFs das faturas
CREATE TABLE public.faturas_pdf (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_fatura TEXT NOT NULL,
  pdf_original_url TEXT NOT NULL,
  pdf_customizado_url TEXT,
  pdf_combinado_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Adicionar RLS na tabela faturas_pdf
ALTER TABLE public.faturas_pdf ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas seus próprios PDFs
CREATE POLICY "Users can view their own PDF faturas" 
  ON public.faturas_pdf 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que usuários insiram apenas seus próprios PDFs
CREATE POLICY "Users can create their own PDF faturas" 
  ON public.faturas_pdf 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que usuários atualizem apenas seus próprios PDFs
CREATE POLICY "Users can update their own PDF faturas" 
  ON public.faturas_pdf 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para que usuários deletem apenas seus próprios PDFs
CREATE POLICY "Users can delete their own PDF faturas" 
  ON public.faturas_pdf 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar políticas para o storage bucket faturas
CREATE POLICY "Users can upload their own PDF files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'faturas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own PDF files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'faturas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own PDF files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'faturas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDF files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'faturas' AND auth.uid()::text = (storage.foldername(name))[1]);
