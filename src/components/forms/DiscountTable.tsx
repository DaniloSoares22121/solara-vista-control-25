
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface DiscountRates {
  [key: string]: {
    sem: number;
    com: {
      '1': number;
      '2': number;
    };
  };
}

interface DiscountTableProps {
  faixaConsumo: string;
  fidelidade: string;
  anosFidelidade?: string;
  discountRates?: DiscountRates;
  onDiscountChange?: (newRates: DiscountRates) => void;
}

const DiscountTable = ({ 
  faixaConsumo, 
  fidelidade, 
  anosFidelidade, 
  discountRates,
  onDiscountChange 
}: DiscountTableProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const defaultRates: DiscountRates = {
    '400-599': { sem: 13, com: { '1': 15, '2': 20 } },
    '600-1099': { sem: 15, com: { '1': 18, '2': 20 } },
    '1100-3099': { sem: 18, com: { '1': 20, '2': 22 } },
    '3100-7000': { sem: 20, com: { '1': 22, '2': 25 } },
    '7000+': { sem: 22, com: { '1': 25, '2': 27 } }
  };

  const rates = discountRates || defaultRates;

  const getDescontoOptions = () => {
    return rates[faixaConsumo as keyof typeof rates] || rates['400-599'];
  };

  const descontoOptions = getDescontoOptions();
  
  const getCurrentDiscount = () => {
    if (fidelidade === 'sem') {
      return descontoOptions.sem;
    } else if (fidelidade === 'com' && anosFidelidade) {
      return descontoOptions.com[anosFidelidade as '1' | '2'];
    }
    return 0;
  };

  const currentDiscount = getCurrentDiscount();

  const getFaixaDisplay = (faixa: string) => {
    const displays = {
      '400-599': '400 kWh a 599 kWh',
      '600-1099': '600 kWh a 1099 kWh',
      '1100-3099': '1100 kWh a 3099 kWh',
      '3100-7000': '3100 kWh a 7000 kWh',
      '7000+': 'Maior que 7099 kWh'
    };
    return displays[faixa as keyof typeof displays] || faixa;
  };

  // Função para verificar se uma célula específica deve ser destacada
  const isCellHighlighted = (faixa: string, type: string) => {
    if (faixa !== faixaConsumo) return false;
    
    if (type === 'sem' && fidelidade === 'sem') return true;
    if (type === '1' && fidelidade === 'com' && anosFidelidade === '1') return true;
    if (type === '2' && fidelidade === 'com' && anosFidelidade === '2') return true;
    
    return false;
  };

  const handleCellClick = (faixa: string, type: string) => {
    const cellId = `${faixa}-${type}`;
    setEditingCell(cellId);
    
    const faixaData = rates[faixa];
    let currentValue: number;
    
    if (type === 'sem') {
      currentValue = faixaData.sem;
    } else {
      currentValue = faixaData.com[type as '1' | '2'];
    }
    setTempValue(currentValue.toString());
  };

  const handleInputChange = (value: string) => {
    setTempValue(value);
  };

  const handleInputBlur = (faixa: string, type: string) => {
    const newValue = parseFloat(tempValue);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      const newRates = { ...rates };
      
      if (type === 'sem') {
        newRates[faixa].sem = newValue;
      } else {
        newRates[faixa].com[type as '1' | '2'] = newValue;
      }
      
      if (onDiscountChange) {
        onDiscountChange(newRates);
      }
    }
    setEditingCell(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent, faixa: string, type: string) => {
    if (e.key === 'Enter') {
      handleInputBlur(faixa, type);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const renderEditableCell = (faixa: string, type: string, value: number) => {
    const cellId = `${faixa}-${type}`;
    const isEditing = editingCell === cellId;
    const isHighlighted = isCellHighlighted(faixa, type);

    return (
      <TableCell 
        className={`cursor-pointer transition-all duration-300 ${
          isHighlighted 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 font-bold text-green-800 shadow-lg transform scale-105' 
            : 'hover:bg-gray-50 border border-transparent'
        }`}
        onClick={() => !isEditing && handleCellClick(faixa, type)}
      >
        {isEditing ? (
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={() => handleInputBlur(faixa, type)}
            onKeyDown={(e) => handleInputKeyDown(e, faixa, type)}
            className="w-16 h-8 text-center"
            min="0"
            max="100"
            autoFocus
          />
        ) : (
          <div className={`inline-flex items-center justify-center ${isHighlighted ? 'font-bold' : ''}`}>
            <span className={`${isHighlighted ? 'text-green-800 text-lg' : ''}`}>
              {value}%
            </span>
            {isHighlighted && (
              <span className="ml-2 text-green-600">✓</span>
            )}
            <span className="ml-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100">✏️</span>
          </div>
        )}
      </TableCell>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg text-green-700">
          Tabela Demonstrativa de Desconto
          <span className="text-sm text-gray-500 ml-2 font-normal">(Clique nas porcentagens para editar)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faixa de Consumo</TableHead>
              <TableHead>Sem Fidelidade</TableHead>
              <TableHead>1 Ano de Fidelidade</TableHead>
              <TableHead>2 Anos de Fidelidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(rates).map(([faixa, valores]) => (
              <TableRow 
                key={faixa}
                className={`group transition-all duration-300 ${
                  faixa === faixaConsumo 
                    ? 'bg-green-50 border-l-4 border-green-500 shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <TableCell className={`font-medium ${
                  faixa === faixaConsumo ? 'text-green-800 font-bold' : ''
                }`}>
                  {getFaixaDisplay(faixa)}
                  {faixa === faixaConsumo && (
                    <span className="ml-2 text-green-600">← Selecionada</span>
                  )}
                </TableCell>
                {renderEditableCell(faixa, 'sem', valores.sem)}
                {renderEditableCell(faixa, '1', valores.com['1'])}
                {renderEditableCell(faixa, '2', valores.com['2'])}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {faixaConsumo && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-md">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Sua Seleção Atual:
            </h4>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Faixa:</strong> {getFaixaDisplay(faixaConsumo)}</p>
              <p><strong>Tipo:</strong> {fidelidade === 'sem' ? 'Sem Fidelidade' : `Com Fidelidade (${anosFidelidade} ano${anosFidelidade === '1' ? '' : 's'})`}</p>
              <p className="flex items-center gap-2">
                <strong>Desconto:</strong> 
                <span className="text-xl font-bold text-green-600 bg-white px-3 py-1 rounded-full shadow-sm border border-green-300">
                  {currentDiscount}%
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountTable;
