import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, User, Zap, DollarSign, Calendar, Hash, MapPin, Phone, Building2, AlertCircle, ArrowRight, Save, Calculator, Wifi, WifiOff } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { useConsumoNaoCompensado } from '@/hooks/useConsumoNaoCompensado';
import { useInvoiceCalculation } from '@/hooks/useInvoiceCalculation';
import { useInvoiceExtractionFallback } from '@/hooks/useInvoiceExtractionFallback';
import ConsumoNaoCompensadoModal from './ConsumoNaoCompensadoModal';
import APIConfirmationModal from './APIConfirmationModal';

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
  onDataConfirmed?: (data: ExtractedInvoiceData) => void;
  subscriberId?: string;
  subscriberDiscount?: number;
}

export function InvoiceDataExtractor({ 
  file, 
  onDataExtracted, 
  onDataConfirmed, 
  subscriberId,
  subscriberDiscount = 15 
}: InvoiceDataExtractorProps) {
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [rawApiData, setRawApiData] = useState<any>(null);
  const [editableData, setEditableData] = useState<ExtractedInvoiceData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [apiUsed, setApiUsed] = useState<'primary' | 'fallback' | null>(null);

  // Hooks para extração com fallback
  const { isExtracting, extractionError, extractWithFallback } = useInvoiceExtractionFallback();

  // Hooks para consumo não compensado
  const {
    isModalOpen,
    pendingMonthReference,
    hasValidConsumoNaoCompensado,
    getConsumoNaoCompensadoValue,
    saveConsumoValue,
    closeModal,
    updateConsumoNaoCompensadoInLines
  } = useConsumoNaoCompensado();

  // Hooks para cálculo da fatura
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
    if (file) {
      extractInvoiceData(file);
    }
  }, [file]);

  const extractInvoiceData = async (pdfFile: File) => {
    try {
      console.log('🚀 Iniciando extração de dados da fatura:', pdfFile.name);
      
      const result = await extractWithFallback(pdfFile);
      setRawApiData(result.data);
      setApiUsed(result.apiUsed);
      
      // Verificar consumo não compensado
      await processConsumoNaoCompensado(result.data);
      
    } catch (error) {
      console.error('❌ Erro ao extrair dados da fatura:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao extrair dados da fatura: ${errorMessage}`);
    }
  };

  const processConsumoNaoCompensado = async (apiData: any) => {
    try {
      console.log('🔍 Verificando consumo não compensado...');
      
      // Verificar se tem consumo não compensado válido
      if (!hasValidConsumoNaoCompensado(apiData.lines)) {
        console.log('❌ Consumo não compensado não encontrado ou inválido, solicitando valor...');
        
        // Solicitar valor ao usuário
        const consumoValue = await getConsumoNaoCompensadoValue(
          apiData.lines, 
          apiData.month_reference
        );
        
        console.log(`✅ Valor obtido: ${consumoValue} kWh`);
        
        // Atualizar as linhas com o valor correto
        apiData.lines = updateConsumoNaoCompensadoInLines(apiData.lines, consumoValue);
      }
      
      // Mapear os dados da API para nossa interface
      const mappedData: ExtractedInvoiceData = mapApiDataToInterface(apiData);
      
      setExtractedData(mappedData);
      setEditableData(mappedData);
      setIsEditing(true);
      onDataExtracted(mappedData);
      
      const apiMessage = apiUsed === 'fallback' ? ' (usando API GD2)' : '';
      toast.success(`Dados da fatura extraídos com sucesso${apiMessage}!`);
      
    } catch (error) {
      console.error('Erro ao processar consumo não compensado:', error);
    }
  };

  const mapApiDataToInterface = (apiData: any): ExtractedInvoiceData => {
    // Extrair endereço - usar address_partner se disponível, senão usar address
    const endereco = apiData.address_partner?.street || apiData.address || "Não informado";
    const cidade = apiData.address_partner?.city || "Não informado";
    const cep = apiData.address_partner?.zip_code || apiData.zip_code || "Não informado";
    
    const contribIlumPublica = apiData.lines?.find((line: any) => 
      line.description.includes('CONTRIB') && line.description.includes('ILUM')
    )?.total_value || 0;
    
    const energiaEletricaValue = apiData.lines?.filter((line: any) => 
      line.description.includes('CONSUMO') || line.description.includes('ENERGIA')
    )?.reduce((total: number, line: any) => total + (line.total_value || 0), 0) || 0;
    
    const historicoConsumo = apiData.historical_lines?.map((item: any) => ({
      mes: item.reference || "Não informado",
      consumo: (item.consume_ponta || 0) + (item.consume_fora_ponta || 0),
      valor: 0
    })) || [];
    
    const bandeira = apiData.lines?.find((line: any) => 
      line.description.includes('BANDEIRA')
    );
    
    return {
      nomeCliente: apiData.legal_name || "Não informado",
      cpfCnpj: apiData.cnpj_cpf || "Não informado",
      endereco: endereco,
      cidade: cidade,
      uf: apiData.address?.includes(' GO ') ? 'GO' : "Não informado",
      cep: cep,
      numeroFatura: apiData.consumer_unit || "Não informado",
      referencia: apiData.month_reference || "Não informado",
      dataEmissao: apiData.emission_date || "Não informado",
      dataVencimento: apiData.expiration_date || "Não informado",
      valorTotal: parseFloat(apiData.invoice_value || 0),
      numeroInstalacao: apiData.consumer_unit || "Não informado",
      classe: apiData.classe || "Não informado",
      subgrupo: apiData.connection || "Não informado",
      modalidadeTarifaria: apiData.invoice_type || "Não informado",
      consumoKwh: parseInt(apiData.invoice_consume || apiData.measured_energy || 0),
      demandaKw: apiData.demanda_contratada ? parseFloat(apiData.demanda_contratada) : undefined,
      energiaEletrica: energiaEletricaValue,
      contribuicaoIlumPublica: parseFloat(contribIlumPublica),
      icms: parseFloat(apiData.icms || 0),
      pis: parseFloat(apiData.pis || 0),
      cofins: parseFloat(apiData.cofins || 0),
      historicoConsumo: historicoConsumo,
      bandeiraTarifaria: bandeira?.description || undefined,
      valorBandeira: bandeira?.total_value ? parseFloat(bandeira.total_value) : undefined,
      codigoBarras: "Não disponível na API"
    };
  };

  const handleInputChange = (field: keyof ExtractedInvoiceData, value: string | number) => {
    if (!editableData) return;
    
    setEditableData({
      ...editableData,
      [field]: value
    });
  };

  const handleCalculateInvoice = async () => {
    if (!rawApiData) {
      toast.error('Dados da fatura não disponíveis para cálculo');
      return;
    }

    try {
      // Preparar dados para o cálculo
      const calculationData = prepareCalculationData(
        rawApiData,
        subscriberDiscount,
        subscriberId
      );

      // Mostrar modal de confirmação
      showConfirmationModal(calculationData);
      
    } catch (error) {
      console.error('Erro ao preparar cálculo:', error);
      toast.error('Erro ao preparar dados para cálculo');
    }
  };

  const handleConfirmData = () => {
    if (!editableData) return;
    
    onDataConfirmed?.(editableData);
    toast.success('Dados confirmados! Prosseguindo para o próximo passo.');
  };

  if (isExtracting) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <div>
              <p className="font-medium">Extraindo dados da fatura...</p>
              <p className="text-sm text-muted-foreground">
                Tentando API primária, com fallback para GD2 se necessário
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (extractionError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Erro na Extração</p>
              <p className="text-sm text-red-600">{extractionError}</p>
              <p className="text-xs text-red-500 mt-1">
                Tentativa com ambas as APIs (primária e GD2) falharam
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!editableData || !isEditing) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Confirmar Dados da Fatura</h3>
            <Badge variant="secondary">Dados Extraídos - Editáveis</Badge>
            {subscriberDiscount && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Desconto: {subscriberDiscount}%
              </Badge>
            )}
            {apiUsed && (
              <Badge variant="outline" className={apiUsed === 'fallback' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                {apiUsed === 'fallback' ? (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    API GD2
                  </>
                ) : (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    API Primária
                  </>
                )}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCalculateInvoice} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isCalculating}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calcular Fatura
            </Button>
            <Button onClick={handleConfirmData} className="bg-green-600 hover:bg-green-700">
              <ArrowRight className="w-4 h-4 mr-2" />
              Confirmar e Prosseguir
            </Button>
          </div>
        </div>

        {/* API Used Info */}
        {apiUsed && (
          <Card className={apiUsed === 'fallback' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {apiUsed === 'fallback' ? (
                  <WifiOff className="w-5 h-5 text-blue-600" />
                ) : (
                  <Wifi className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <p className={`font-medium ${apiUsed === 'fallback' ? 'text-blue-800' : 'text-gray-800'}`}>
                    {apiUsed === 'fallback' ? 'API Alternativa Utilizada (GD2)' : 'API Primária Utilizada'}
                  </p>
                  <p className={`text-sm ${apiUsed === 'fallback' ? 'text-blue-700' : 'text-gray-700'}`}>
                    {apiUsed === 'fallback' 
                      ? 'A API primária falhou, dados extraídos usando API para faturas GD2'
                      : 'Dados extraídos com sucesso usando a API primária'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                <Input
                  id="nomeCliente"
                  value={editableData.nomeCliente}
                  onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  value={editableData.cpfCnpj}
                  onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={editableData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={editableData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={editableData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={editableData.uf}
                  onChange={(e) => handleInputChange('uf', e.target.value)}
                  className="mt-1"
                />
              </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="numeroFatura">UC</Label>
                <Input
                  id="numeroFatura"
                  value={editableData.numeroFatura}
                  onChange={(e) => handleInputChange('numeroFatura', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="referencia">Referência</Label>
                <Input
                  id="referencia"
                  value={editableData.referencia}
                  onChange={(e) => handleInputChange('referencia', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dataEmissao">Data Emissão</Label>
                <Input
                  id="dataEmissao"
                  value={editableData.dataEmissao}
                  onChange={(e) => handleInputChange('dataEmissao', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dataVencimento">Data Vencimento</Label>
                <Input
                  id="dataVencimento"
                  value={editableData.dataVencimento}
                  onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="valorTotal">Valor Total (R$)</Label>
              <Input
                id="valorTotal"
                type="number"
                step="0.01"
                value={editableData.valorTotal}
                onChange={(e) => handleInputChange('valorTotal', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroInstalacao">Número da Instalação</Label>
                <Input
                  id="numeroInstalacao"
                  value={editableData.numeroInstalacao}
                  onChange={(e) => handleInputChange('numeroInstalacao', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="classe">Classe</Label>
                <Input
                  id="classe"
                  value={editableData.classe}
                  onChange={(e) => handleInputChange('classe', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subgrupo">Conexão</Label>
                <Input
                  id="subgrupo"
                  value={editableData.subgrupo}
                  onChange={(e) => handleInputChange('subgrupo', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="modalidadeTarifaria">Tipo da Fatura</Label>
                <Input
                  id="modalidadeTarifaria"
                  value={editableData.modalidadeTarifaria}
                  onChange={(e) => handleInputChange('modalidadeTarifaria', e.target.value)}
                  className="mt-1"
                />
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consumoKwh">Consumo (kWh)</Label>
                <Input
                  id="consumoKwh"
                  type="number"
                  value={editableData.consumoKwh}
                  onChange={(e) => handleInputChange('consumoKwh', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="demandaKw">Demanda (kW)</Label>
                <Input
                  id="demandaKw"
                  type="number"
                  step="0.01"
                  value={editableData.demandaKw || ''}
                  onChange={(e) => handleInputChange('demandaKw', parseFloat(e.target.value) || undefined)}
                  className="mt-1"
                />
              </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="energiaEletrica">Energia Elétrica (R$)</Label>
                <Input
                  id="energiaEletrica"
                  type="number"
                  step="0.01"
                  value={editableData.energiaEletrica}
                  onChange={(e) => handleInputChange('energiaEletrica', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contribuicaoIlumPublica">Contrib. Ilum. Pública (R$)</Label>
                <Input
                  id="contribuicaoIlumPublica"
                  type="number"
                  step="0.01"
                  value={editableData.contribuicaoIlumPublica}
                  onChange={(e) => handleInputChange('contribuicaoIlumPublica', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="icms">ICMS (R$)</Label>
                <Input
                  id="icms"
                  type="number"
                  step="0.01"
                  value={editableData.icms}
                  onChange={(e) => handleInputChange('icms', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pis">PIS (R$)</Label>
                <Input
                  id="pis"
                  type="number"
                  step="0.01"
                  value={editableData.pis}
                  onChange={(e) => handleInputChange('pis', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cofins">COFINS (R$)</Label>
                <Input
                  id="cofins"
                  type="number"
                  step="0.01"
                  value={editableData.cofins}
                  onChange={(e) => handleInputChange('cofins', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Confirmação */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Confirmar Dados</h4>
                <p className="text-sm text-green-700">Revise os dados extraídos e clique em "Confirmar e Prosseguir" quando estiver tudo correto.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCalculateInvoice} 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isCalculating}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Fatura
                </Button>
                <Button onClick={handleConfirmData} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Confirmar e Prosseguir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para Consumo Não Compensado */}
      <ConsumoNaoCompensadoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={saveConsumoValue}
        monthReference={pendingMonthReference}
      />

      {/* Modal de Confirmação da API */}
      <APIConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={sendToCalculationAPI}
        jsonData={pendingCalculation?.payload}
        discount={pendingCalculation?.discount || 0}
        consumerUnit={pendingCalculation?.consumerUnit || ''}
      />
    </>
  );
}
