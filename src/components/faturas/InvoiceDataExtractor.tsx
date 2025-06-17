import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, User, Zap, DollarSign, Calendar, Hash, MapPin, Phone, Building2, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      extractInvoiceData(file);
    }
  }, [file]);

  const extractInvoiceData = async (pdfFile: File) => {
    setExtracting(true);
    setError(null);
    
    try {
      console.log('Iniciando extração de dados da fatura:', pdfFile.name);
      
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await fetch("https://extrator.wattio.com.br/extrator/equatorial/montlhy/", {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Origin": "https://zip.wattio.com.br",
          "Referer": "https://zip.wattio.com.br/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const apiData = await response.json();
      console.log('Dados recebidos da API:', apiData);

      // Mapear os dados da API para nossa interface
      const mappedData: ExtractedInvoiceData = mapApiDataToInterface(apiData);
      
      setExtractedData(mappedData);
      onDataExtracted(mappedData);
      toast.success('Dados da fatura extraídos com sucesso!');
      
    } catch (error) {
      console.error('Erro ao extrair dados da fatura:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(`Erro ao extrair dados da fatura: ${errorMessage}`);
    } finally {
      setExtracting(false);
    }
  };

  const mapApiDataToInterface = (apiData: any): ExtractedInvoiceData => {
    // Extrair endereço - usar address_partner se disponível, senão usar address
    const endereco = apiData.address_partner?.street || apiData.address || "Não informado";
    const cidade = apiData.address_partner?.city || "Não informado";
    const cep = apiData.address_partner?.zip_code || apiData.zip_code || "Não informado";
    
    // Encontrar contribuição iluminação pública nas linhas
    const contribIlumPublica = apiData.lines?.find((line: any) => 
      line.description.includes('CONTRIB') && line.description.includes('ILUM')
    )?.total_value || 0;
    
    // Calcular valor total da energia elétrica (somar linhas relevantes)
    const energiaEletricaValue = apiData.lines?.filter((line: any) => 
      line.description.includes('CONSUMO') || line.description.includes('ENERGIA')
    )?.reduce((total: number, line: any) => total + (line.total_value || 0), 0) || 0;
    
    // Mapear histórico de consumo
    const historicoConsumo = apiData.historical_lines?.map((item: any) => ({
      mes: item.reference || "Não informado",
      consumo: (item.consume_ponta || 0) + (item.consume_fora_ponta || 0),
      valor: 0 // A API não retorna valor histórico, apenas consumo
    })) || [];
    
    // Encontrar bandeira tarifária nas linhas
    const bandeira = apiData.lines?.find((line: any) => 
      line.description.includes('BANDEIRA')
    );
    
    return {
      // Dados do cliente
      nomeCliente: apiData.legal_name || "Não informado",
      cpfCnpj: apiData.cnpj_cpf || "Não informado",
      endereco: endereco,
      cidade: cidade,
      uf: apiData.address?.includes(' GO ') ? 'GO' : "Não informado",
      cep: cep,
      
      // Dados da fatura
      numeroFatura: apiData.consumer_unit || "Não informado",
      referencia: apiData.month_reference || "Não informado",
      dataEmissao: apiData.emission_date || "Não informado",
      dataVencimento: apiData.expiration_date || "Não informado",
      valorTotal: parseFloat(apiData.invoice_value || 0),
      
      // Dados da instalação
      numeroInstalacao: apiData.consumer_unit || "Não informado",
      classe: apiData.classe || "Não informado",
      subgrupo: apiData.connection || "Não informado",
      modalidadeTarifaria: apiData.invoice_type || "Não informado",
      
      // Consumo
      consumoKwh: parseInt(apiData.invoice_consume || apiData.measured_energy || 0),
      demandaKw: apiData.demanda_contratada ? parseFloat(apiData.demanda_contratada) : undefined,
      
      // Valores detalhados
      energiaEletrica: energiaEletricaValue,
      contribuicaoIlumPublica: parseFloat(contribIlumPublica),
      icms: parseFloat(apiData.icms || 0),
      pis: parseFloat(apiData.pis || 0),
      cofins: parseFloat(apiData.cofins || 0),
      
      // Histórico de consumo
      historicoConsumo: historicoConsumo,
      
      // Bandeira tarifária
      bandeiraTarifaria: bandeira?.description || undefined,
      valorBandeira: bandeira?.total_value ? parseFloat(bandeira.total_value) : undefined,
      
      // Código de barras (não disponível na API)
      codigoBarras: "Não disponível na API"
    };
  };

  if (extracting) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <div>
              <p className="font-medium">Extraindo dados da fatura...</p>
              <p className="text-sm text-muted-foreground">Enviando para API e processando PDF</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Erro na Extração</p>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-red-500 mt-1">Verifique se a fatura está legível e tente novamente</p>
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
              <label className="text-sm font-medium text-green-700">UC</label>
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
              <label className="text-sm font-medium text-muted-foreground">Conexão</label>
              <p className="font-medium">{extractedData.subgrupo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo da Fatura</label>
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
                <span className="font-medium">{extractedData.bandeiraTarifaria}</span>
                <span className="font-bold">{formatCurrency(extractedData.valorBandeira || 0)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Consumo */}
      {extractedData.historicoConsumo && extractedData.historicoConsumo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Histórico de Consumo</span>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug - Dados Brutos da API */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <FileText className="w-5 h-5" />
            <span>Debug - Resposta da API</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <details>
            <summary className="cursor-pointer font-medium text-blue-700 hover:text-blue-900">
              Ver dados brutos da API
            </summary>
            <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-64">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
