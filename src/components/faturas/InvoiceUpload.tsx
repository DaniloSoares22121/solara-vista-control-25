
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileInput } from '@/components/ui/file-input';
import { EnergyPayCalculator } from './EnergyPayCalculator';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle2, Upload, FileText } from 'lucide-react';
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

  const handleExtractData = () => {
    if (!file) return;
    
    // Simulação de extração de dados da fatura
    const mockExtractedData = {
      nomeCliente: 'Nome do Cliente Mock',
      numeroFatura: '123456',
      valorTotal: 1000,
      consumoKwh: 500,
      referencia: '08/2024'
    };

    setExtractedData(mockExtractedData);
  };

  const handleConfirmData = () => {
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
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-green-600" />
            <span>Upload da Fatura</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700 mb-2 block">
              Selecione o arquivo da fatura da Equatorial
            </Label>
            <FileInput 
              onFileChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          
          {file && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <Label className="text-green-700 font-medium">Arquivo selecionado:</Label>
                  <p className="text-green-800 font-semibold">{file.name}</p>
                  <p className="text-sm text-green-600">
                    Tamanho: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!extractedData && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleExtractData}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Extrair Dados da Fatura
                  </Button>
                </div>
              )}
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
