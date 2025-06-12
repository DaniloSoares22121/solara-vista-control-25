
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ExternalLink } from 'lucide-react';

interface FaturaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  faturaUrl: string;
  documento: string;
  uc: string;
}

const FaturaViewModal: React.FC<FaturaViewModalProps> = ({
  isOpen,
  onClose,
  faturaUrl,
  documento,
  uc
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = faturaUrl;
    link.download = `fatura_${uc}_${documento}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(faturaUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Visualizar Fatura - UC: {uc}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Baixar
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir em nova aba
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6">
          <div className="w-full h-[70vh] border rounded-lg overflow-hidden">
            <iframe
              src={faturaUrl}
              className="w-full h-full"
              title={`Fatura ${uc}`}
              style={{ border: 'none' }}
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">UC:</span>
                <span className="ml-2">{uc}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Documento:</span>
                <span className="ml-2">{documento}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaturaViewModal;
