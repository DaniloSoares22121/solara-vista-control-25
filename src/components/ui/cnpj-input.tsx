
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useCnpjLookup } from '@/hooks/useCnpjLookup';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search } from 'lucide-react';

interface CnpjInputProps {
  value: string;
  onChange: (value: string) => void;
  onCnpjFound?: (cnpjData: any) => void;
  placeholder?: string;
  className?: string;
}

export const CnpjInput: React.FC<CnpjInputProps> = ({
  value,
  onChange,
  onCnpjFound,
  placeholder = "00.000.000/0000-00",
  className
}) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  const { lookupCnpj, isLoading } = useCnpjLookup();

  // Debounce para evitar muitas chamadas à API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 1000);

    return () => clearTimeout(timer);
  }, [value]);

  // Buscar dados quando o CNPJ tiver 18 caracteres (formatado)
  useEffect(() => {
    const handleCnpjLookup = async () => {
      if (debouncedValue.length === 18 && onCnpjFound) {
        const cnpjData = await lookupCnpj(debouncedValue);
        if (cnpjData) {
          onCnpjFound(cnpjData);
        }
      }
    };

    handleCnpjLookup();
  }, [debouncedValue, lookupCnpj, onCnpjFound]);

  const formatCnpj = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCnpj(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        maxLength={18}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {!isLoading && value.length >= 14 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
