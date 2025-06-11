
import React from 'react';
import { DISCOUNT_TABLE } from '@/types/subscriber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <div className="w-1 h-6 bg-primary rounded"></div>
          <span>Tabela de Descontos</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Descontos aplicáveis conforme consumo e período de fidelidade
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                  Faixa de Consumo
                </th>
                {loyaltyOptions.map(option => (
                  <th key={option.key} className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                    {option.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranges.map(range => (
                <tr key={range.label} className="hover:bg-gray-50 transition-colors">
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
                            ? 'bg-primary/10 text-primary font-bold ring-2 ring-primary/50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        role="gridcell"
                        aria-label={`Desconto de ${discount}% para ${range.label} com ${option.label}`}
                      >
                        <span className={`
                          inline-flex items-center justify-center w-full
                          ${isActive ? 'font-bold text-lg' : ''}
                        `}>
                          {discount}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {informedKwh > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600">
                Desconto Aplicável
              </Badge>
              <span className="text-green-800 font-medium">
                {getDiscount(
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
                )}%
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Para {informedKwh} kWh com {loyaltyOptions.find(o => o.key === loyalty)?.label}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountTable;
