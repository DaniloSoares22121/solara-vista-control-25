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
  console.log('🎨 [PDF] Gerando PDF customizado...');
  
  // Buscar o elemento real na página
  let element = document.getElementById(elementId);
  
  if (!element) {
    console.error('❌ [PDF] Elemento não encontrado:', elementId);
    throw new Error(`Elemento ${elementId} não encontrado na página`);
  }

  console.log('✅ [PDF] Elemento encontrado, configurando para captura...');

  // Garantir que o elemento esteja completamente visível
  element.scrollIntoView({ behavior: 'instant', block: 'start' });
  
  // Aguardar um pouco para garantir que o scroll seja aplicado
  await new Promise(resolve => setTimeout(resolve, 100));

  // Configurações para garantir captura precisa
  const originalStyle = {
    position: element.style.position,
    visibility: element.style.visibility,
    transform: element.style.transform,
    left: element.style.left,
    top: element.style.top,
    zIndex: element.style.zIndex
  };

  // Preparar elemento para captura otimizada
  element.style.position = 'static';
  element.style.visibility = 'visible';
  element.style.transform = 'none';
  element.style.left = 'auto';
  element.style.top = 'auto';
  element.style.zIndex = '9999';

  try {
    console.log('📷 [PDF] Capturando elemento como canvas...');
    
    // Aguardar um pouco mais para garantir que os estilos sejam aplicados
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Capturar o elemento com configurações otimizadas para A4
    const canvas = await html2canvas(element, {
      scale: 3, // Maior resolução para melhor qualidade
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      ignoreElements: (el) => {
        // Ignorar elementos que podem causar problemas
        return el.classList.contains('print:hidden') || 
               el.tagName === 'SCRIPT' || 
               el.tagName === 'STYLE';
      },
      onclone: (clonedDoc, clonedElement) => {
        // Garantir que o elemento clonado tenha os mesmos estilos
        const clonedTarget = clonedDoc.getElementById(elementId);
        if (clonedTarget) {
          clonedTarget.style.position = 'static';
          clonedTarget.style.visibility = 'visible';
          clonedTarget.style.transform = 'none';
          clonedTarget.style.left = 'auto';
          clonedTarget.style.top = 'auto';
          clonedTarget.style.margin = '0';
          clonedTarget.style.padding = '0';
          
          // Garantir que todas as fontes sejam carregadas
          const fonts = clonedDoc.querySelectorAll('*');
          fonts.forEach(el => {
            const computedStyle = window.getComputedStyle(el as Element);
            (el as HTMLElement).style.fontFamily = computedStyle.fontFamily;
            (el as HTMLElement).style.fontSize = computedStyle.fontSize;
            (el as HTMLElement).style.fontWeight = computedStyle.fontWeight;
          });
        }
      }
    });

    console.log('📄 [PDF] Canvas capturado, criando PDF...');

    // Criar PDF otimizado para A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2
    });

    // Converter canvas para imagem de alta qualidade
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Dimensões A4 em mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calcular dimensões da imagem mantendo proporção
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    console.log(`📐 [PDF] Dimensões: Canvas(${canvas.width}x${canvas.height}) -> PDF(${imgWidth}x${imgHeight}mm)`);
    
    // Se a imagem for maior que uma página, dividir em páginas
    if (imgHeight <= pdfHeight) {
      // Imagem cabe em uma página
      const yOffset = (pdfHeight - imgHeight) / 2; // Centralizar verticalmente
      pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, imgHeight);
    } else {
      // Imagem precisa ser dividida em páginas
      let yPosition = 0;
      let remainingHeight = imgHeight;
      let pageNum = 1;
      
      while (remainingHeight > 0) {
        const pageHeight = Math.min(pdfHeight, remainingHeight);
        const sourceY = (yPosition / imgHeight) * canvas.height;
        const sourceHeight = (pageHeight / imgHeight) * canvas.height;
        
        if (pageNum > 1) {
          pdf.addPage();
        }
        
        // Criar um canvas temporário para esta seção
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          const tempImgData = tempCanvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(tempImgData, 'JPEG', 0, 0, imgWidth, pageHeight);
        }
        
        yPosition += pageHeight;
        remainingHeight -= pageHeight;
        pageNum++;
      }
    }

    console.log('✅ [PDF] PDF customizado criado com sucesso');
    return new Uint8Array(pdf.output('arraybuffer'));

  } finally {
    // Restaurar estilos originais
    element.style.position = originalStyle.position;
    element.style.visibility = originalStyle.visibility;
    element.style.transform = originalStyle.transform;
    element.style.left = originalStyle.left;
    element.style.top = originalStyle.top;
    element.style.zIndex = originalStyle.zIndex;
  }
};

export const combinePDFs = async (originalPdfUrl: string, customPdfBytes: Uint8Array): Promise<Uint8Array> => {
  try {
    console.log('🔗 [PDF] Iniciando combinação de PDFs...');
    
    // Baixa o PDF original
    const originalResponse = await fetch(originalPdfUrl);
    if (!originalResponse.ok) {
      throw new Error('Erro ao baixar PDF original');
    }
    const originalPdfBytes = await originalResponse.arrayBuffer();
    console.log('📥 [PDF] PDF original baixado');

    // Cria documentos PDF
    const originalPdf = await PDFDocument.load(originalPdfBytes);
    const customPdf = await PDFDocument.load(customPdfBytes);
    const combinedPdf = await PDFDocument.create();

    console.log('📄 [PDF] Adicionando páginas customizadas...');
    // Adiciona páginas do PDF customizado primeiro
    const customPages = await combinedPdf.copyPages(customPdf, customPdf.getPageIndices());
    customPages.forEach((page) => combinedPdf.addPage(page));

    console.log('📄 [PDF] Adicionando páginas originais...');
    // Adiciona páginas do PDF original
    const originalPages = await combinedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
    originalPages.forEach((page) => combinedPdf.addPage(page));

    console.log('✅ [PDF] PDFs combinados com sucesso');
    return new Uint8Array(await combinedPdf.save());
  } catch (error) {
    console.error('❌ [PDF] Erro ao combinar PDFs:', error);
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
