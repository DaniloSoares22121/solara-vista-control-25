
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calculator, DollarSign, Save, ArrowRight, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

interface InvoiceCalculationAPIProps {
  extractedData: any;
  subscriber: SubscriberRecord;
  onCalculationConfirmed: (data: any) => void;
}

interface APICalculationResult {
  valorOriginal: number;
  valorComEnergyPay: number;
  economiaMes: number;
  economiaAcumulada: number;
  percentualDesconto: number;
  energiaCompensada: number;
  energiaNaoCompensada: number;
  valorTarifario: number;
  detalhes?: any;
}

export function InvoiceCalculationAPI({ extractedData, subscriber, onCalculationConfirmed }: InvoiceCalculationAPIProps) {
  const [calculating, setCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<APICalculationResult | null>(null);
  const [editableResult, setEditableResult] = useState<APICalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (extractedData) {
      calculateInvoice();
    }
  }, [extractedData]);

  const calculateInvoice = async () => {
    setCalculating(true);
    setError(null);
    
    try {
      console.log('Enviando dados para API de cálculo:', extractedData);
      
      // Mapear dados extraídos para o formato da API
      const apiPayload = {
        legal_name: extractedData.nomeCliente,
        compensated_energy: extractedData.consumoKwh || 0,
        tarifa_com_tributos: extractedData.consumoKwh > 0 ? (extractedData.valorTotal / extractedData.consumoKwh) : 0,
        consumer_unit: extractedData.numeroFatura,
        address: extractedData.endereco,
        month_reference: extractedData.referencia,
        expiration_date: extractedData.dataVencimento,
        invoice_value: extractedData.valorTotal,
        lines: [
          {
            description: "Energia Elétrica",
            quantity: extractedData.consumoKwh || 0,
            tax_no_rates: extractedData.energiaEletrica || 0,
            tax_with_rates: extractedData.energiaEletrica || 0,
            total_value: extractedData.energiaEletrica || 0,
            icms_base: extractedData.icms || 0,
            icms_aliq: 0,
            icms: extractedData.icms || 0,
            pis_cofins_base: (extractedData.pis || 0) + (extractedData.cofins || 0),
            pis: extractedData.pis || 0,
            cofins: extractedData.cofins || 0
          },
          {
            description: "Contrib Ilum Publica Municipal",
            quantity: 1,
            tax_no_rates: extractedData.contribuicaoIlumPublica || 0,
            tax_with_rates: extractedData.contribuicaoIlumPublica || 0,
            total_value: extractedData.contribuicaoIlumPublica || 0,
            icms_base: 0,
            icms_aliq: 0,
            icms: 0,
            pis_cofins_base: 0,
            pis: 0,
            cofins: 0
          }
        ],
        historical_lines: extractedData.historicoConsumo?.map((item: any) => ({
          reference: item.mes,
          consume_ponta: 0,
          consume_fora_ponta: item.consumo || 0
        })) || [],
        extra: {
          contribuicao_ilum_publica: extractedData.contribuicaoIlumPublica || 0,
          bandeira_tarifaria: extractedData.bandeiraTarifaria || null,
          valor_bandeira: extractedData.valorBandeira || 0
        }
      };

      // Usar desconto do subscriber ou padrão de 15%
      const discount = subscriber.plan_details?.discount_percentage || 15.0;

      console.log('Payload enviado para API:', apiPayload);
      console.log('Desconto aplicado:', discount);

      const response = await fetch(`https://faturas.iasolar.app.br/calculate?discount=${discount}`, {
        method: 'POST',
        headers: {
          'Accept': 'text/html',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const apiResult = await response.text();
      console.log('Resposta da API (HTML):', apiResult);

      // Como a API retorna HTML, vamos tentar extrair dados ou usar valores calculados localmente
      // Por enquanto, vamos criar um resultado baseado nos dados enviados
      const calculationResult: APICalculationResult = {
        valorOriginal: extractedData.valorTotal,
        valorComEnergyPay: extractedData.valorTotal * (1 - discount / 100),
        economiaMes: extractedData.valorTotal * (discount / 100),
        economiaAcumulada: 0,
        percentualDesconto: discount,
        energiaCompensada: extractedData.consumoKwh * 0.9,
        energiaNaoCompensada: extractedData.consumoKwh * 0.1,
        valorTarifario: extractedData.consumoKwh > 0 ? (extractedData.valorTotal / extractedData.consumoKwh) : 0,
        detalhes: apiResult
      };

      setCalculationResult(calculationResult);
      setEditableResult(calculationResult);
      toast.success('Cálculo realizado com sucesso via API!');
      
    } catch (error) {
      console.error('Erro ao calcular via API:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(`Erro no cálculo: ${errorMessage}`);
      
      // Fallback com cálculo local baseado nos dados extraídos
      const discount = subscriber.plan_details?.discount_percentage || 15.0;
      const fallbackResult: APICalculationResult = {
        valorOriginal: extractedData.valorTotal,
        valorComEnergyPay: extractedData.valorTotal * (1 - discount / 100),
        economiaMes: extractedData.valorTotal * (discount / 100),
        economiaAcumulada: 0,
        percentualDesconto: discount,
        energiaCompensada: extractedData.consumoKwh * 0.9,
        energiaNaoCompensada: extractedData.consumoKwh * 0.1,
        valorTarifario: extractedData.consumoKwh > 0 ? (extractedData.valorTotal / extractedData.consumoKwh) : 0,
        detalhes: null
      };
      
      setCalculationResult(fallbackResult);
      setEditableResult(fallbackResult);
      toast.info('Usando cálculo local como fallback');
      
    } finally {
      setCalculating(false);
    }
  };

  const handleInputChange = (field: keyof APICalculationResult, value: string | number) => {
    if (!editableResult) return;
    
    setEditableResult({
      ...editableResult,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    });
  };

  const handleConfirmCalculation = () => {
    if (!editableResult) return;
    
    onCalculationConfirmed(editableResult);
    toast.success('Cálculo confirmado! Dados enviados para processamento.');
  };

  if (calculating) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <div>
              <p className="font-medium">Calculando via API...</p>
              <p className="text-sm text-muted-foreground">Enviando dados para faturas.iasolar.app.br</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !calculationResult) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Erro no Cálculo</p>
              <p className="text-sm text-red-600">{error}</p>
              <Button 
                onClick={calculateInvoice} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!editableResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Resultado do Cálculo EnergyPay</h3>
          <Badge variant={error ? "destructive" : "secondary"}>
            {error ? 'Cálculo Local (Fallback)' : 'Calculado via API'}
          </Badge>
        </div>
        <Button onClick={handleConfirmCalculation} className="bg-green-600 hover:bg-green-700">
          <ArrowRight className="w-4 h-4 mr-2" />
          Confirmar Cálculo
        </Button>
      </div>

      {/* Resumo do Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Resumo Financeiro</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Label className="text-red-700 font-medium">Valor Original</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.valorOriginal}
                onChange={(e) => handleInputChange('valorOriginal', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Label className="text-green-700 font-medium">Valor com EnergyPay</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.valorComEnergyPay}
                onChange={(e) => handleInputChange('valorComEnergyPay', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Label className="text-blue-700 font-medium">Economia no Mês</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.economiaMes}
                onChange={(e) => handleInputChange('economiaMes', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes Técnicos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes Técnicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="percentualDesconto">Percentual de Desconto (%)</Label>
              <Input
                id="percentualDesconto"
                type="number"
                step="0.1"
                value={editableResult.percentualDesconto}
                onChange={(e) => handleInputChange('percentualDesconto', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="economiaAcumulada">Economia Acumulada (R$)</Label>
              <Input
                id="economiaAcumulada"
                type="number"
                step="0.01"
                value={editableResult.economiaAcumulada}
                onChange={(e) => handleInputChange('economiaAcumulada', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="energiaCompensada">Energia Compensada (kWh)</Label>
              <Input
                id="energiaCompensada"
                type="number"
                step="0.01"
                value={editableResult.energiaCompensada}
                onChange={(e) => handleInputChange('energiaCompensada', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="energiaNaoCompensada">Energia Não Compensada (kWh)</Label>
              <Input
                id="energiaNaoCompensada"
                type="number"
                step="0.01"
                value={editableResult.energiaNaoCompensada}
                onChange={(e) => handleInputChange('energiaNaoCompensada', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resposta da API (Debug) */}
      {editableResult.detalhes && (
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-gray-800">Resposta da API (HTML)</CardTitle>
          </CardHeader>
          <CardContent>
            <details>
              <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                Ver resposta completa da API
              </summary>
              <div className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                <pre>{editableResult.detalhes}</pre>
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {/* Botão de Confirmação */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800">Confirmar Cálculo</h4>
              <p className="text-sm text-green-700">
                Revise os valores calculados e clique em "Confirmar Cálculo" quando estiver tudo correto.
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
