
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useCepLookup } from '@/hooks/useCepLookup';
import { Loader2, CheckCircle } from 'lucide-react';

interface CepInputProps {
  value: string;
  onChange: (value: string) => void;
  onCepFound?: (cepData: any) => void;
  placeholder?: string;
  className?: string;
}

export const CepInput = ({ 
  value, 
  onChange, 
  onCepFound, 
  placeholder = "00000-000",
  className 
}: CepInputProps) => {
  const { lookupCep, loading, formatCep } = useCepLookup();
  const [lastLookup, setLastLookup] = useState('');
  const [cepFound, setCepFound] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatCep(inputValue);
    const cleanCep = inputValue.replace(/\D/g, '');
    
    onChange(formattedValue);
    setCepFound(false);
    
    // Auto-lookup when CEP is complete and different from last lookup
    if (cleanCep.length === 8 && cleanCep !== lastLookup) {
      setLastLookup(cleanCep);
      console.log('Buscando CEP:', cleanCep);
      try {
        const cepData = await lookupCep(cleanCep);
        console.log('Dados do CEP retornados:', cepData);
        if (cepData && onCepFound) {
          setCepFound(true);
          onCepFound(cepData);
          // Remove o aviso após 3 segundos
          setTimeout(() => setCepFound(false), 3000);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    } else if (cleanCep.length < 8) {
      setLastLookup('');
    }
  };

  return (
    <div className="space-y-2">
      {cepFound && (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
          <CheckCircle className="h-4 w-4" />
          <span>CEP encontrado! Endereço preenchido automaticamente.</span>
        </div>
      )}
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={9}
          className={className}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
          </div>
        )}
      </div>
    </div>
  );
};
