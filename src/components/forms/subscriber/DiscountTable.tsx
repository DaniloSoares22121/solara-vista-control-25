
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Percent, Edit3, Check, X, Zap, TrendingUp, Star, Calculator, Target } from 'lucide-react';

interface DiscountTableProps {
  informedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
}

const DiscountTable = ({ informedKwh, loyalty, onDiscountSelect }: DiscountTableProps) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);

  // Tabela base de descontos
  const baseDiscounts = [
    { range: '0-200', min: 0, max: 200, baseDiscount: 5 },
    { range: '201-500', min: 201, max: 500, baseDiscount: 8 },
    { range: '501-1000', min: 501, max: 1000, baseDiscount: 12 },
    { range: '1001-2000', min: 1001, max: 2000, baseDiscount: 15 },
    { range: '2001+', min: 2001, max: Infinity, baseDiscount: 18 },
  ];

  const [discounts, setDiscounts] = useState(baseDiscounts);

  // Calcular desconto adicional por fidelidade
  const getLoyaltyBonus = () => {
    switch (loyalty) {
      case 'oneYear': return 2;
      case 'twoYears': return 5;
      default: return 0;
    }
  };

  // Encontrar o desconto aplicável baseado no kWh informado
  const getApplicableDiscount = () => {
    const applicable = discounts.find(d => informedKwh >= d.min && informedKwh <= d.max);
    return applicable ? applicable.baseDiscount + getLoyaltyBonus() : 0;
  };

  useEffect(() => {
    const newDiscount = getApplicableDiscount();
    setSelectedDiscount(newDiscount);
    onDiscountSelect(newDiscount);
  }, [informedKwh, loyalty, discounts]);

  const handleEdit = (index: number, currentValue: number) => {
    setEditingRow(index);
    setEditValue(currentValue.toString());
  };

  const handleSave = (index: number) => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      const updatedDiscounts = [...discounts];
      updatedDiscounts[index].baseDiscount = newValue;
      setDiscounts(updatedDiscounts);
      setEditingRow(null);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditValue('');
  };

  const getLoyaltyIcon = () => {
    switch (loyalty) {
      case 'oneYear': return <TrendingUp className="w-3 h-3" />;
      case 'twoYears': return <Star className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabela principal */}
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tabela de Descontos</h3>
              <p className="text-gray-600 text-sm font-normal">Configure os percentuais por faixa de consumo</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span>Faixa (kWh)</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Percent className="w-4 h-4 text-green-600" />
                      <span>Base (%)</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span>Total (%)</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Edit3 className="w-4 h-4 text-green-600" />
                      <span>Ações</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount, index) => {
                  const totalDiscount = discount.baseDiscount + getLoyaltyBonus();
                  const isApplicable = informedKwh >= discount.min && informedKwh <= discount.max;
                  const isEditing = editingRow === index;

                  return (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-100 transition-colors ${
                        isApplicable 
                          ? 'bg-green-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">{discount.range}</span>
                          {isApplicable && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              <Target className="w-3 h-3 mr-1" />
                              Aplicável
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 text-center"
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSave(index)}
                              className="bg-green-600 hover:bg-green-700 text-white p-2"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              className="p-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-semibold text-lg text-gray-900">
                            {discount.baseDiscount}%
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`font-bold text-lg ${isApplicable ? 'text-green-600' : 'text-gray-600'}`}>
                            {totalDiscount}%
                          </span>
                          {getLoyaltyBonus() > 0 && (
                            <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                              {getLoyaltyIcon()}
                              <span className="ml-1">+{getLoyaltyBonus()}%</span>
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {!isEditing && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(index, discount.baseDiscount)}
                            className="hover:bg-gray-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do desconto aplicado */}
      {informedKwh > 0 && (
        <Card className="border border-gray-200">
          <CardContent className="p-8 bg-green-50">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Desconto Aplicado
                </h4>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Para <span className="font-semibold text-gray-900">{informedKwh} kWh</span> informados
                  </p>
                  <div className="text-4xl font-bold text-green-600">
                    {selectedDiscount}%
                  </div>
                  {getLoyaltyBonus() > 0 && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <span>Inclui bônus de fidelidade:</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {getLoyaltyIcon()}
                        <span className="ml-1">+{getLoyaltyBonus()}%</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscountTable;
