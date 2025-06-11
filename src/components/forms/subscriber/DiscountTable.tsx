
import React from 'react';
import { DISCOUNT_TABLE } from '@/types/subscriber';

interface DiscountTableProps {
  informedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
}

const DiscountTable = ({ informedKwh, loyalty, onDiscountSelect }: DiscountTableProps) => {
  const getKwhRange = (kwh: number) => {
    if (kwh >= 400 && kwh <= 599) return '400-599';
    if (kwh >= 600 && kwh <= 1099) return '600-1099';
    if (kwh >= 1100 && kwh <= 3099) return '1100-3099';
    if (kwh >= 3100 && kwh <= 7000) return '3100-7000';
    if (kwh > 7000) return '>7000';
    return null;
  };

  const getDiscount = (minKwh: number, loyaltyType: string) => {
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
  }, [informedKwh, loyalty, onDiscountSelect]);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900">Tabela de Descontos</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
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
              <tr key={range.label}>
                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                  {range.label}
                </td>
                {loyaltyOptions.map(option => {
                  const discount = getDiscount(range.minKwh, option.key as any);
                  const isActive = isActiveCell(range.minKwh, option.key as any);
                  
                  return (
                    <td
                      key={option.key}
                      className={`border border-gray-300 px-4 py-3 text-center transition-all duration-200 ${
                        isActive
                          ? 'bg-green-100 text-green-800 font-bold ring-2 ring-green-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      role="gridcell"
                      aria-label={`Desconto de ${discount}% para ${range.label} com ${option.label}`}
                    >
                      {discount}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {informedKwh > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscountTable;
