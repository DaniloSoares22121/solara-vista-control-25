
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
import { supabase } from '@/integrations/supabase/client';

interface InvoiceCalculationAPIProps {
  extractedData: any;
  subscriber: SubscriberRecord;
  onCalculationConfirmed: (data: any) => void;
}

interface ConsumptionLine {
  description: string;
  quantity: number;
  tax_no_rates: number;
  tax_with_rates: number;
  total_value: number;
  icms_base: number;
  icms_aliq: number;
  icms: number;
  pis_cofins_base: number;
  pis: number;
  cofins: number;
}

interface HistoricalConsumption {
  reference: string;
  consume_ponta: number;
  consume_fora_ponta: number;
}

interface APICalculationResult {
  consumer_unit: string;
  month_reference: string;
  invoice_value: number;
  consumo_nao_compensado: ConsumptionLine;
  consumo_scee: ConsumptionLine;
  injecao_scee: ConsumptionLine;
  valor_energia_injetada_sem_desconto: number;
  valor_energia_injetada_com_desconto: number;
  total_impostos: number;
  total_financeiro: number;
  valor_final_fatura: number;
  historical_consumption: HistoricalConsumption[];
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
      console.log('Enviando dados para edge function:', extractedData);
      
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

      const discount = subscriber.plan_details?.discount_percentage || 15.0;

      console.log('Chamando edge function com payload:', apiPayload);
      console.log('Desconto aplicado:', discount);

      const { data, error } = await supabase.functions.invoke('calculate-invoice', {
        body: {
          payload: apiPayload,
          discount: discount
        }
      });

      if (error) {
        throw new Error(`Erro na edge function: ${error.message}`);
      }

      console.log('Resposta da API via edge function:', data);

      setCalculationResult(data);
      setEditableResult(data);
      toast.success('Cálculo realizado com sucesso via API!');
      
    } catch (error) {
      console.error('Erro ao calcular via API:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(`Erro no cálculo: ${errorMessage}`);
      
    } finally {
      setCalculating(false);
    }
  };

  const handleConsumptionLineChange = (lineType: 'consumo_nao_compensado' | 'consumo_scee' | 'injecao_scee', field: keyof ConsumptionLine, value: string | number) => {
    if (!editableResult) return;
    
    setEditableResult({
      ...editableResult,
      [lineType]: {
        ...editableResult[lineType],
        [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
      }
    });
  };

  const handleBasicFieldChange = (field: keyof APICalculationResult, value: string | number) => {
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
              <p className="text-sm text-muted-foreground">Enviando dados para faturas.iasolar.app.br via edge function</p>
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
          <Badge variant="secondary">Calculado via API</Badge>
        </div>
        <Button onClick={handleConfirmCalculation} className="bg-green-600 hover:bg-green-700">
          <ArrowRight className="w-4 h-4 mr-2" />
          Confirmar Cálculo
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Informações Básicas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Unidade Consumidora</Label>
              <Input
                value={editableResult.consumer_unit}
                onChange={(e) => handleBasicFieldChange('consumer_unit', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Referência do Mês</Label>
              <Input
                value={editableResult.month_reference}
                onChange={(e) => handleBasicFieldChange('month_reference', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Valor da Fatura Original</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.invoice_value}
                onChange={(e) => handleBasicFieldChange('invoice_value', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Label className="text-green-700 font-medium">Valor Energia Injetada (Sem Desconto)</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.valor_energia_injetada_sem_desconto}
                onChange={(e) => handleBasicFieldChange('valor_energia_injetada_sem_desconto', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Label className="text-green-700 font-medium">Valor Energia Injetada (Com Desconto)</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.valor_energia_injetada_com_desconto}
                onChange={(e) => handleBasicFieldChange('valor_energia_injetada_com_desconto', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Label className="text-blue-700 font-medium">Total de Impostos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.total_impostos}
                onChange={(e) => handleBasicFieldChange('total_impostos', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Label className="text-blue-700 font-medium">Total Financeiro</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.total_financeiro}
                onChange={(e) => handleBasicFieldChange('total_financeiro', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-white"
              />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <Label className="text-yellow-700 font-medium text-lg">Valor Final da Fatura</Label>
            <Input
              type="number"
              step="0.01"
              value={editableResult.valor_final_fatura}
              onChange={(e) => handleBasicFieldChange('valor_final_fatura', parseFloat(e.target.value) || 0)}
              className="mt-1 bg-white text-lg font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Consumo Não Compensado */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo Não Compensado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Quantidade (kWh)</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_nao_compensado.quantity}
                onChange={(e) => handleConsumptionLineChange('consumo_nao_compensado', 'quantity', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa sem Tributos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_nao_compensado.tax_no_rates}
                onChange={(e) => handleConsumptionLineChange('consumo_nao_compensado', 'tax_no_rates', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa com Tributos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_nao_compensado.tax_with_rates}
                onChange={(e) => handleConsumptionLineChange('consumo_nao_compensado', 'tax_with_rates', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Valor Total</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_nao_compensado.total_value}
                onChange={(e) => handleConsumptionLineChange('consumo_nao_compensado', 'total_value', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>ICMS</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_nao_compensado.icms}
                onChange={(e) => handleConsumptionLineChange('consumo_nao_compensado', 'icms', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>PIS</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_nao_compensado.pis}
                onChange={(e) => handleConsumptionLineChange('consumo_nao_compensado', 'pis', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consumo SCEE */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo SCEE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Quantidade (kWh)</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_scee.quantity}
                onChange={(e) => handleConsumptionLineChange('consumo_scee', 'quantity', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa sem Tributos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_scee.tax_no_rates}
                onChange={(e) => handleConsumptionLineChange('consumo_scee', 'tax_no_rates', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa com Tributos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_scee.tax_with_rates}
                onChange={(e) => handleConsumptionLineChange('consumo_scee', 'tax_with_rates', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Valor Total</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_scee.total_value}
                onChange={(e) => handleConsumptionLineChange('consumo_scee', 'total_value', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>ICMS</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_scee.icms}
                onChange={(e) => handleConsumptionLineChange('consumo_scee', 'icms', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>PIS</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.consumo_scee.pis}
                onChange={(e) => handleConsumptionLineChange('consumo_scee', 'pis', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Injeção SCEE */}
      <Card>
        <CardHeader>
          <CardTitle>Injeção SCEE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Quantidade (kWh)</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.injecao_scee.quantity}
                onChange={(e) => handleConsumptionLineChange('injecao_scee', 'quantity', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa sem Tributos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.injecao_scee.tax_no_rates}
                onChange={(e) => handleConsumptionLineChange('injecao_scee', 'tax_no_rates', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Taxa com Tributos</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.injecao_scee.tax_with_rates}
                onChange={(e) => handleConsumptionLineChange('injecao_scee', 'tax_with_rates', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Valor Total</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.injecao_scee.total_value}
                onChange={(e) => handleConsumptionLineChange('injecao_scee', 'total_value', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>ICMS</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.injecao_scee.icms}
                onChange={(e) => handleConsumptionLineChange('injecao_scee', 'icms', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>PIS</Label>
              <Input
                type="number"
                step="0.01"
                value={editableResult.injecao_scee.pis}
                onChange={(e) => handleConsumptionLineChange('injecao_scee', 'pis', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Consumo */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Consumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {editableResult.historical_consumption.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm">Referência</Label>
                  <p className="font-medium">{item.reference}</p>
                </div>
                <div>
                  <Label className="text-sm">Consumo Ponta</Label>
                  <p className="font-medium">{item.consume_ponta} kWh</p>
                </div>
                <div>
                  <Label className="text-sm">Consumo Fora Ponta</Label>
                  <p className="font-medium">{item.consume_fora_ponta} kWh</p>
                </div>
              </div>
            ))}
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
