
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, User, Zap, DollarSign, Calendar, Hash, MapPin, Phone, Building2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';

interface ExtractedInvoiceData {
  // Dados do cliente
  nomeCliente: string;
  cpfCnpj: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  
  // Dados da fatura
  numeroFatura: string;
  referencia: string;
  dataEmissao: string;
  dataVencimento: string;
  valorTotal: number;
  
  // Dados da instalação
  numeroInstalacao: string;
  classe: string;
  subgrupo: string;
  modalidadeTarifaria: string;
  
  // Consumo
  consumoKwh: number;
  demandaKw?: number;
  
  // Valores detalhados
  energiaEletrica: number;
  contribuicaoIlumPublica: number;
  icms: number;
  pis: number;
  cofins: number;
  
  // Histórico de consumo (últimos 13 meses)
  historicoConsumo: Array<{
    mes: string;
    consumo: number;
    valor: number;
  }>;
  
  // Bandeira tarifária
  bandeiraTarifaria?: string;
  valorBandeira?: number;
  
  // Código de barras
  codigoBarras: string;
}

interface InvoiceDataExtractorProps {
  file: File;
  onDataExtracted: (data: ExtractedInvoiceData) => void;
}

export function InvoiceDataExtractor({ file, onDataExtracted }: InvoiceDataExtractorProps) {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);

  useEffect(() => {
    if (file) {
      extractInvoiceData(file);
    }
  }, [file]);

  const extractInvoiceData = async (pdfFile: File) => {
    setExtracting(true);
    
    try {
      // Aqui você integraria com um serviço de OCR/extração de dados
      // Por enquanto, vou simular com dados fictícios baseados na estrutura real
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockData: ExtractedInvoiceData = {
        // Dados do cliente
        nomeCliente: "FERNANDO HUGO MACHADO DE REZENDE",
        cpfCnpj: "000.745.351-53",
        endereco: "AV FLAMBOYANT, 99999 Q. 18, L. 17, CASA - 02",
        cidade: "Goiânia",
        uf: "GO",
        cep: "74855-340",
        
        // Dados da fatura
        numeroFatura: "5/2025",
        referencia: "MAI/2025",
        dataEmissao: "12/06/2025",
        dataVencimento: "20/06/2025",
        valorTotal: 6284.64,
        
        // Dados da instalação
        numeroInstalacao: "1000052091",
        classe: "Residencial Trifásico",
        subgrupo: "B1",
        modalidadeTarifaria: "Convencional",
        
        // Consumo
        consumoKwh: 8558,
        demandaKw: 15.2,
        
        // Valores detalhados
        energiaEletrica: 8666.01,
        contribuicaoIlumPublica: 45.89,
        icms: 1205.67,
        pis: 89.45,
        cofins: 412.33,
        
        // Histórico de consumo
        historicoConsumo: [
          { mes: "MAI/2025", consumo: 8558, valor: 6284.64 },
          { mes: "ABR/2025", consumo: 7892, valor: 5789.32 },
          { mes: "MAR/2025", consumo: 8123, valor: 5945.78 },
          { mes: "FEV/2025", consumo: 7654, valor: 5612.89 },
          { mes: "JAN/2025", consumo: 8234, valor: 6034.56 },
          { mes: "DEZ/2024", consumo: 7998, valor: 5867.23 },
          { mes: "NOV/2024", consumo: 8456, valor: 6201.45 },
          { mes: "OUT/2024", consumo: 8789, valor: 6445.67 },
          { mes: "SET/2024", consumo: 8321, valor: 6098.34 },
          { mes: "AGO/2024", consumo: 8567, valor: 6278.90 },
          { mes: "JUL/2024", consumo: 8234, valor: 6034.23 },
          { mes: "JUN/2024", consumo: 7890, valor: 5782.11 },
          { mes: "MAI/2024", consumo: 8123, valor: 5953.44 }
        ],
        
        // Bandeira tarifária
        bandeiraTarifaria: "Verde",
        valorBandeira: 0,
        
        // Código de barras
        codigoBarras: "40390.00007 14375.534014 37634.909016 8 11180000628464"
      };
      
      setExtractedData(mockData);
      onDataExtracted(mockData);
      toast.success('Dados da fatura extraídos com sucesso!');
      
    } catch (error) {
      console.error('Erro ao extrair dados da fatura:', error);
      toast.error('Erro ao extrair dados da fatura');
    } finally {
      setExtracting(false);
    }
  };

  if (extracting) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <div>
              <p className="font-medium">Extraindo dados da fatura...</p>
              <p className="text-sm text-muted-foreground">Analisando PDF e extraindo informações</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!extractedData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">Dados Extraídos da Fatura</h3>
        <Badge variant="secondary">Extração Concluída</Badge>
      </div>

      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Dados do Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="font-medium">{extractedData.nomeCliente}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CPF/CNPJ</label>
              <p className="font-medium font-mono">{extractedData.cpfCnpj}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Endereço</label>
            <p className="font-medium">{extractedData.endereco}</p>
            <p className="text-sm text-muted-foreground">
              {extractedData.cep} - {extractedData.cidade}/{extractedData.uf}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dados da Fatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Informações da Fatura</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <label className="text-sm font-medium text-green-700">Número</label>
              <p className="font-bold text-green-800">{extractedData.numeroFatura}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="text-sm font-medium text-blue-700">Referência</label>
              <p className="font-bold text-blue-800">{extractedData.referencia}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <label className="text-sm font-medium text-orange-700">Emissão</label>
              <p className="font-bold text-orange-800">{extractedData.dataEmissao}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <label className="text-sm font-medium text-red-700">Vencimento</label>
              <p className="font-bold text-red-800">{extractedData.dataVencimento}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-green-100 p-4 rounded-lg">
            <label className="text-sm font-medium text-green-700">Valor Total</label>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(extractedData.valorTotal)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dados da Instalação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Dados da Instalação</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Número da Instalação</label>
              <p className="font-bold font-mono">{extractedData.numeroInstalacao}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Classe</label>
              <p className="font-medium">{extractedData.classe}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subgrupo</label>
              <p className="font-medium">{extractedData.subgrupo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Modalidade Tarifária</label>
              <p className="font-medium">{extractedData.modalidadeTarifaria}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consumo e Demanda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Consumo e Demanda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-blue-700">Consumo</label>
              <p className="text-xl font-bold text-blue-800">{extractedData.consumoKwh} kWh</p>
            </div>
            {extractedData.demandaKw && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-purple-700">Demanda</label>
                <p className="text-xl font-bold text-purple-800">{extractedData.demandaKw} kW</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento de Valores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Detalhamento de Valores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Energia Elétrica</span>
              <span className="font-bold">{formatCurrency(extractedData.energiaEletrica)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Contribuição Ilum. Pública</span>
              <span className="font-bold">{formatCurrency(extractedData.contribuicaoIlumPublica)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">ICMS</span>
              <span className="font-bold">{formatCurrency(extractedData.icms)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">PIS</span>
              <span className="font-bold">{formatCurrency(extractedData.pis)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">COFINS</span>
              <span className="font-bold">{formatCurrency(extractedData.cofins)}</span>
            </div>
            {extractedData.bandeiraTarifaria && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Bandeira {extractedData.bandeiraTarifaria}</span>
                <span className="font-bold">{formatCurrency(extractedData.valorBandeira || 0)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Consumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Histórico de Consumo (13 meses)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {extractedData.historicoConsumo.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{item.mes}</span>
                  <Badge variant="outline">{item.consumo} kWh</Badge>
                </div>
                <p className="font-bold text-green-600">{formatCurrency(item.valor)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Código de Barras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="w-5 h-5" />
            <span>Código de Barras</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-mono text-center text-lg font-bold">
              {extractedData.codigoBarras}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
