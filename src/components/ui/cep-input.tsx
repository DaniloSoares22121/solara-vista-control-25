
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useCepLookup } from '@/hooks/useCepLookup';
import { Loader2 } from 'lucide-react';

interface CepInputProps {
  value: string;
  onChange: (value: string) => void;
  onCepFound?: (cep: string) => void;
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatCep(inputValue);
    const cleanCep = inputValue.replace(/\D/g, '');
    
    onChange(formattedValue);
    
    // Auto-lookup when CEP is complete and different from last lookup
    if (cleanCep.length === 8 && cleanCep !== lastLookup) {
      setLastLookup(cleanCep);
      console.log('Buscando CEP:', cleanCep);
      try {
        const cepData = await lookupCep(cleanCep);
        console.log('Dados do CEP retornados:', cepData);
        if (cepData && onCepFound) {
          onCepFound(cleanCep);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    } else if (cleanCep.length < 8) {
      setLastLookup('');
    }
  };

  return (
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
  );
};
