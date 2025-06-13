
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '@/integrations/supabase/client';

export interface FaturaPDFData {
  id: string;
  numero_fatura: string;
  pdf_original_url: string;
  pdf_customizado_url: string | null;
  pdf_combinado_url: string;
  created_at: string;
  user_id: string;
}

export const generateCustomPDF = async (elementId: string): Promise<Uint8Array> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento não encontrado para gerar PDF');
  }

  // Captura o elemento como canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    height: element.scrollHeight,
    width: element.scrollWidth
  });

  // Cria PDF com jsPDF
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Adiciona primeira página
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Adiciona páginas extras se necessário
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return new Uint8Array(pdf.output('arraybuffer'));
};

export const combinePDFs = async (originalPdfUrl: string, customPdfBytes: Uint8Array): Promise<Uint8Array> => {
  try {
    // Baixa o PDF original
    const originalResponse = await fetch(originalPdfUrl);
    if (!originalResponse.ok) {
      throw new Error('Erro ao baixar PDF original');
    }
    const originalPdfBytes = await originalResponse.arrayBuffer();

    // Cria documentos PDF
    const originalPdf = await PDFDocument.load(originalPdfBytes);
    const customPdf = await PDFDocument.load(customPdfBytes);
    const combinedPdf = await PDFDocument.create();

    // Adiciona páginas do PDF customizado primeiro
    const customPages = await combinedPdf.copyPages(customPdf, customPdf.getPageIndices());
    customPages.forEach((page) => combinedPdf.addPage(page));

    // Adiciona páginas do PDF original
    const originalPages = await combinedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
    originalPages.forEach((page) => combinedPdf.addPage(page));

    return new Uint8Array(await combinedPdf.save());
  } catch (error) {
    console.error('Erro ao combinar PDFs:', error);
    throw error;
  }
};

export const uploadPDFToStorage = async (pdfBytes: Uint8Array, fileName: string): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const filePath = `${user.user.id}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('faturas')
    .upload(filePath, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    console.error('Erro ao fazer upload do PDF:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('faturas')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

export const saveFaturaPDF = async (faturaData: Omit<FaturaPDFData, 'id' | 'created_at' | 'user_id'>): Promise<FaturaPDFData> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('faturas_pdf')
    .insert({
      ...faturaData,
      user_id: user.user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar fatura no banco:', error);
    throw error;
  }

  return data;
};

export const getFaturaPDF = async (numeroFatura: string): Promise<FaturaPDFData | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('faturas_pdf')
    .select('*')
    .eq('numero_fatura', numeroFatura)
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar fatura no banco:', error);
    throw error;
  }

  return data;
};
