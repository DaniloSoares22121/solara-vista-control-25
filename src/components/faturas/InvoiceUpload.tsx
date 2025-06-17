
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileInput } from '@/components/ui/file-input';
import { InvoiceDataExtractor } from './InvoiceDataExtractor';
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
  const [showExtractor, setShowExtractor] = useState(false);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setExtractedData(null);
    setShowCalculator(false);
    setShowExtractor(false);
  };

  const handleStartExtraction = () => {
    if (!file) return;
    setShowExtractor(true);
  };

  const handleDataExtracted = (data: any) => {
    console.log('Dados extraídos:', data);
    setExtractedData(data);
  };

  const handleDataConfirmed = (data: any) => {
    console.log('Dados confirmados:', data);
    setExtractedData(data);
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
          
          {file && !showExtractor && (
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
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleStartExtraction}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Extrair Dados da Fatura
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Extraction */}
      {file && showExtractor && (
        <InvoiceDataExtractor
          file={file}
          onDataExtracted={handleDataExtracted}
          onDataConfirmed={handleDataConfirmed}
        />
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
