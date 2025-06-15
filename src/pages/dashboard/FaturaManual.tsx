
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Loader2, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtractedData {
  uc: string;
  mesReferencia: string;
  vencimento: string;
  valorTotal: string;
  consumoKwh: string;
  demandaKw: string;
  cliente: string;
  endereco: string;
  tipoTarifa: string;
  grupo: string;
}

const FaturaManual: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validar se é PDF
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, selecione apenas arquivos PDF.');
      return;
    }

    // Validar tamanho (máx 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setExtractedData(null);
  };

  const removeFile = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
    // Limpar o input
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const extractDataFromPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simular extração de dados (aqui você implementaria a lógica real de extração)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Dados simulados - em produção, isso viria da extração real do PDF
      const mockData: ExtractedData = {
        uc: '1234567890',
        mesReferencia: 'Janeiro/2024',
        vencimento: '15/02/2024',
        valorTotal: 'R$ 245,67',
        consumoKwh: '387 kWh',
        demandaKw: '2,5 kW',
        cliente: 'João Silva Santos',
        endereco: 'Rua das Flores, 123 - Centro - São Luís/MA',
        tipoTarifa: 'Convencional B1',
        grupo: 'B1 - Residencial'
      };

      setExtractedData(mockData);
      toast({
        title: "Dados extraídos com sucesso!",
        description: "Informações da fatura foram processadas.",
      });

    } catch (error) {
      console.error('Erro ao extrair dados:', error);
      setError('Erro ao processar o PDF. Tente novamente.');
      toast({
        title: "Erro ao processar fatura",
        description: "Não foi possível extrair os dados do PDF.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fatura Manual</h1>
          <p className="text-gray-600">Faça upload de uma fatura da Equatorial para extrair os dados</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Upload da Fatura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Button
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Fatura PDF
                </Button>
                <p className="text-sm text-gray-600">
                  Clique para fazer upload da fatura da Equatorial
                </p>
                <p className="text-xs text-gray-500">
                  Formato: PDF (máx. 10MB)
                </p>
              </div>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-green-300 bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {file && !extractedData && (
            <Button
              onClick={extractDataFromPDF}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extraindo dados...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Extrair Dados da Fatura
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Extracted Data Section */}
      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Dados Extraídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">UC (Unidade Consumidora)</label>
                  <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded border">
                    {extractedData.uc}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Cliente</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.cliente}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Endereço</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.endereco}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Mês de Referência</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.mesReferencia}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Vencimento</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.vencimento}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Valor Total</label>
                  <p className="text-gray-900 font-semibold text-lg bg-blue-50 p-2 rounded border border-blue-200">
                    {extractedData.valorTotal}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Consumo</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.consumoKwh}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Demanda</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.demandaKw}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Tarifa</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.tipoTarifa}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Grupo</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                    {extractedData.grupo}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Dados
              </Button>
              <Button variant="outline" onClick={() => setExtractedData(null)}>
                Processar Nova Fatura
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">📋 Informações Importantes</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Formato aceito:</strong> Apenas arquivos PDF</p>
            <p><strong>Tamanho máximo:</strong> 10MB por arquivo</p>
            <p><strong>Distribuidora:</strong> Faturas da Equatorial Energia</p>
            <p><strong>Qualidade:</strong> Certifique-se de que o PDF esteja legível e não seja uma imagem escaneada</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaturaManual;
