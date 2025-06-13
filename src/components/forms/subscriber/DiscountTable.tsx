import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Edit2, Save, X, Percent, TrendingUp, Award } from 'lucide-react';

interface DiscountTableProps {
  contractedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
  selectedDiscount?: number;
  hideApplyButton?: boolean;
}

const DiscountTable = ({ contractedKwh, loyalty, onDiscountSelect, selectedDiscount, hideApplyButton = false }: DiscountTableProps) => {
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
      contractedKwh >= range.min && contractedKwh <= range.max
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

  const getLoyaltyIcon = (loyalty: string) => {
    switch (loyalty) {
      case 'oneYear': return <Award className="w-4 h-4 text-amber-500" />;
      case 'twoYears': return <Award className="w-4 h-4 text-yellow-500" />;
      default: return null;
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
      <Card className="border-gradient-to-r from-blue-200 to-emerald-200 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold">Tabela de Faixas de Consumo e Descontos</div>
              <div className="text-blue-100 text-sm font-normal">Configure os descontos por faixa de consumo e fidelidade</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg overflow-hidden border shadow-sm bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-800 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Faixa de Consumo
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      Sem Fidelidade
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      1 Ano Fidelidade
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      2 Anos Fidelidade
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-center py-4">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumptionRanges.map((range, index) => {
                  const isCurrentRange = currentRange?.range === range.range;
                  const isEditing = editingRow === index;
                  
                  return (
                    <TableRow 
                      key={index}
                      className={`${
                        isCurrentRange 
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-l-emerald-500 shadow-sm' 
                          : 'bg-white hover:bg-gray-50/70'
                      } transition-all duration-200`}
                    >
                      <TableCell className="font-semibold py-4 px-6">
                        <div className="flex items-center gap-3">
                          {isCurrentRange && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          )}
                          <span className={isCurrentRange ? 'text-emerald-800' : 'text-gray-700'}>
                            {range.range}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.none || range.discounts.none}
                            onChange={(e) => setEditValues({...editValues, none: Number(e.target.value)})}
                            className="w-20 text-center mx-auto"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <Badge 
                            variant={isCurrentRange && loyalty === 'none' ? "default" : "secondary"}
                            className={`${
                              isCurrentRange && loyalty === 'none' 
                                ? 'bg-emerald-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } px-3 py-1 text-sm font-medium transition-colors`}
                          >
                            {range.discounts.none}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.oneYear || range.discounts.oneYear}
                            onChange={(e) => setEditValues({...editValues, oneYear: Number(e.target.value)})}
                            className="w-20 text-center mx-auto"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <Badge 
                            variant={isCurrentRange && loyalty === 'oneYear' ? "default" : "secondary"}
                            className={`${
                              isCurrentRange && loyalty === 'oneYear' 
                                ? 'bg-emerald-600 text-white shadow-md' 
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            } px-3 py-1 text-sm font-medium transition-colors`}
                          >
                            {range.discounts.oneYear}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.twoYears || range.discounts.twoYears}
                            onChange={(e) => setEditValues({...editValues, twoYears: Number(e.target.value)})}
                            className="w-20 text-center mx-auto"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <Badge 
                            variant={isCurrentRange && loyalty === 'twoYears' ? "default" : "secondary"}
                            className={`${
                              isCurrentRange && loyalty === 'twoYears' 
                                ? 'bg-emerald-600 text-white shadow-md' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            } px-3 py-1 text-sm font-medium transition-colors`}
                          >
                            {range.discounts.twoYears}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center">
                            <Button 
                              size="sm" 
                              onClick={() => handleSave(index)} 
                              className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancel} 
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(index)} 
                            className="h-8 w-8 p-0 border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {contractedKwh > 0 && contractedKwh >= 400 && currentRange && (
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 rounded-xl border-2 border-emerald-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h5 className="font-bold text-emerald-900 text-lg">Desconto Aplicável</h5>
                  </div>
                  <div className="space-y-1 text-emerald-700">
                    <p className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">Consumo contratado:</span> 
                      <span className="bg-emerald-100 px-2 py-1 rounded font-bold">{contractedKwh} kWh</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Faixa:</span> {currentRange.range}
                    </p>
                    <p className="flex items-center gap-2">
                      {getLoyaltyIcon(loyalty)}
                      <span className="font-medium">{getLoyaltyLabel(loyalty)}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-emerald-900 mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {currentDiscount}%
                  </div>
                  {!hideApplyButton && (
                    <Button
                      onClick={() => onDiscountSelect(currentDiscount)}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      size="lg"
                    >
                      <Percent className="w-4 h-4 mr-2" />
                      Aplicar Desconto
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {contractedKwh > 0 && contractedKwh < 400 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-amber-800 font-bold text-lg">
                    Consumo Abaixo da Faixa Mínima
                  </p>
                  <p className="text-amber-700">
                    Consumo contratado ({contractedKwh} kWh) está abaixo da faixa mínima de desconto.
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    O desconto só se aplica a partir de 400 kWh.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountTable;
