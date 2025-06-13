import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Zap, DollarSign, Calendar, User, FileText, TrendingDown, Barcode, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { generateCustomPDF } from '@/services/pdfService';
import { useToast } from '@/hooks/use-toast';

interface InvoiceData {
  numero: string;
  vencimento: string;
  valor: number;
  cliente: {
    nome: string;
    documento: string;
    endereco: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  consumo: {
    energiaConvencional: { quantidade: number; valorUnit: number; total: number };
    descontoTarifa: { quantidade: number; valorUnit: number; total: number };
    economiaMes: { quantidade: number; valorUnit: number; total: number };
  };
  detalhes: {
    numeroFatura: string;
    referencia: string;
    dataEmissao: string;
    dataVencimento: string;
  };
  historico: Array<{ mes: string; valor: number; semEnergyPay: number; comEnergyPay: number }>;
  economiaTotal: number;
  pixCode: string;
  codigoBarras: string;
}

const mockInvoiceData: InvoiceData = {
  numero: "2025088853",
  vencimento: "30/05/2025",
  valor: 758.40,
  cliente: {
    nome: "Laura Ritini Canesio Silva",
    documento: "33.386.705/0001-13",
    endereco: "Avenida Berlim",
    cidade: "Goiânia",
    uf: "GO",
    cep: "74000-000"
  },
  consumo: {
    energiaConvencional: { quantidade: 1, valorUnit: 948.01, total: 948.01 },
    descontoTarifa: { quantidade: 1, valorUnit: -94.00, total: -94.00 },
    economiaMes: { quantidade: 1, valorUnit: -189.61, total: -189.61 }
  },
  detalhes: {
    numeroFatura: "2025088853",
    referencia: "MAI/2025",
    dataEmissao: "15/05/2025",
    dataVencimento: "30/05/2025"
  },
  historico: [
    { mes: "JAN/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "FEV/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "MAR/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "ABR/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "MAI/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "JUN/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 }
  ],
  economiaTotal: 189.61,
  pixCode: "00020101021126580014br.gov.bcb.pix2536pix.lovable.dev/qr/v2/cobv/9d3d2f1a-4b8e-4c7d-8f2e-1a2b3c4d5e6f5204000053039865802BR5925Energy Pay Energia Solar6009SAO PAULO62070503***6304D2A4",
  codigoBarras: "03391234567890123456789012345678901234567890"
};

const InvoiceLayout: React.FC = () => {
  const data = mockInvoiceData;
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Check if we're on the /fatura-layout route
  const isLayoutRoute = location.pathname === '/fatura-layout';

  // Prepare data for the chart
  const chartData = data.historico.map(item => ({
    mes: item.mes,
    semEnergyPay: item.semEnergyPay,
    comEnergyPay: item.comEnergyPay,
    economia: item.semEnergyPay - item.comEnergyPay
  }));

  const handleGenerateAndSavePDF = async () => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Aguarde enquanto processamos a fatura.",
      });

      if (!invoiceRef.current) {
        throw new Error('Referência da fatura não encontrada');
      }

      // If we're on /fatura-layout route, just download the custom model
      if (isLayoutRoute) {
        // Generate only the custom PDF
        const customPdfBytes = await generateCustomPDF('invoice-layout');
        
        // Create blob and download
        const blob = new Blob([customPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `modelo-fatura-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "PDF baixado com sucesso!",
          description: "O modelo da fatura foi baixado.",
        });
        return;
      }

      // Original behavior for other routes
      // Gera PDF customizado
      const customPdfBytes = await generateCustomPDF('invoice-layout');
      
      // Converte para base64 para enviar para a API
      const customPdfBase64 = btoa(String.fromCharCode(...customPdfBytes));

      // Chama a API para baixar fatura e combinar PDFs
      const response = await fetch('/functions/v1/baixar-fatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uc: data.numero,
          documento: data.cliente.documento,
          customPdfBase64: customPdfBase64
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar fatura');
      }

      const result = await response.json();

      if (result.pdf_combinado_url) {
        // Abre o PDF combinado
        window.open(result.pdf_combinado_url, '_blank');
        
        toast({
          title: "PDF gerado com sucesso!",
          description: "O PDF foi salvo e está sendo exibido.",
        });
      } else {
        // Fallback: apenas abrir o PDF original
        window.open(result.fatura_url, '_blank');
        
        toast({
          title: "PDF da distribuidora",
          description: "Exibindo PDF original da distribuidora.",
        });
      }

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao processar a fatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Botão para gerar PDF */}
        <div className="mb-6 flex justify-end">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLayoutRoute ? 'Baixar Modelo PDF' : 'Baixar PDF Completo'}
          </Button>
        </div>

        {/* Invoice content with ref */}
        <div id="invoice-layout" ref={invoiceRef}>
          {/* Header */}
          <Card className="mb-6 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-1">energyPAY</h1>
                      <p className="text-green-100 text-lg">Energia Solar Inteligente</p>
                    </div>
                  </div>
                  <div className="text-right text-green-100">
                    <p className="text-sm opacity-90">CNPJ: 14.375.534/0001-27</p>
                    <p className="text-sm opacity-90">contato@energypay.com.br</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">FATURA DE ENERGIA SOLAR</h2>
                      <p className="text-green-100 text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        VENCIMENTO: {data.vencimento}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-100 mb-1">Valor Total</p>
                      <p className="text-5xl font-bold text-white">{formatCurrency(data.valor)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Coluna Principal */}
            <div className="xl:col-span-3 space-y-6">
              {/* Dados do Cliente */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">DADOS DO CLIENTE</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cliente</p>
                      <p className="text-xl font-semibold text-gray-900">{data.cliente.nome}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">CNPJ</p>
                      <p className="text-xl font-semibold text-gray-900">{data.cliente.documento}</p>
                    </div>
                    <div className="lg:col-span-2 space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Endereço</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {data.cliente.endereco}, {data.cliente.cidade} - {data.cliente.uf}, {data.cliente.cep}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demonstrativo de Consumo */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">DEMONSTRATIVO DE CONSUMO</h3>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Descrição</th>
                          <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Qtd</th>
                          <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">Valor Unit.</th>
                          <th className="text-right py-4 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-gray-900 font-medium">Energia elétrica convencional</td>
                          <td className="py-4 px-4 text-center text-gray-900 font-medium">{data.consumo.energiaConvencional.quantidade}</td>
                          <td className="py-4 px-4 text-right text-gray-900 font-medium">{formatCurrency(data.consumo.energiaConvencional.valorUnit)}</td>
                          <td className="py-4 px-6 text-right text-gray-900 font-bold text-lg">{formatCurrency(data.consumo.energiaConvencional.total)}</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-gray-900 font-medium">Desconto sobre da tarifa</td>
                          <td className="py-4 px-4 text-center text-gray-900 font-medium">{data.consumo.descontoTarifa.quantidade}</td>
                          <td className="py-4 px-4 text-right text-gray-900 font-medium">{formatCurrency(data.consumo.descontoTarifa.valorUnit)}</td>
                          <td className="py-4 px-6 text-right text-red-600 font-bold text-lg">{formatCurrency(data.consumo.descontoTarifa.total)}</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-gray-900 font-medium">Economia do mês</td>
                          <td className="py-4 px-4 text-center text-gray-900 font-medium">{data.consumo.economiaMes.quantidade}</td>
                          <td className="py-4 px-4 text-right text-gray-900 font-medium">{formatCurrency(data.consumo.economiaMes.valorUnit)}</td>
                          <td className="py-4 px-6 text-right text-red-600 font-bold text-lg">{formatCurrency(data.consumo.economiaMes.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-bold text-xl">TOTAL GERAL</span>
                        <span className="text-3xl font-bold text-green-600">{formatCurrency(data.valor)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-800 font-bold text-xl">ECONOMIA TOTAL</span>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detalhes da Fatura */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">DETALHES DA FATURA</h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Nº da Fatura</p>
                      <p className="text-lg font-semibold text-gray-900">{data.detalhes.numeroFatura}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Referência</p>
                      <p className="text-lg font-semibold text-gray-900">{data.detalhes.referencia}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Data de Emissão</p>
                      <p className="text-lg font-semibold text-gray-900">{data.detalhes.dataEmissao}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Vencimento</p>
                      <p className="text-lg font-semibold text-gray-900">{data.detalhes.dataVencimento}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Economia */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">HISTÓRICO DE ECONOMIA</h3>
                  </div>
                  
                  <div className="h-80 mb-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="mes" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                          formatter={(value, name) => [
                            `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                            name === 'semEnergyPay' ? 'Sem Energy Pay' : 'Com Energy Pay'
                          ]}
                          labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                        />
                        <Bar 
                          dataKey="semEnergyPay" 
                          fill="#ef4444" 
                          radius={[6, 6, 0, 0]}
                          name="semEnergyPay"
                        />
                        <Bar 
                          dataKey="comEnergyPay" 
                          fill="#10b981" 
                          radius={[6, 6, 0, 0]}
                          name="comEnergyPay"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
                      <p className="text-sm font-bold text-red-600 uppercase tracking-wide mb-2">Valor SEM Energy Pay</p>
                      <p className="text-3xl font-bold text-red-600">{formatCurrency(948.01)}</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
                      <p className="text-sm font-bold text-green-600 uppercase tracking-wide mb-2">Valor COM Energy Pay</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(data.valor)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral - Pagamentos */}
            <div className="space-y-6">
              {/* Pagamento via PIX */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">PAGAMENTO VIA PIX</h3>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-4 font-medium">Pague esta fatura usando PIX</p>
                    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-inner">
                      <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                      <span className="text-gray-700 font-medium">Abra o app do seu banco</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                      <span className="text-gray-700 font-medium">Escolha pagamento via PIX</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">3</div>
                      <span className="text-gray-700 font-medium">Escaneie o QR Code</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Chave PIX e Código</p>
                    <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                      {data.pixCode.substring(0, 50)}...
                    </p>
                  </div>

                  <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                    <p className="text-sm font-bold text-green-600 uppercase tracking-wide mb-2">Valor Total</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(data.valor)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pagamento via Boleto */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Barcode className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">PAGAMENTO VIA BOLETO</h3>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-4 font-medium">Código de barras do boleto</p>
                    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-4 shadow-inner">
                      <div className="flex items-center justify-center mb-3">
                        <Barcode className="w-32 h-16 text-gray-400" />
                      </div>
                      <p className="text-xs font-mono text-gray-600 break-all leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                        {data.codigoBarras}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                      <span className="text-gray-700 font-medium">Copie o código de barras</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                      <span className="text-gray-700 font-medium">Cole no app do seu banco</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">3</div>
                      <span className="text-gray-700 font-medium">Confirme o pagamento</span>
                    </div>
                  </div>

                  <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                    <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-2">Valor Total</p>
                    <p className="text-3xl font-bold text-orange-600">{formatCurrency(data.valor)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <Card className="mt-6 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center text-gray-600">
                <p className="mb-3 font-bold text-lg text-gray-800">
                  Energy Pay - Energia Solar Inteligente | CNPJ: 14.375.534/0001-27
                </p>
                <p className="text-sm leading-relaxed max-w-4xl mx-auto">
                  Você acabou de receber esta fatura por pertencer à nossa lista bancária. Para tirar dúvidas, 
                  entre em contato pelo telefone (62) 3749-7878 ou acesse energypay.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLayout;
