
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Edit2, Save, X } from 'lucide-react';

interface DiscountTableProps {
  informedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
  selectedDiscount?: number;
}

const DiscountTable = ({ informedKwh, loyalty, onDiscountSelect, selectedDiscount }: DiscountTableProps) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{[key: string]: number}>({});

  const [consumptionRanges, setConsumptionRanges] = useState([
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
      range: 'Maior que 7000 kWh',
      min: 7001,
      max: Infinity,
      discounts: {
        none: 22,
        oneYear: 25,
        twoYears: 27
      }
    }
  ]);

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

  const handleEdit = (index: number) => {
    setEditingRow(index);
    const range = consumptionRanges[index];
    setEditValues({
      none: range.discounts.none,
      oneYear: range.discounts.oneYear,
      twoYears: range.discounts.twoYears,
    });
  };

  const handleSave = (index: number) => {
    const newRanges = [...consumptionRanges];
    newRanges[index] = {
      ...newRanges[index],
      discounts: {
        none: editValues.none || 0,
        oneYear: editValues.oneYear || 0,
        twoYears: editValues.twoYears || 0,
      }
    };
    setConsumptionRanges(newRanges);
    setEditingRow(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditValues({});
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">%</span>
            </div>
            Tabela de Faixas de Consumo e Descontos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Faixa de Consumo</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Sem Fidelidade</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">1 Ano Fidelidade</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">2 Anos Fidelidade</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {consumptionRanges.map((range, index) => {
                  const isCurrentRange = currentRange?.range === range.range;
                  const isEditing = editingRow === index;
                  
                  return (
                    <tr 
                      key={index}
                      className={`${
                        isCurrentRange 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <td className="border border-gray-300 p-3 font-medium">
                        {isCurrentRange && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 inline mr-2" />
                        )}
                        {range.range}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.none || range.discounts.none}
                            onChange={(e) => setEditValues({...editValues, none: Number(e.target.value)})}
                            className="w-16 text-center"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <Badge variant={isCurrentRange && loyalty === 'none' ? "default" : "secondary"}>
                            {range.discounts.none}%
                          </Badge>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.oneYear || range.discounts.oneYear}
                            onChange={(e) => setEditValues({...editValues, oneYear: Number(e.target.value)})}
                            className="w-16 text-center"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <Badge variant={isCurrentRange && loyalty === 'oneYear' ? "default" : "secondary"}>
                            {range.discounts.oneYear}%
                          </Badge>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.twoYears || range.discounts.twoYears}
                            onChange={(e) => setEditValues({...editValues, twoYears: Number(e.target.value)})}
                            className="w-16 text-center"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <Badge variant={isCurrentRange && loyalty === 'twoYears' ? "default" : "secondary"}>
                            {range.discounts.twoYears}%
                          </Badge>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        {isEditing ? (
                          <div className="flex gap-1 justify-center">
                            <Button size="sm" onClick={() => handleSave(index)} className="h-8 w-8 p-0">
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleEdit(index)} className="h-8 w-8 p-0">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {informedKwh > 0 && informedKwh >= 400 && currentRange && (
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

          {informedKwh > 0 && informedKwh < 400 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 font-medium">
                Consumo informado ({informedKwh} kWh) está abaixo da faixa mínima de desconto.
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                O desconto só se aplica a partir de 400 kWh.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountTable;
