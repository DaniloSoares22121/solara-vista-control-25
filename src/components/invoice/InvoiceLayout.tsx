
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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Action button */}
        <div className="mb-4 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-base font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLayoutRoute ? 'Baixar PDF' : 'Gerar PDF Completo'}
          </Button>
        </div>

        {/* Invoice container */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontSize: '10pt', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-1">energy</h1>
                <h2 className="text-2xl font-light">PAY</h2>
              </div>
              <div className="text-right text-xs">
                <div className="mb-1">
                  <Phone className="w-3 h-3 inline mr-1" />
                  (62) 3140-7070
                </div>
                <div className="mb-3">
                  <Globe className="w-3 h-3 inline mr-1" />
                  energypay.me
                </div>
                <div className="space-y-1 text-xs">
                  <p>Av. Antônio Fidelis, 205</p>
                  <p>Parque Amazônia - 74840-090</p>
                  <p>Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Client and invoice info in one row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Client data */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-base font-bold text-gray-800">DADOS DO CLIENTE</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Cliente</p>
                    <p className="font-bold text-gray-800 text-sm">{data.cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">CPF</p>
                    <p className="font-bold text-gray-800 font-mono text-sm">{data.cliente.documento}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Endereço</p>
                    <p className="text-gray-800 text-xs">{data.cliente.endereco}</p>
                    <p className="text-gray-700 text-xs">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                    <p className="text-gray-700 text-xs">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Data de emissão:</span>
                    <span className="font-bold">{data.detalhes.dataEmissao}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Nº da Instalação:</span>
                    <span className="font-bold font-mono">1000052091б</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Classe:</span>
                    <span className="font-bold">Residencial Trifásico</span>
                  </div>
                </div>
              </div>

              {/* Invoice details */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-base font-bold text-gray-800">DETALHES DA FATURA</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">Nº DA FATURA</p>
                    <p className="text-lg font-bold text-gray-800">{data.numero}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-red-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">VENCIMENTO</p>
                    <p className="text-lg font-bold text-red-600">{data.vencimento}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">REFERÊNCIA</p>
                    <p className="text-lg font-bold text-green-600">{data.detalhes.referencia}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-1">VALOR A PAGAR</p>
                    <p className="text-lg font-bold text-green-700">{formatCurrency(data.valor)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Economy showcase */}
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-800">Economia com a Energy Pay</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-bold text-gray-700 text-sm">ECONOMIA NO MÊS</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-bold text-gray-700 text-sm">ECONOMIA ACUMULADA</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">R$ 7.474,01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two columns: History and Invoice table side by side */}
            <div className="grid grid-cols-2 gap-6">
              {/* History chart */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-green-800 text-white p-3">
                  <h3 className="text-center font-bold text-base">HISTÓRICO DE ECONOMIA</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {data.historico.slice(0, 6).map((item, index) => (
                      <div key={index} className="flex items-center">
                        <span className="font-bold text-gray-600 w-16 text-right mr-3 font-mono text-xs">{item.mes}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2" 
                            style={{ width: `${Math.max(30, (item.valor / 2500) * 100)}%` }}
                          >
                            <span className="text-xs font-bold text-white">{formatCurrency(item.valor)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500 px-16">
                    <span>0</span>
                    <span>1000</span>
                    <span>2000</span>
                    <span>R$</span>
                  </div>
                </div>
              </div>

              {/* Invoice table */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-green-800 text-white p-3">
                  <h3 className="text-center font-bold text-base">FATURA ENERGY PAY</h3>
                </div>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-3 px-3 font-bold text-gray-700 text-xs">DESCRIÇÃO</th>
                        <th className="text-center py-3 px-3 font-bold text-gray-700 text-xs">QTD</th>
                        <th className="text-center py-3 px-3 font-bold text-gray-700 text-xs">VALOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3 text-xs">Energia elétrica compensada</td>
                        <td className="text-center py-3 px-3 font-bold text-xs">8.458 kWh</td>
                        <td className="text-center py-3 px-3 font-bold text-green-600 text-sm">{formatCurrency(data.valor)}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3 text-xs">Desconto ajuste de tarifas</td>
                        <td className="text-center py-3 px-3 text-xs">-</td>
                        <td className="text-center py-3 px-3 text-xs">-R$ 0,00</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-3 px-3 font-bold text-green-700 text-xs">Total:</td>
                        <td className="text-center py-3 px-3"></td>
                        <td className="text-center py-3 px-3 font-bold text-green-700 text-base">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Economics demonstration in two columns */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-green-800 text-white p-3">
                <h3 className="text-center font-bold text-base">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Without Energy Pay */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">❌</span>
                      SEM A ENERGY PAY
                    </h4>
                    <div className="overflow-hidden rounded border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-red-100">
                            <th className="text-left py-2 px-2 font-bold text-gray-700 text-xs">DESCRIÇÃO</th>
                            <th className="text-center py-2 px-2 font-bold text-gray-700 text-xs">VALOR</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-2 text-xs">Energia elétrica</td>
                            <td className="text-center py-2 px-2 font-bold text-xs">R$ 8.666,01</td>
                          </tr>
                          <tr className="bg-red-100">
                            <td className="py-2 px-2 font-bold text-red-700 text-xs">Total:</td>
                            <td className="text-center py-2 px-2 font-bold text-red-700 text-xs">R$ 8.666,01</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* With Energy Pay */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">✅</span>
                      COM A ENERGY PAY
                    </h4>
                    <div className="overflow-hidden rounded border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-green-100">
                            <th className="text-left py-2 px-2 font-bold text-gray-700 text-xs">DESCRIÇÃO</th>
                            <th className="text-center py-2 px-2 font-bold text-gray-700 text-xs">VALOR</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-2 text-xs">Energia não compensada</td>
                            <td className="text-center py-2 px-2 text-xs">R$ 101,26</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-2 text-xs">Fatura ENERGY PAY</td>
                            <td className="text-center py-2 px-2 font-bold text-xs">{formatCurrency(data.valor)}</td>
                          </tr>
                          <tr className="bg-green-100">
                            <td className="py-2 px-2 font-bold text-green-700 text-xs">Total:</td>
                            <td className="text-center py-2 px-2 font-bold text-green-700 text-xs">R$ 6.385,90</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Savings summary */}
                <div className="bg-green-100 rounded-lg p-4 mt-4">
                  <h4 className="text-base font-bold text-green-700 mb-4 text-center flex items-center justify-center">
                    <Award className="w-5 h-5 mr-2" />
                    RESUMO DA ECONOMIA
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 bg-white rounded px-3">
                      <span className="text-gray-700 font-bold text-sm">Valor SEM Energy Pay:</span>
                      <span className="font-bold text-red-600 text-sm">R$ 8.666,01</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-white rounded px-3">
                      <span className="text-gray-700 font-bold text-sm">Valor COM Energy Pay:</span>
                      <span className="font-bold text-green-600 text-sm">R$ 6.385,90</span>
                    </div>
                    <Separator />
                    <div className="bg-white rounded-lg p-3 border-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-green-700">Economia Total:</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment information in two columns */}
            <div className="grid grid-cols-2 gap-6">
              {/* Company info and barcode */}
              <div className="bg-white border rounded-lg p-4">
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-base font-bold text-green-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                  </p>
                  <p className="text-sm text-green-600 mt-1 font-bold text-center">CNPJ: 14.375.534/0001-07</p>
                </div>
                
                {/* Barcode section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm font-bold mb-4 text-center text-gray-700 bg-white p-3 rounded border">
                    {data.codigoBarras}
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="h-12 bg-black w-full max-w-sm rounded" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                    }}></div>
                  </div>
                  <p className="text-gray-600 text-xs text-center">
                    Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                  </p>
                </div>
              </div>

              {/* QR Code PIX */}
              <div className="bg-white border rounded-lg p-4 flex items-center justify-center">
                <div className="bg-green-50 p-6 rounded-lg border-4 border-green-200 text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3 border">
                    <QrCode className="w-20 h-20 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold mb-2 text-gray-800 flex items-center justify-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">📱</span>
                    Pague via PIX
                  </p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(data.valor)}</p>
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
