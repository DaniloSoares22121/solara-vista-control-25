
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingDown, ArrowRight, Save, Zap } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface EnergyPayData {
  energiaInjetada: number;
  precoUnitario: number;
  valorBruto: number;
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
    energiaInjetada: 0,
    precoUnitario: 0.964401, // Valor padrão baseado no exemplo
    valorBruto: 0,
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
  }, [valorOriginal, percentualDesconto, consumoKwh]);

  const calculateEnergyPayValues = () => {
    // Estimar energia injetada baseada no consumo (pode ser ajustado)
    const energiaInjetadaEstimada = consumoKwh;
    const precoUnitarioPadrao = 0.964401;
    
    // Passo 1: Calcular valor bruto (energia injetada × preço unitário)
    const valorBruto = energiaInjetadaEstimada * precoUnitarioPadrao;
    
    // Passo 2: Calcular desconto
    const valorDesconto = valorBruto * (percentualDesconto / 100);
    
    // Passo 3: Calcular valor final
    const valorFinal = valorBruto - valorDesconto;

    const calculatedData: EnergyPayData = {
      energiaInjetada: energiaInjetadaEstimada,
      precoUnitario: precoUnitarioPadrao,
      valorBruto: valorBruto,
      valorSemEnergyPay: valorBruto,
      valorComEnergyPay: valorFinal,
      valorPagar: valorFinal,
      economiaMes: valorDesconto,
      calculoEconomia: valorDesconto,
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
      if (field === 'energiaInjetada' || field === 'precoUnitario' || field === 'percentualDesconto') {
        const energiaInjetada = field === 'energiaInjetada' ? numericValue : updated.energiaInjetada;
        const precoUnitario = field === 'precoUnitario' ? numericValue : updated.precoUnitario;
        const percentual = field === 'percentualDesconto' ? numericValue : updated.percentualDesconto;
        
        // Passo 1: Valor bruto = energia injetada × preço unitário
        const valorBruto = energiaInjetada * precoUnitario;
        
        // Passo 2: Valor do desconto = valor bruto × (percentual / 100)
        const valorDesconto = valorBruto * (percentual / 100);
        
        // Passo 3: Valor final = valor bruto - desconto
        const valorFinal = valorBruto - valorDesconto;

        updated.valorBruto = valorBruto;
        updated.valorSemEnergyPay = valorBruto;
        updated.valorComEnergyPay = valorFinal;
        updated.valorPagar = valorFinal;
        updated.economiaMes = valorDesconto;
        updated.calculoEconomia = valorDesconto;
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
          <Badge variant="secondary">Método Correto</Badge>
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
              <Label className="text-blue-700">Valor Original da Fatura</Label>
              <p className="text-lg font-semibold text-blue-800">
                {formatCurrency(valorOriginal)}
              </p>
            </div>
            <div>
              <Label className="text-blue-700">Consumo/Energia</Label>
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

      {/* Fórmula de Cálculo */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Zap className="w-5 h-5" />
            <span>Fórmula de Cálculo EnergyPay</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-amber-700 space-y-2">
            <p><strong>Passo 1:</strong> Valor Bruto = Energia Injetada × Preço Unitário</p>
            <p><strong>Passo 2:</strong> Valor do Desconto = Valor Bruto × (Percentual ÷ 100)</p>
            <p><strong>Passo 3:</strong> Valor Final = Valor Bruto - Valor do Desconto</p>
          </div>
          <div className="bg-white p-3 rounded border text-xs font-mono">
            <p>Valor Bruto = {editableData.energiaInjetada.toFixed(2)} × {editableData.precoUnitario.toFixed(6)} = {formatCurrency(editableData.valorBruto)}</p>
            <p>Desconto = {formatCurrency(editableData.valorBruto)} × {editableData.percentualDesconto}% = {formatCurrency(editableData.economiaMes)}</p>
            <p>Valor Final = {formatCurrency(editableData.valorBruto)} - {formatCurrency(editableData.economiaMes)} = {formatCurrency(editableData.valorComEnergyPay)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Parâmetros de Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span>Parâmetros de Cálculo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primeira linha: Parâmetros base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="energiaInjetada">Energia Injetada (kWh)</Label>
              <Input
                id="energiaInjetada"
                type="number"
                step="0.01"
                value={editableData.energiaInjetada}
                onChange={(e) => handleInputChange('energiaInjetada', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="precoUnitario">Preço Unitário (R$/kWh)</Label>
              <Input
                id="precoUnitario"
                type="number"
                step="0.000001"
                value={editableData.precoUnitario}
                onChange={(e) => handleInputChange('precoUnitario', e.target.value)}
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
              <Label htmlFor="valorBruto">Valor Bruto (R$)</Label>
              <Input
                id="valorBruto"
                type="number"
                step="0.01"
                value={editableData.valorBruto}
                onChange={(e) => handleInputChange('valorBruto', e.target.value)}
                className="mt-1 bg-gray-50"
                readOnly
              />
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-600">Energia Injetada</p>
                <p className="text-lg font-bold text-blue-600">
                  {editableData.energiaInjetada.toFixed(2)} kWh
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Valor Bruto</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(editableData.valorBruto)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Desconto ({editableData.percentualDesconto}%)</p>
                <p className="text-lg font-bold text-orange-600">
                  - {formatCurrency(editableData.economiaMes)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Valor Final</p>
                <p className="text-lg font-bold text-green-600">
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
                Revise os valores calculados usando o método correto e clique em "Confirmar Cálculo" para prosseguir.
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
