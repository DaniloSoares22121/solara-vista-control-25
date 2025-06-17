
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Download, Award, TrendingUp, Zap, Star, Sparkles, User, FileText, Building2, Phone, Globe, MapPin, Calendar, Hash, DollarSign, CreditCard, Banknote } from 'lucide-react';
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
  numero: "5/2025",
  vencimento: "20/06/2025",
  valor: 6284.64,
  cliente: {
    nome: "FERNANDO HUGO MACHADO DE REZENDE",
    documento: "000.745.351-53",
    endereco: "AV FLAMBOYANT",
    cidade: "Goiânia",
    uf: "GO",
    cep: "74855-340"
  },
  consumo: {
    energiaConvencional: { quantidade: 8558, valorUnit: 1.01262100, total: 8666.01 },
    descontoTarifa: { quantidade: 100, valorUnit: 0, total: 0 },
    economiaMes: { quantidade: 1, valorUnit: -2280.11, total: -2280.11 }
  },
  detalhes: {
    numeroFatura: "5/2025",
    referencia: "MAI/2025",
    dataEmissao: "12/06/2025",
    dataVencimento: "20/06/2025"
  },
  historico: [
    { mes: "MAI/2025", valor: 2280.11, semEnergyPay: 8666.01, comEnergyPay: 6284.64 },
    { mes: "ABR/2025", valor: 1932.18, semEnergyPay: 8666.01, comEnergyPay: 6284.64 },
    { mes: "MAR/2025", valor: 1831.39, semEnergyPay: 8666.01, comEnergyPay: 6284.64 },
    { mes: "FEV/2025", valor: 1430.33, semEnergyPay: 8666.01, comEnergyPay: 6284.64 },
    { mes: "JAN/2025", valor: 0, semEnergyPay: 8666.01, comEnergyPay: 6284.64 },
    { mes: "DEZ/2024", valor: 0, semEnergyPay: 8666.01, comEnergyPay: 6284.64 }
  ],
  economiaTotal: 2280.11,
  pixCode: "00020101021126580014br.gov.bcb.pix2536pix.lovable.dev/qr/v2/cobv/9d3d2f1a-4b8e-4c7d-8f2e-1a2b3c4d5e6f5204000053039865802BR5925Energy Pay Energia Solar6009SAO PAULO62070503***6304D2A4",
  codigoBarras: "40390.00007 14375.534014 37634.909016 8 11180000628464"
};

const InvoiceLayout: React.FC = () => {
  const data = mockInvoiceData;
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();

  const isLayoutRoute = location.pathname === '/fatura-layout';

  const handleGenerateAndSavePDF = async () => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Processando fatura.",
      });

      if (!invoiceRef.current) {
        throw new Error('Referência da fatura não encontrada');
      }

      if (isLayoutRoute) {
        const customPdfBytes = await generateCustomPDF('invoice-layout');
        
        const blob = new Blob([customPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fatura-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "PDF baixado!",
          description: "Fatura foi baixada com sucesso.",
        });
        return;
      }

      const customPdfBytes = await generateCustomPDF('invoice-layout');
      const customPdfBase64 = btoa(String.fromCharCode(...customPdfBytes));

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
        window.open(result.pdf_combinado_url, '_blank');
        
        toast({
          title: "PDF gerado com sucesso!",
          description: "O PDF foi salvo e está sendo exibido.",
        });
      } else {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Action button */}
        <div className="mb-6 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            {isLayoutRoute ? 'Baixar PDF' : 'Gerar PDF Completo'}
          </Button>
        </div>

        {/* Invoice container */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontSize: '11pt', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold mb-2">energy</h1>
                <h2 className="text-3xl font-light">PAY</h2>
              </div>
              <div className="text-right text-sm">
                <div className="mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  (62) 3140-7070
                </div>
                <div className="mb-4">
                  <Globe className="w-4 h-4 inline mr-2" />
                  energypay.me
                </div>
                <div className="space-y-1">
                  <p>Av. Antônio Fidelis, 205</p>
                  <p>Parque Amazônia - 74840-090</p>
                  <p>Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Client and invoice info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Client data */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">DADOS DO CLIENTE</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cliente</p>
                    <p className="font-bold text-gray-800">{data.cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CPF</p>
                    <p className="font-bold text-gray-800 font-mono">{data.cliente.documento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Endereço</p>
                    <p className="text-gray-800">{data.cliente.endereco}</p>
                    <p className="text-gray-700">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                    <p className="text-gray-700">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de emissão:</span>
                    <span className="font-bold">{data.detalhes.dataEmissao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nº da Instalação:</span>
                    <span className="font-bold font-mono">1000052091б</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classe:</span>
                    <span className="font-bold">Residencial Trifásico</span>
                  </div>
                </div>
              </div>

              {/* Invoice details */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">DETALHES DA FATURA</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">Nº DA FATURA</p>
                    <p className="text-2xl font-bold text-gray-800">{data.numero}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">VENCIMENTO</p>
                    <p className="text-2xl font-bold text-red-600">{data.vencimento}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">REFERÊNCIA</p>
                    <p className="text-2xl font-bold text-blue-600">{data.detalhes.referencia}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">VALOR A PAGAR</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(data.valor)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Economy showcase */}
            <div className="bg-green-100 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Economia com a Energy Pay</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                      <span className="font-bold text-gray-700">ECONOMIA NO MÊS</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-6 h-6 text-blue-600 mr-3" />
                      <span className="font-bold text-gray-700">ECONOMIA ACUMULADA</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">R$ 7.474,01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* History chart */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
                <h3 className="text-center font-bold text-xl">HISTÓRICO DE ECONOMIA</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data.historico.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="font-bold text-gray-600 w-24 text-right mr-4 font-mono">{item.mes}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-4" 
                          style={{ width: `${Math.max(35, (item.valor / 2500) * 100)}%` }}
                        >
                          <span className="text-sm font-bold text-white">{formatCurrency(item.valor)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between text-sm text-gray-500 px-24">
                  <span>0</span>
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                  <span>R$</span>
                </div>
              </div>
            </div>

            {/* Invoice table */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
                <h3 className="text-center font-bold text-xl">FATURA ENERGY PAY</h3>
              </div>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-4 px-6 font-bold text-gray-700">DESCRIÇÃO</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-700">QUANTIDADE</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-700">VALOR A PAGAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">Energia elétrica compensada</td>
                      <td className="text-center py-4 px-6 font-bold">8.458 kWh</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600 text-lg">{formatCurrency(data.valor)}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">Desconto ajuste de tarifas</td>
                      <td className="text-center py-4 px-6">-</td>
                      <td className="text-center py-4 px-6">-R$ 0,00</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-4 px-6 font-bold text-green-700">Total:</td>
                      <td className="text-center py-4 px-6"></td>
                      <td className="text-center py-4 px-6 font-bold text-green-700 text-xl">{formatCurrency(data.valor)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Economics demonstration */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
                <h3 className="text-center font-bold text-xl">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Without Energy Pay */}
                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">❌</span>
                    VALOR TOTAL DA ENERGIA SEM A ENERGY PAY
                  </h4>
                  <div className="overflow-hidden rounded border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-red-100">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">DESCRIÇÃO</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">QUANTIDADE</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">TARIFA</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Energia elétrica</td>
                          <td className="text-center py-3 px-4">8.558 kWh</td>
                          <td className="text-center py-3 px-4 font-mono">R$ 1,01262100</td>
                          <td className="text-center py-3 px-4 font-bold">R$ 8.666,01</td>
                        </tr>
                        <tr className="bg-red-100">
                          <td className="py-3 px-4 font-bold text-red-700">Total:</td>
                          <td className="text-center py-3 px-4"></td>
                          <td className="text-center py-3 px-4"></td>
                          <td className="text-center py-3 px-4 font-bold text-red-700">R$ 8.666,01</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* With Energy Pay */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✅</span>
                    VALOR TOTAL DA ENERGIA COM A ENERGY PAY
                  </h4>
                  <div className="overflow-hidden rounded border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">DESCRIÇÃO</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Energia elétrica não compensada</td>
                          <td className="text-center py-3 px-4">R$ 101,26</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Ajuste de tarifas</td>
                          <td className="text-center py-3 px-4">R$ 0,00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Fatura ENERGY PAY</td>
                          <td className="text-center py-3 px-4 font-bold">{formatCurrency(data.valor)}</td>
                        </tr>
                        <tr className="bg-green-100">
                          <td className="py-3 px-4 font-bold text-green-700">Total:</td>
                          <td className="text-center py-3 px-4 font-bold text-green-700">R$ 6.385,90</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Savings summary */}
                <div className="bg-green-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-green-700 mb-6 text-center flex items-center justify-center">
                    <Award className="w-6 h-6 mr-2" />
                    RESUMO DA ECONOMIA
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 bg-white rounded px-4">
                      <span className="text-gray-700 font-bold">Valor SEM Energy Pay:</span>
                      <span className="font-bold text-red-600">R$ 8.666,01</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-white rounded px-4">
                      <span className="text-gray-700 font-bold">Valor COM Energy Pay:</span>
                      <span className="font-bold text-green-600">R$ 6.385,90</span>
                    </div>
                    <Separator />
                    <div className="bg-white rounded-lg p-4 border-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-700">Economia Total:</span>
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment information */}
            <div className="bg-white border rounded-lg p-6 text-center">
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <p className="text-xl font-bold text-blue-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6 mr-3" />
                  RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                </p>
                <p className="text-lg text-blue-600 mt-2 font-bold">CNPJ: 14.375.534/0001-07</p>
              </div>
              
              {/* Barcode section */}
              <div className="bg-gray-50 p-8 rounded-lg mb-8">
                <div className="font-mono text-lg font-bold mb-6 text-center text-gray-700 bg-white p-4 rounded border">
                  {data.codigoBarras}
                </div>
                <div className="flex justify-center mb-6">
                  <div className="h-16 bg-black w-full max-w-lg rounded" style={{
                    backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                  }}></div>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                </p>
              </div>

              {/* QR Code PIX */}
              <div className="flex justify-center">
                <div className="bg-green-50 p-8 rounded-lg border-4 border-green-200">
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4 border">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold mb-2 text-gray-800 flex items-center justify-center">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">📱</span>
                    Pague via PIX
                  </p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(data.valor)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLayout;
