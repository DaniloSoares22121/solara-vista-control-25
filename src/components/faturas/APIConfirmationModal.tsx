
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Send, Eye, Percent } from 'lucide-react';

interface APIConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jsonData: any;
  discount: number;
  consumerUnit: string;
}

const APIConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  jsonData, 
  discount,
  consumerUnit 
}: APIConfirmationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const jsonString = JSON.stringify(jsonData, null, 2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            Confirmar Envio para API de Cálculo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Informações principais */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-800">
                Dados que serão enviados
              </h4>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  UC: {consumerUnit}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Percent className="w-3 h-3 mr-1" />
                  Desconto: {discount}%
                </Badge>
              </div>
            </div>
            <p className="text-sm text-blue-700">
              Revise os dados abaixo antes de enviar para o cálculo. O percentual de desconto ({discount}%) 
              configurado para este assinante será aplicado automaticamente.
            </p>
          </div>

          {/* Destaque do Desconto */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Percent className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  Percentual de Desconto Incluído
                </h4>
                <p className="text-sm text-green-700">
                  O JSON contém os campos <code>discount_percentage</code> e <code>applied_discount</code> 
                  com o valor de <strong>{discount}%</strong> configurado para o assinante.
                </p>
              </div>
            </div>
          </div>

          {/* JSON Preview */}
          <div className="flex-1 overflow-hidden">
            <div className="bg-gray-50 rounded-lg border p-4 h-full overflow-auto">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">JSON que será enviado:</span>
              </div>
              <Textarea
                value={jsonString}
                readOnly
                className="font-mono text-xs bg-white border-gray-200 min-h-[300px] resize-none"
              />
            </div>
          </div>

          {/* Alerta */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">
                  Confirme antes de enviar
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Verifique se todos os dados estão corretos, incluindo o percentual de desconto de {discount}%. 
                  Uma vez enviado, o cálculo será processado e poderá gerar custos.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Confirmar e Enviar ({discount}% desconto)
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIConfirmationModal;
