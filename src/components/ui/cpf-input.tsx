
import React, { useState, useEffect, useRef } from 'react';
import { MaskedInput } from '@/components/ui/masked-input';
import { useCpfLookup } from '@/hooks/useCpfLookup';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search } from 'lucide-react';

interface CpfInputProps {
  value: string;
  onChange: (value: string) => void;
  onCpfFound?: (cpfData: any) => void;
  placeholder?: string;
  className?: string;
  birthDate?: string; // Data de nascimento para melhorar a consulta
  skipAutoLookup?: boolean; // Opção para pular busca automática
}

export const CpfInput: React.FC<CpfInputProps> = ({
  value,
  onChange,
  onCpfFound,
  placeholder = "000.000.000-00",
  className,
  birthDate,
  skipAutoLookup = false
}) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { lookupCpf, isLoading } = useCpfLookup();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSearchedRef = useRef<string>('');

  // Debounce reduzido para 1 segundo para ser mais rápido
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, 1000); // Reduzido de 2000ms para 1000ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value]);

  // Buscar dados quando o CPF tiver 14 caracteres (formatado) e não estiver carregando
  useEffect(() => {
    const handleCpfLookup = async () => {
      // Não fazer busca se skipAutoLookup estiver ativo
      if (skipAutoLookup) {
        console.log('🚫 [CPF-INPUT] Auto-lookup desabilitado');
        return;
      }

      // Verifica se o CPF tem 14 caracteres, não está carregando, não foi pesquisado ainda
      // e é diferente da última pesquisa realizada
      if (
        debouncedValue.length === 14 && 
        !isLoading && 
        !hasSearched && 
        onCpfFound &&
        lastSearchedRef.current !== debouncedValue
      ) {
        console.log('🔍 [CPF-INPUT] Iniciando busca do CPF:', debouncedValue);
        setHasSearched(true);
        lastSearchedRef.current = debouncedValue;
        
        const cpfData = await lookupCpf(debouncedValue, birthDate);
        if (cpfData) {
          onCpfFound(cpfData);
        }
      }
    };

    handleCpfLookup();
  }, [debouncedValue, lookupCpf, onCpfFound, isLoading, hasSearched, birthDate, skipAutoLookup]);

  // Reset hasSearched quando o valor do CPF mudar significativamente
  useEffect(() => {
    if (value.length < 14) {
      setHasSearched(false);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Se o CPF foi alterado, permitir nova busca
    if (newValue !== lastSearchedRef.current) {
      setHasSearched(false);
    }
  };

  return (
    <div className="relative">
      <MaskedInput
        value={value}
        onChange={handleChange}
        mask="999.999.999-99"
        placeholder={placeholder}
        className={className}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {!isLoading && value.length >= 11 && !hasSearched && !skipAutoLookup && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
