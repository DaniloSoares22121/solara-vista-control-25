
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calculator, Eye, Send } from 'lucide-react';
import { toast } from 'sonner';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { useInvoiceCalculation } from '@/hooks/useInvoiceCalculation';
import APIConfirmationModal from './APIConfirmationModal';

interface InvoiceCalculationAPIProps {
  extractedData: any;
  subscriber: SubscriberRecord;
  onCalculationConfirmed: (data: any) => void;
}

export function InvoiceCalculationAPI({ extractedData, subscriber, onCalculationConfirmed }: InvoiceCalculationAPIProps) {
  const [isReady, setIsReady] = useState(false);
  const [jsonPayload, setJsonPayload] = useState<any>(null);

  const {
    isConfirmationModalOpen,
    pendingCalculation,
    isCalculating,
    calculationResult,
    prepareCalculationData,
    showConfirmationModal,
    sendToCalculationAPI,
    closeConfirmationModal
  } = useInvoiceCalculation();

  useEffect(() => {
    if (extractedData && subscriber) {
      prepareDataForConfirmation();
    }
  }, [extractedData, subscriber]);

  const prepareDataForConfirmation = () => {
    // Obter a porcentagem de desconto do assinante
    const discountPercentage = subscriber.plan_details?.discount_percentage || 15.0;
    
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
      // INCLUINDO A PORCENTAGEM DE DESCONTO DO ASSINANTE
      porcentagem_desconto_cliente: discountPercentage,
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

    console.log('📋 Dados preparados para confirmação:', apiPayload);
    console.log(`💰 Desconto do assinante: ${discountPercentage}%`);

    setJsonPayload(apiPayload);
    setIsReady(true);
  };

  const handleShowConfirmation = () => {
    if (!jsonPayload) return;

    const discountPercentage = subscriber.plan_details?.discount_percentage || 15.0;
    
    const calculationData = prepareCalculationData(
      jsonPayload, 
      discountPercentage, 
      subscriber.id
    );

    showConfirmationModal(calculationData);
  };

  const handleConfirmCalculation = async () => {
    try {
      const result = await sendToCalculationAPI();
      onCalculationConfirmed(result);
      toast.success('Cálculo realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar cálculo:', error);
      toast.error('Erro ao realizar cálculo. Tente novamente.');
    }
  };

  if (!isReady) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <div>
              <p className="font-medium">Preparando dados para cálculo...</p>
              <p className="text-sm text-muted-foreground">Configurando payload para API de cálculo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const discountPercentage = subscriber.plan_details?.discount_percentage || 15.0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <span>Cálculo EnergyPay</span>
              <Badge variant="secondary">Aguardando Confirmação</Badge>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Desconto: {discountPercentage}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">Dados Preparados</h4>
                <p className="text-sm text-blue-700">
                  Os dados foram mapeados e incluem a porcentagem de desconto de <strong>{discountPercentage}%</strong> configurada para este assinante.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded border p-3 mb-4">
              <h5 className="font-medium text-gray-800 mb-2">Informações principais:</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Cliente:</strong> {jsonPayload?.legal_name}</div>
                <div><strong>UC:</strong> {jsonPayload?.consumer_unit}</div>
                <div><strong>Referência:</strong> {jsonPayload?.month_reference}</div>
                <div><strong>Valor Fatura:</strong> R$ {jsonPayload?.invoice_value?.toFixed(2)}</div>
                <div><strong>Consumo:</strong> {jsonPayload?.compensated_energy} kWh</div>
                <div><strong>Desconto Cliente:</strong> {jsonPayload?.porcentagem_desconto_cliente}%</div>
              </div>
            </div>

            <Button 
              onClick={handleShowConfirmation}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Revisar JSON e Enviar para Cálculo
            </Button>
          </div>

          {calculationResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ Cálculo Realizado</h4>
              <p className="text-sm text-green-700">
                O cálculo foi processado com sucesso pela API.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação */}
      <APIConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmCalculation}
        jsonData={pendingCalculation?.payload}
        discount={pendingCalculation?.discount || discountPercentage}
        consumerUnit={jsonPayload?.consumer_unit || ''}
      />
    </div>
  );
}
