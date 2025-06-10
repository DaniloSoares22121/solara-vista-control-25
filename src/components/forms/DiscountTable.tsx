
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

  const renderEditableCell = (faixa: string, type: string, value: number, isHighlighted: boolean) => {
    const cellId = `${faixa}-${type}`;
    const isEditing = editingCell === cellId;

    return (
      <TableCell 
        className={`cursor-pointer transition-colors ${isHighlighted ? 'bg-green-100 font-bold text-green-700' : 'hover:bg-gray-50'}`}
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
          <span className="inline-flex items-center">
            {value}%
            <span className="ml-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100">✏️</span>
          </span>
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
                className={`group ${faixa === faixaConsumo ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
              >
                <TableCell className="font-medium">
                  {getFaixaDisplay(faixa)}
                </TableCell>
                {renderEditableCell(
                  faixa, 
                  'sem', 
                  valores.sem, 
                  faixa === faixaConsumo && fidelidade === 'sem'
                )}
                {renderEditableCell(
                  faixa, 
                  '1', 
                  valores.com['1'], 
                  faixa === faixaConsumo && fidelidade === 'com' && anosFidelidade === '1'
                )}
                {renderEditableCell(
                  faixa, 
                  '2', 
                  valores.com['2'], 
                  faixa === faixaConsumo && fidelidade === 'com' && anosFidelidade === '2'
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {faixaConsumo && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Sua Seleção Atual:</h4>
            <div className="text-sm text-green-700">
              <p><strong>Faixa:</strong> {getFaixaDisplay(faixaConsumo)}</p>
              <p><strong>Tipo:</strong> {fidelidade === 'sem' ? 'Sem Fidelidade' : `Com Fidelidade (${anosFidelidade} ano${anosFidelidade === '1' ? '' : 's'})`}</p>
              <p><strong>Desconto:</strong> <span className="text-lg font-bold text-green-600">{currentDiscount}%</span></p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountTable;
