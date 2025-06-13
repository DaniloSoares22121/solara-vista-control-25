
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, ExternalLink, FileText, CheckCircle2, Save } from 'lucide-react';

interface FaturaPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  uc: string;
  documento: string;
  isSavedToValidation?: boolean;
  subscriberName?: string;
}

const FaturaPDFViewer: React.FC<FaturaPDFViewerProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  uc,
  documento,
  isSavedToValidation = false,
  subscriberName
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `fatura_combinada_${uc}_${documento}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Fatura Processada - UC: {uc}
                </DialogTitle>
                {subscriberName && (
                  <p className="text-green-600 font-medium flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Assinante: {subscriberName}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isSavedToValidation && (
                <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2">
                  <Save className="w-4 h-4 mr-2" />
                  Salvo em Validação
                </Badge>
              )}
              
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Baixar
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Nova Aba
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white border border-green-200 rounded-xl shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">UC:</span>
                <span className="ml-2 font-semibold">{uc}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Documento:</span>
                <span className="ml-2 font-semibold">{documento}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tipo:</span>
                <span className="ml-2 font-semibold">PDF Combinado</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                  Processado
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6">
          <div className="w-full h-[75vh] border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title={`Fatura Combinada ${uc}`}
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaturaPDFViewer;
