
import React, { useState, useEffect, useRef } from 'react';
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
  skipAutoLookup?: boolean; // Opção para pular busca automática
}

export const CnpjInput: React.FC<CnpjInputProps> = ({
  value,
  onChange,
  onCnpjFound,
  placeholder = "00.000.000/0000-00",
  className,
  skipAutoLookup = false
}) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { lookupCnpj, isLoading } = useCnpjLookup();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSearchedRef = useRef<string>('');

  // Debounce reduzido para 1 segundo para ser mais rápido
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, 1000); // Reduzido para 1 segundo

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value]);

  // Buscar dados quando o CNPJ tiver 18 caracteres (formatado) e não estiver carregando
  useEffect(() => {
    const handleCnpjLookup = async () => {
      // Não fazer busca se skipAutoLookup estiver ativo
      if (skipAutoLookup) {
        console.log('🚫 [CNPJ-INPUT] Auto-lookup desabilitado');
        return;
      }

      // Verifica se o CNPJ tem 18 caracteres, não está carregando, não foi pesquisado ainda
      // e é diferente da última pesquisa realizada
      if (
        debouncedValue.length === 18 && 
        !isLoading && 
        !hasSearched && 
        onCnpjFound &&
        lastSearchedRef.current !== debouncedValue
      ) {
        console.log('🔍 [CNPJ-INPUT] Iniciando busca do CNPJ:', debouncedValue);
        setHasSearched(true);
        lastSearchedRef.current = debouncedValue;
        
        const cnpjData = await lookupCnpj(debouncedValue);
        if (cnpjData) {
          onCnpjFound(cnpjData);
        }
      }
    };

    handleCnpjLookup();
  }, [debouncedValue, lookupCnpj, onCnpjFound, isLoading, hasSearched, skipAutoLookup]);

  // Reset hasSearched quando o valor do CNPJ mudar significativamente
  useEffect(() => {
    if (value.length < 18) {
      setHasSearched(false);
    }
  }, [value]);

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
    
    // Se o CNPJ foi alterado, permitir nova busca
    if (formatted !== lastSearchedRef.current) {
      setHasSearched(false);
    }
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
      {!isLoading && value.length >= 14 && !hasSearched && !skipAutoLookup && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
