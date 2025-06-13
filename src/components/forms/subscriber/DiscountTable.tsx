
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DiscountTableProps {
  contractedKwh: number;
  loyalty: 'none' | 'oneYear' | 'twoYears';
  onDiscountSelect: (percentage: number) => void;
  selectedDiscount: number;
}

const DiscountTable = ({ contractedKwh, loyalty, onDiscountSelect, selectedDiscount }: DiscountTableProps) => {
  const discountRanges = [
    { min: 0, max: 399, none: 0, oneYear: 0, twoYears: 0 },
    { min: 400, max: 599, none: 13, oneYear: 15, twoYears: 20 },
    { min: 600, max: 1099, none: 15, oneYear: 18, twoYears: 20 },
    { min: 1100, max: 3099, none: 18, oneYear: 20, twoYears: 22 },
    { min: 3100, max: 6999, none: 20, oneYear: 22, twoYears: 25 },
    { min: 7000, max: 999999, none: 22, oneYear: 25, twoYears: 27 },
  ];

  const getCurrentRange = (kwh: number) => {
    return discountRanges.find(range => kwh >= range.min && kwh <= range.max);
  };

  const currentRange = getCurrentRange(contractedKwh);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Tabela de Descontos por Faixa de Consumo</CardTitle>
        <p className="text-sm text-gray-600">
          Descontos aplicados baseados no consumo informado e fidelidade escolhida
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faixa de Consumo (kWh)</TableHead>
              <TableHead className="text-center">Sem Fidelidade</TableHead>
              <TableHead className="text-center">1 Ano</TableHead>
              <TableHead className="text-center">2 Anos</TableHead>
              <TableHead className="text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountRanges.map((range, index) => {
              const isCurrentRange = currentRange === range;
              const rangeDisplay = range.max === 999999 ? `${range.min}+` : `${range.min} - ${range.max}`;
              
              return (
                <TableRow 
                  key={index} 
                  className={isCurrentRange ? 'bg-green-50 border-green-200' : ''}
                >
                  <TableCell className="font-medium">
                    {rangeDisplay}
                    {isCurrentRange && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                        Faixa Atual
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`font-semibold ${isCurrentRange && loyalty === 'none' ? 'text-green-600' : ''}`}>
                        {range.none}%
                      </span>
                      {isCurrentRange && loyalty === 'none' && (
                        <Button
                          size="sm"
                          variant={selectedDiscount === range.none ? "default" : "outline"}
                          onClick={() => onDiscountSelect(range.none)}
                        >
                          Aplicar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`font-semibold ${isCurrentRange && loyalty === 'oneYear' ? 'text-green-600' : ''}`}>
                        {range.oneYear}%
                      </span>
                      {isCurrentRange && loyalty === 'oneYear' && (
                        <Button
                          size="sm"
                          variant={selectedDiscount === range.oneYear ? "default" : "outline"}
                          onClick={() => onDiscountSelect(range.oneYear)}
                        >
                          Aplicar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`font-semibold ${isCurrentRange && loyalty === 'twoYears' ? 'text-green-600' : ''}`}>
                        {range.twoYears}%
                      </span>
                      {isCurrentRange && loyalty === 'twoYears' && (
                        <Button
                          size="sm"
                          variant={selectedDiscount === range.twoYears ? "default" : "outline"}
                          onClick={() => onDiscountSelect(range.twoYears)}
                        >
                          Aplicar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {isCurrentRange && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onDiscountSelect(currentRange[loyalty])}
                      >
                        Auto
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {contractedKwh > 0 && currentRange && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Desconto aplicado:</strong> {selectedDiscount}% 
              para {contractedKwh} kWh com {loyalty === 'none' ? 'sem fidelidade' : loyalty === 'oneYear' ? '1 ano de fidelidade' : '2 anos de fidelidade'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Desconto sugerido para esta faixa: {currentRange[loyalty]}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountTable;
