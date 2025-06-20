
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Zap } from 'lucide-react';

interface ConsumoNaoCompensadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  monthReference: string;
}

const ConsumoNaoCompensadoModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  monthReference 
}: ConsumoNaoCompensadoModalProps) => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue) || numericValue <= 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onConfirm(numericValue);
      setValue('');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar consumo não compensado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            Consumo Não Compensado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">
                  Valor não encontrado na fatura
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  O "Consumo Não Compensado" não foi identificado na fatura de <strong>{monthReference}</strong>. 
                  Digite o valor em kWh para continuar.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumoValue">
              Consumo Não Compensado (kWh) *
            </Label>
            <Input
              id="consumoValue"
              type="number"
              placeholder="Ex: 100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
              step="0.01"
              className="text-center text-lg font-medium"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Este valor será usado como padrão para outras faturas do mesmo mês
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!value || parseFloat(value) <= 0 || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Salvando...' : 'Confirmar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsumoNaoCompensadoModal;
