
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, RotateCcw } from 'lucide-react';
import { DISCOUNT_TABLE } from '@/types/subscriber';

interface DiscountTableProps {
  informedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
}

const DiscountTable = ({ informedKwh, loyalty, onDiscountSelect }: DiscountTableProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [customDiscounts, setCustomDiscounts] = useState<{[key: string]: number}>({});
  const [tempValue, setTempValue] = useState<string>('');

  const getKwhRange = (kwh: number) => {
    if (kwh >= 400 && kwh <= 599) return '400-599';
    if (kwh >= 600 && kwh <= 1099) return '600-1099';
    if (kwh >= 1100 && kwh <= 3099) return '1100-3099';
    if (kwh >= 3100 && kwh <= 7000) return '3100-7000';
    if (kwh > 7000) return '>7000';
    return null;
  };

  const getDiscount = (minKwh: number, loyaltyType: string) => {
    const key = `${minKwh}-${loyaltyType}`;
    if (customDiscounts[key] !== undefined) {
      return customDiscounts[key];
    }
    
    const entry = DISCOUNT_TABLE.find(item => 
      item.kwh === minKwh && item.loyalty === loyaltyType
    );
    return entry?.percentage || 0;
  };

  const isActiveCell = (minKwh: number, loyaltyType: string) => {
    const range = getKwhRange(informedKwh);
    const rangeMap: { [key: string]: number } = {
      '400-599': 400,
      '600-1099': 600,
      '1100-3099': 1100,
      '3100-7000': 3100,
      '>7000': 7000,
    };
    
    return range && rangeMap[range] === minKwh && loyalty === loyaltyType;
  };

  const handleEditStart = (minKwh: number, loyaltyType: string) => {
    const key = `${minKwh}-${loyaltyType}`;
    setEditingCell(key);
    setTempValue(getDiscount(minKwh, loyaltyType).toString());
  };

  const handleEditSave = (minKwh: number, loyaltyType: string) => {
    const key = `${minKwh}-${loyaltyType}`;
    const value = parseFloat(tempValue);
    
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setCustomDiscounts(prev => ({ ...prev, [key]: value }));
      setEditingCell(null);
      
      // Se for a célula ativa, atualizar o desconto selecionado
      if (isActiveCell(minKwh, loyaltyType)) {
        onDiscountSelect(value);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const handleResetDiscount = (minKwh: number, loyaltyType: string) => {
    const key = `${minKwh}-${loyaltyType}`;
    setCustomDiscounts(prev => {
      const newDiscounts = { ...prev };
      delete newDiscounts[key];
      return newDiscounts;
    });
    
    // Se for a célula ativa, atualizar com o valor original
    if (isActiveCell(minKwh, loyaltyType)) {
      const originalEntry = DISCOUNT_TABLE.find(item => 
        item.kwh === minKwh && item.loyalty === loyaltyType
      );
      onDiscountSelect(originalEntry?.percentage || 0);
    }
  };

  const ranges = [
    { label: '400-599 kWh', minKwh: 400 },
    { label: '600-1099 kWh', minKwh: 600 },
    { label: '1100-3099 kWh', minKwh: 1100 },
    { label: '3100-7000 kWh', minKwh: 3100 },
    { label: '>7000 kWh', minKwh: 7000 },
  ];

  const loyaltyOptions = [
    { key: 'none', label: 'Sem Fidelidade' },
    { key: 'oneYear', label: '1 Ano' },
    { key: 'twoYears', label: '2 Anos' },
  ];

  React.useEffect(() => {
    const range = getKwhRange(informedKwh);
    if (range) {
      const rangeMap: { [key: string]: number } = {
        '400-599': 400,
        '600-1099': 600,
        '1100-3099': 1100,
        '3100-7000': 3100,
        '>7000': 7000,
      };
      const minKwh = rangeMap[range];
      const discount = getDiscount(minKwh, loyalty);
      onDiscountSelect(discount);
    }
  }, [informedKwh, loyalty, onDiscountSelect, customDiscounts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Tabela de Descontos</h4>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Edit2 className="w-4 h-4" />
          <span>Clique para editar as porcentagens</span>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">
                Faixa de Consumo
              </th>
              {loyaltyOptions.map(option => (
                <th key={option.key} className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">
                  {option.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranges.map(range => (
              <tr key={range.label} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700 bg-gray-50">
                  {range.label}
                </td>
                {loyaltyOptions.map(option => {
                  const discount = getDiscount(range.minKwh, option.key as any);
                  const isActive = isActiveCell(range.minKwh, option.key as any);
                  const cellKey = `${range.minKwh}-${option.key}`;
                  const isEditing = editingCell === cellKey;
                  const isCustom = customDiscounts[cellKey] !== undefined;
                  
                  return (
                    <td
                      key={option.key}
                      className={`border border-gray-300 px-2 py-2 text-center transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-bold ring-2 ring-green-500'
                          : isCustom
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      role="gridcell"
                      aria-label={`Desconto de ${discount}% para ${range.label} com ${option.label}`}
                    >
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <Input
                            type="number"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-16 h-8 text-sm text-center"
                            min="0"
                            max="100"
                            step="0.1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEditSave(range.minKwh, option.key as any);
                              } else if (e.key === 'Escape') {
                                handleEditCancel();
                              }
                            }}
                          />
                          <div className="flex flex-col space-y-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 text-green-600 hover:text-green-700"
                              onClick={() => handleEditSave(range.minKwh, option.key as any)}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                              onClick={handleEditCancel}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-1 group">
                          <span className="font-medium">{discount}%</span>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 text-blue-600 hover:text-blue-700"
                              onClick={() => handleEditStart(range.minKwh, option.key as any)}
                              title="Editar porcentagem"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            {isCustom && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-orange-600 hover:text-orange-700"
                                onClick={() => handleResetDiscount(range.minKwh, option.key as any)}
                                title="Restaurar valor original"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {informedKwh > 0 && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Desconto aplicável:</strong> {getDiscount(
              (() => {
                const range = getKwhRange(informedKwh);
                const rangeMap: { [key: string]: number } = {
                  '400-599': 400,
                  '600-1099': 600,
                  '1100-3099': 1100,
                  '3100-7000': 3100,
                  '>7000': 7000,
                };
                return range ? rangeMap[range] : 0;
              })(),
              loyalty
            )}% para {informedKwh} kWh com {loyaltyOptions.find(o => o.key === loyalty)?.label}
            {(() => {
              const range = getKwhRange(informedKwh);
              const rangeMap: { [key: string]: number } = {
                '400-599': 400,
                '600-1099': 600,
                '1100-3099': 1100,
                '3100-7000': 3100,
                '>7000': 7000,
              };
              const minKwh = range ? rangeMap[range] : 0;
              const key = `${minKwh}-${loyalty}`;
              return customDiscounts[key] !== undefined ? ' (personalizado)' : '';
            })()}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscountTable;
