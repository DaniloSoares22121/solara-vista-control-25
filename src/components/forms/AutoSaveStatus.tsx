
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Clock, AlertTriangle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';

interface AutoSaveStatusProps {
  autoSave: {
    lastSaved: Date | null;
    isAutoSaving: boolean;
    loadFromLocalStorage: () => GeneratorFormData | null;
    clearAutoSave: () => void;
    getAutoSaveInfo: () => { timestamp: Date; hasData: boolean } | null;
  };
  form: UseFormReturn<GeneratorFormData>;
}

export const AutoSaveStatus = ({ autoSave, form }: AutoSaveStatusProps) => {
  const [showRecoveryAlert, setShowRecoveryAlert] = useState(false);
  const [autoSaveInfo, setAutoSaveInfo] = useState<{ timestamp: Date; hasData: boolean } | null>(null);

  useEffect(() => {
    const info = autoSave.getAutoSaveInfo();
    if (info && info.hasData) {
      setAutoSaveInfo(info);
      setShowRecoveryAlert(true);
    }
  }, [autoSave]);

  const handleRecoverData = () => {
    const savedData = autoSave.loadFromLocalStorage();
    if (savedData) {
      form.reset(savedData);
      setShowRecoveryAlert(false);
      console.log('📥 Dados recuperados do auto-save');
    }
  };

  const handleDiscardData = () => {
    autoSave.clearAutoSave();
    setShowRecoveryAlert(false);
    setAutoSaveInfo(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Alerta de Recuperação de Dados */}
      {showRecoveryAlert && autoSaveInfo && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dados salvos automaticamente encontrados!</p>
                <p className="text-sm">
                  Última atualização: {formatTime(autoSaveInfo.timestamp)}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  onClick={handleRecoverData}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Recuperar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDiscardData}
                >
                  Descartar
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Status do Auto-Save */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {autoSave.isAutoSaving ? (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Clock className="w-3 h-3 mr-1" />
              Salvando automaticamente...
            </Badge>
          ) : autoSave.lastSaved ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Save className="w-3 h-3 mr-1" />
              Salvo às {formatTime(autoSave.lastSaved)}
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
              <Clock className="w-3 h-3 mr-1" />
              Auto-save ativo
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
