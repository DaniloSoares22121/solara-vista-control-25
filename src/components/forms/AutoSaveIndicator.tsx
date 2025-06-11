
import React from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  status: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date;
}

const AutoSaveIndicator = ({ status, lastSaved }: AutoSaveIndicatorProps) => {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Save className="w-4 h-4 animate-pulse text-blue-500" />;
      case 'saved':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'saving':
        return 'Salvando automaticamente...';
      case 'saved':
        return lastSaved ? `Salvo às ${lastSaved.toLocaleTimeString()}` : 'Dados salvos';
      case 'error':
        return 'Erro ao salvar automaticamente';
      default:
        return '';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm px-3 py-1 rounded-full transition-all duration-200",
      status === 'saving' && "bg-blue-50 text-blue-700",
      status === 'saved' && "bg-green-50 text-green-700",
      status === 'error' && "bg-red-50 text-red-700"
    )}>
      {getIcon()}
      <span>{getMessage()}</span>
    </div>
  );
};

export default AutoSaveIndicator;
