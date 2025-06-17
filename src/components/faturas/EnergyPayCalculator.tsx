
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingDown, ArrowRight, Save, Zap, User } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
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
  subscriber?: SubscriberRecord;
  onCalculationConfirmed?: (data: EnergyPayData) => void;
}

export function EnergyPayCalculator({ 
  valorOriginal, 
  percentualDesconto, 
  consumoKwh, 
  referencia,
  subscriber,
  onCalculationConfirmed 
}: EnergyPayCalculatorProps) {
  const [editableData, setEditableData] = useState<EnergyPayData>({
    energiaInjetada: 0,
    precoUnitario: 0.964401,
    valorBruto: 0,
    valorSemEnergyPay: 0,
    valorComEnergyPay: 0,
    valorPagar: 0,
    economiaMes: 0,
    calculoEconomia: 0,
    economiaAcumulada: 0,
    percentualDesconto: 0
  });

  // Buscar o percentual de desconto do cadastro do assinante
  const getSubscriberDiscount = () => {
    if (subscriber?.plan_contract?.discountPercentage) {
      return subscriber.plan_contract.discountPercentage;
    }
    // Fallback para o percentual passado como prop
    return percentualDesconto;
  };

  // Determinar o preço unitário baseado no tipo de geração e percentual de desconto
  const getPrecoUnitarioPadrao = (percentual: number) => {
    if (percentual === 15) {
      // Autoconsumo Remoto (sem PIS/COFINS) - 15%
      return 0.964401;
    } else if (percentual === 20) {
      // Geração Compartilhada (com PIS/COFINS) - 20%
      return 0.964401;
    } else if (percentual === 25) {
      // Geração Compartilhada com desconto maior - 25%
      return 0.990723;
    }
    return 0.964401; // Padrão
  };

  useEffect(() => {
    calculateEnergyPayValues();
  }, [valorOriginal, consumoKwh, subscriber]);

  const calculateEnergyPayValues = () => {
    // Usar o desconto do cadastro do assinante
    const descontoAssinante = getSubscriberDiscount();
    
    // Usar energia injetada baseada no consumo (na prática vem da extração da fatura)
    const energiaInjetadaEstimada = consumoKwh;
    const precoUnitarioPadrao = getPrecoUnitarioPadrao(descontoAssinante);
    
    // Cálculo: Valor Bruto = Energia Injetada × Preço Unitário
    const valorBruto = energiaInjetadaEstimada * precoUnitarioPadrao;
    
    // Cálculo: Desconto = Valor Bruto × (Percentual ÷ 100)
    const valorDesconto = valorBruto * (descontoAssinante / 100);
    
    // Cálculo: Valor Final = Valor Bruto - Desconto
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
      economiaAcumulada: 0,
      percentualDesconto: descontoAssinante
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

      // Recalcular quando mudarem os valores base
      if (field === 'energiaInjetada' || field === 'precoUnitario' || field === 'percentualDesconto') {
        const energiaInjetada = field === 'energiaInjetada' ? numericValue : updated.energiaInjetada;
        const precoUnitario = field === 'precoUnitario' ? numericValue : updated.precoUnitario;
        const percentual = field === 'percentualDesconto' ? numericValue : updated.percentualDesconto;
        
        // Cálculo correto: Valor Bruto = Energia × Preço
        const valorBruto = energiaInjetada * precoUnitario;
        
        // Cálculo correto: Desconto = Valor Bruto × (Percentual ÷ 100)
        const valorDesconto = valorBruto * (percentual / 100);
        
        // Cálculo correto: Valor Final = Valor Bruto - Desconto
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

  const getSubscriberName = () => {
    if (!subscriber) return 'Assinante não selecionado';
    const subscriberData = subscriber.subscriber;
    return subscriberData?.fullName || subscriberData?.companyName || subscriberData?.razaoSocial || 'Nome não informado';
  };

  const subscriberDiscountPercentage = getSubscriberDiscount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Cálculo da Fatura EnergyPay</h3>
          <Badge variant="secondary">Desconto do Assinante</Badge>
        </div>
        <Button onClick={handleConfirmCalculation} className="bg-green-600 hover:bg-green-700">
          <ArrowRight className="w-4 h-4 mr-2" />
          Confirmar Cálculo
        </Button>
      </div>

      {/* Informações do Assinante */}
      {subscriber && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <User className="w-5 h-5" />
              <span>Dados do Assinante</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">Nome do Assinante</Label>
                <p className="text-lg font-semibold text-blue-800">
                  {getSubscriberName()}
                </p>
              </div>
              <div>
                <Label className="text-blue-700">Percentual de Desconto Cadastrado</Label>
                <p className="text-lg font-semibold text-blue-800">
                  {subscriberDiscountPercentage}%
                </p>
                <p className="text-xs text-blue-600">
                  (Valor do cadastro do assinante)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Label className="text-blue-700">Consumo Total</Label>
              <p className="text-lg font-semibold text-blue-800">
                {consumoKwh} kWh
              </p>
              <p className="text-xs text-blue-600">
                (Use o valor da INJEÇÃO SCEE abaixo)
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

      {/* Explicação do Cálculo com Exemplos Reais */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Zap className="w-5 h-5" />
            <span>Fórmula Correta - Exemplo do Assinante</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-amber-700 space-y-2">
            <p><strong>IMPORTANTE:</strong> Use o valor da <strong>INJEÇÃO SCEE</strong> da fatura</p>
            <p><strong>Fórmula:</strong> Valor Final = (Energia × Preço Unitário) × (1 - Desconto%)</p>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-green-800 mb-2">Cálculo para este Assinante ({subscriberDiscountPercentage}%):</h4>
            <div className="text-sm space-y-1 font-mono">
              <p>{editableData.energiaInjetada.toFixed(2)} kWh × R$ {editableData.precoUnitario.toFixed(6)} = {formatCurrency(editableData.valorBruto)}</p>
              <p>{formatCurrency(editableData.valorBruto)} × (1 - {subscriberDiscountPercentage}%) = {formatCurrency(editableData.valorComEnergyPay)}</p>
              <p className="font-semibold text-green-700">Resultado: {formatCurrency(editableData.valorComEnergyPay)}</p>
              <p className="font-semibold text-blue-700">Economia: {formatCurrency(editableData.economiaMes)}</p>
            </div>
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
              <Label htmlFor="energiaInjetada">Energia Injetada SCEE (kWh) *</Label>
              <Input
                id="energiaInjetada"
                type="number"
                step="0.01"
                value={editableData.energiaInjetada}
                onChange={(e) => handleInputChange('energiaInjetada', e.target.value)}
                className="mt-1"
                placeholder="Ex: 8458.00"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Valor da linha "INJEÇÃO SCEE" da fatura
              </p>
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
                placeholder="0.964401"
              />
              <p className="text-xs text-muted-foreground mt-1">
                15%/20%: R$ 0,964401 | 25%: R$ 0,990723
              </p>
            </div>
            <div>
              <Label htmlFor="percentualDesconto">Percentual de Desconto (%)</Label>
              <Input
                id="percentualDesconto"
                type="number"
                step="0.01"
                value={editableData.percentualDesconto}
                onChange={(e) => handleInputChange('percentualDesconto', e.target.value)}
                className="mt-1 bg-green-50 border-green-200"
                placeholder="Ex: 15, 20 ou 25"
              />
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ Valor do cadastro do assinante: {subscriberDiscountPercentage}%
              </p>
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
                value={editableData.valorBruto.toFixed(2)}
                className="mt-1 bg-gray-50"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">
                Energia × Preço Unitário
              </p>
            </div>
            <div>
              <Label htmlFor="valorComEnergyPay">Valor com EnergyPay (R$)</Label>
              <Input
                id="valorComEnergyPay"
                type="number"
                step="0.01"
                value={editableData.valorComEnergyPay.toFixed(2)}
                className="mt-1 bg-green-50 border-green-200 font-semibold"
                readOnly
              />
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ Valor Final = Valor Bruto × (1 - {subscriberDiscountPercentage}%)
              </p>
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
                O desconto de {subscriberDiscountPercentage}% foi aplicado conforme o cadastro do assinante.
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
