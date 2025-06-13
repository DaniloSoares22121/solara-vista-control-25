
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DiscountTableProps {
  currentKwh: number;
  currentLoyalty: 'none' | 'oneYear' | 'twoYears';
}

const DiscountTable = ({ currentKwh, currentLoyalty }: DiscountTableProps) => {
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

  const currentRange = getCurrentRange(currentKwh);

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
                    <span className={`font-semibold ${isCurrentRange && currentLoyalty === 'none' ? 'text-green-600' : ''}`}>
                      {range.none}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${isCurrentRange && currentLoyalty === 'oneYear' ? 'text-green-600' : ''}`}>
                      {range.oneYear}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${isCurrentRange && currentLoyalty === 'twoYears' ? 'text-green-600' : ''}`}>
                      {range.twoYears}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {currentKwh > 0 && currentRange && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Desconto aplicado:</strong> {currentRange[currentLoyalty]}% 
              para {currentKwh} kWh com {currentLoyalty === 'none' ? 'sem fidelidade' : currentLoyalty === 'oneYear' ? '1 ano de fidelidade' : '2 anos de fidelidade'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountTable;
