
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingDown, ArrowRight, Save } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface EnergyPayData {
  valorSemEnergyPay: number;
  valorComEnergyPay: number;
  valorPagar: number;
  economiaMes: number;
  calculoEconomia: number;
  economiaAcumulada: number;
  percentualDesconto: number;
}

interface EnergyPayCalculatorProps {
  valorOriginal: number;
  percentualDesconto: number;
  consumoKwh: number;
  referencia: string;
  onCalculationConfirmed?: (data: EnergyPayData) => void;
}

export function EnergyPayCalculator({ 
  valorOriginal, 
  percentualDesconto, 
  consumoKwh, 
  referencia,
  onCalculationConfirmed 
}: EnergyPayCalculatorProps) {
  const [editableData, setEditableData] = useState<EnergyPayData>({
    valorSemEnergyPay: 0,
    valorComEnergyPay: 0,
    valorPagar: 0,
    economiaMes: 0,
    calculoEconomia: 0,
    economiaAcumulada: 0,
    percentualDesconto: 0
  });

  useEffect(() => {
    calculateEnergyPayValues();
  }, [valorOriginal, percentualDesconto]);

  const calculateEnergyPayValues = () => {
    const valorBruto = valorOriginal;
    const desconto = valorBruto * (percentualDesconto / 100);
    const valorFinal = valorBruto - desconto;
    const economiaMes = desconto;

    const calculatedData: EnergyPayData = {
      valorSemEnergyPay: valorBruto,
      valorComEnergyPay: valorFinal,
      valorPagar: valorFinal,
      economiaMes: economiaMes,
      calculoEconomia: economiaMes,
      economiaAcumulada: 0, // Fixado como 0 conforme especificação
      percentualDesconto: percentualDesconto
    };

    setEditableData(calculatedData);
  };

  const handleInputChange = (field: keyof EnergyPayData, value: string | number) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    setEditableData(prev => {
      const updated = {
        ...prev,
        [field]: numericValue
      };

      // Recalcular valores dependentes quando necessário
      if (field === 'valorSemEnergyPay' || field === 'percentualDesconto') {
        const valorBruto = field === 'valorSemEnergyPay' ? numericValue : updated.valorSemEnergyPay;
        const desconto = valorBruto * (updated.percentualDesconto / 100);
        const valorFinal = valorBruto - desconto;

        updated.valorComEnergyPay = valorFinal;
        updated.valorPagar = valorFinal;
        updated.economiaMes = desconto;
        updated.calculoEconomia = desconto;
      }

      return updated;
    });
  };

  const handleConfirmCalculation = () => {
    onCalculationConfirmed?.(editableData);
    toast.success('Cálculo da fatura EnergyPay confirmado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Cálculo da Fatura EnergyPay</h3>
          <Badge variant="secondary">Valores Editáveis</Badge>
        </div>
        <Button onClick={handleConfirmCalculation} className="bg-green-600 hover:bg-green-700">
          <ArrowRight className="w-4 h-4 mr-2" />
          Confirmar Cálculo
        </Button>
      </div>

      {/* Informações da Fatura Original */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <DollarSign className="w-5 w-5" />
            <span>Dados da Fatura Original</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-blue-700">Valor Original</Label>
              <p className="text-lg font-semibold text-blue-800">
                {formatCurrency(valorOriginal)}
              </p>
            </div>
            <div>
              <Label className="text-blue-700">Consumo</Label>
              <p className="text-lg font-semibold text-blue-800">
                {consumoKwh} kWh
              </p>
            </div>
            <div>
              <Label className="text-blue-700">Referência</Label>
              <p className="text-lg font-semibold text-blue-800">
                {referencia}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cálculos da EnergyPay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span>Valores da Fatura EnergyPay</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primeira linha: Valores principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valorSemEnergyPay">Valor sem EnergyPay (R$)</Label>
              <Input
                id="valorSemEnergyPay"
                type="number"
                step="0.01"
                value={editableData.valorSemEnergyPay}
                onChange={(e) => handleInputChange('valorSemEnergyPay', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="percentualDesconto">Percentual de Desconto (%)</Label>
              <Input
                id="percentualDesconto"
                type="number"
                step="0.01"
                value={editableData.percentualDesconto}
                onChange={(e) => handleInputChange('percentualDesconto', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Segunda linha: Valores calculados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valorComEnergyPay">Valor com EnergyPay (R$)</Label>
              <Input
                id="valorComEnergyPay"
                type="number"
                step="0.01"
                value={editableData.valorComEnergyPay}
                onChange={(e) => handleInputChange('valorComEnergyPay', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="valorPagar">Valor a Pagar (R$)</Label>
              <Input
                id="valorPagar"
                type="number"
                step="0.01"
                value={editableData.valorPagar}
                onChange={(e) => handleInputChange('valorPagar', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Terceira linha: Economia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="economiaMes">Economia do Mês (R$)</Label>
              <Input
                id="economiaMes"
                type="number"
                step="0.01"
                value={editableData.economiaMes}
                onChange={(e) => handleInputChange('economiaMes', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="calculoEconomia">Cálculo da Economia (R$)</Label>
              <Input
                id="calculoEconomia"
                type="number"
                step="0.01"
                value={editableData.calculoEconomia}
                onChange={(e) => handleInputChange('calculoEconomia', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="economiaAcumulada">Economia Acumulada (R$)</Label>
              <Input
                id="economiaAcumulada"
                type="number"
                step="0.01"
                value={editableData.economiaAcumulada}
                onChange={(e) => handleInputChange('economiaAcumulada', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Resumo Visual */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3">Resumo do Cálculo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-600">Valor Original</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(editableData.valorSemEnergyPay)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Desconto ({editableData.percentualDesconto}%)</p>
                <p className="text-xl font-bold text-orange-600">
                  - {formatCurrency(editableData.economiaMes)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Valor Final</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(editableData.valorComEnergyPay)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Confirmação */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800">Confirmar Cálculo</h4>
              <p className="text-sm text-green-700">
                Revise os valores calculados e clique em "Confirmar Cálculo" para prosseguir.
              </p>
            </div>
            <Button onClick={handleConfirmCalculation} size="lg" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Confirmar Cálculo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
