import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileInput } from '@/components/ui/file-input';
import { EnergyPayCalculator } from './EnergyPayCalculator';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle2 } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

interface InvoiceUploadProps {
  subscriber: SubscriberRecord;
  onDataConfirmed: (data: any) => void;
}

export function InvoiceUpload({ subscriber, onDataConfirmed }: InvoiceUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setExtractedData(null);
    setShowCalculator(false);
  };

  const handleConfirmData = () => {
    // Simulação de extração de dados da fatura
    const mockExtractedData = {
      nomeCliente: 'Nome do Cliente Mock',
      numeroFatura: '123456',
      valorTotal: 1000,
      consumoKwh: 500,
      referencia: '08/2024'
    };

    setExtractedData(mockExtractedData);
    setShowCalculator(true);
  };

  const handleCalculationConfirmed = useCallback((data: any) => {
    console.log('Dados confirmados no InvoiceUpload:', data);
    onDataConfirmed({ extractedData, energyPayData: data });
  }, [extractedData, onDataConfirmed]);

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Upload da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <FileInput onFileChange={handleFileChange} />
          {file && (
            <div className="mt-4">
              <Label>Arquivo selecionado:</Label>
              <p>{file.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted Data Display */}
      {extractedData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Dados Extraídos da Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-blue-700">Nome do Cliente</Label>
                <p className="font-semibold text-blue-800">{extractedData.nomeCliente}</p>
              </div>
              <div>
                <Label className="text-blue-700">UC</Label>
                <p className="font-semibold text-blue-800">{extractedData.numeroFatura}</p>
              </div>
              <div>
                <Label className="text-blue-700">Valor Total</Label>
                <p className="font-semibold text-blue-800">{formatCurrency(extractedData.valorTotal)}</p>
              </div>
              <div>
                <Label className="text-blue-700">Consumo (kWh)</Label>
                <p className="font-semibold text-blue-800">{extractedData.consumoKwh} kWh</p>
              </div>
              <div>
                <Label className="text-blue-700">Referência</Label>
                <p className="font-semibold text-blue-800">{extractedData.referencia}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleConfirmData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar Dados e Calcular EnergyPay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* EnergyPay Calculator */}
      {extractedData && showCalculator && (
        <EnergyPayCalculator
          valorOriginal={extractedData.valorTotal}
          percentualDesconto={20} // Valor padrão, será sobrescrito pelo cadastro do assinante
          consumoKwh={extractedData.consumoKwh}
          referencia={extractedData.referencia}
          subscriber={subscriber} // Passando o subscriber para puxar o desconto
          onCalculationConfirmed={handleCalculationConfirmed}
        />
      )}
    </div>
  );
}
