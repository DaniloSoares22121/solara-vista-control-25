
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface DiscountTableProps {
  informedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
  selectedDiscount?: number;
}

const DiscountTable = ({ informedKwh, loyalty, onDiscountSelect, selectedDiscount }: DiscountTableProps) => {
  const consumptionRanges = [
    {
      range: '400 kWh a 599 kWh',
      min: 400,
      max: 599,
      discounts: {
        none: 13,
        oneYear: 15,
        twoYears: 20
      }
    },
    {
      range: '600 kWh a 1099 kWh',
      min: 600,
      max: 1099,
      discounts: {
        none: 15,
        oneYear: 18,
        twoYears: 20
      }
    },
    {
      range: '1100 kWh a 3099 kWh',
      min: 1100,
      max: 3099,
      discounts: {
        none: 18,
        oneYear: 20,
        twoYears: 22
      }
    },
    {
      range: '3100 kWh a 7000 kWh',
      min: 3100,
      max: 7000,
      discounts: {
        none: 20,
        oneYear: 22,
        twoYears: 25
      }
    },
    {
      range: 'Maior que 7099 kWh',
      min: 7100,
      max: Infinity,
      discounts: {
        none: 22,
        oneYear: 25,
        twoYears: 27
      }
    }
  ];

  const getCurrentRange = () => {
    return consumptionRanges.find(range => 
      informedKwh >= range.min && informedKwh <= range.max
    );
  };

  const currentRange = getCurrentRange();
  const currentDiscount = currentRange ? currentRange.discounts[loyalty] : 0;

  const getLoyaltyLabel = (loyalty: string) => {
    switch (loyalty) {
      case 'none': return 'Sem Fidelidade';
      case 'oneYear': return 'Com Fidelidade (1 Ano)';
      case 'twoYears': return 'Com Fidelidade (2 Anos)';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Faixas de Consumo e Descontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {consumptionRanges.map((range, index) => {
              const isCurrentRange = currentRange?.range === range.range;
              const discount = range.discounts[loyalty];
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCurrentRange 
                      ? 'border-green-400 bg-green-50 shadow-md' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isCurrentRange && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{range.range}</h4>
                        <p className="text-sm text-gray-600">{getLoyaltyLabel(loyalty)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={isCurrentRange ? "default" : "secondary"}
                        className={isCurrentRange ? "bg-green-600" : ""}
                      >
                        {discount}% de desconto
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {informedKwh > 0 && currentRange && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-green-900">Desconto Aplicável</h5>
                  <p className="text-sm text-green-700">
                    Consumo informado: {informedKwh} kWh - {currentRange.range}
                  </p>
                  <p className="text-sm text-green-700">
                    {getLoyaltyLabel(loyalty)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-900">{currentDiscount}%</div>
                  <Button
                    onClick={() => onDiscountSelect(currentDiscount)}
                    className="mt-2 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Aplicar Desconto
                  </Button>
                </div>
              </div>
            </div>
          )}

          {informedKwh > 0 && !currentRange && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 font-medium">
                Consumo informado ({informedKwh} kWh) está fora das faixas disponíveis.
              </p>
              <p className="text-sm text-red-600 mt-1">
                Por favor, verifique o valor do consumo informado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountTable;
