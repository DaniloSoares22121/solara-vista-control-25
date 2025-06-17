
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
    { mes: "MAI/2025", valor: 2280.11, semEnergyPay: 8666.01, comEnergyPay: 6385.90 },
    { mes: "ABR/2025", valor: 1932.18, semEnergyPay: 8666.01, comEnergyPay: 6385.90 },
    { mes: "MAR/2025", valor: 1831.39, semEnergyPay: 8666.01, comEnergyPay: 6385.90 },
    { mes: "FEV/2025", valor: 1430.33, semEnergyPay: 8666.01, comEnergyPay: 6385.90 },
    { mes: "JAN/2025", valor: 0, semEnergyPay: 8666.01, comEnergyPay: 6385.90 },
    { mes: "DEZ/2024", valor: 0, semEnergyPay: 8666.01, comEnergyPay: 6385.90 }
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
    <div className="min-h-screen bg-gray-50 py-1">
      <div className="container mx-auto px-1 max-w-4xl">
        {/* Action button */}
        <div className="mb-1 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm font-semibold"
          >
            <Download className="w-4 h-4 mr-1" />
            {isLayoutRoute ? 'Baixar PDF' : 'Gerar PDF Completo'}
          </Button>
        </div>

        {/* Invoice container - ultra compacto para uma página */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '210mm', minHeight: '290mm', maxHeight: '290mm', fontSize: '8pt', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.2' }}>
          
          {/* Header - ultra compacto */}
          <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold mb-0 leading-none">energy</h1>
                <h2 className="text-sm font-light leading-none">PAY</h2>
              </div>
              <div className="text-right text-xs">
                <div className="mb-1 flex items-center">
                  <Phone className="w-3 h-3 inline mr-1" />
                  <span>(62) 3140-7070</span>
                </div>
                <div className="mb-1 flex items-center">
                  <Globe className="w-3 h-3 inline mr-1" />
                  <span>energypay.me</span>
                </div>
                <div className="space-y-0 text-xs">
                  <p>Av. Antônio Fidelis, 205</p>
                  <p>Parque Amazônia - 74840-090</p>
                  <p>Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-2">
            {/* Client and invoice info - ultra compacto */}
            <div className="grid grid-cols-2 gap-2">
              {/* Client data */}
              <div className="bg-gray-50 rounded p-2">
                <div className="flex items-center mb-1">
                  <User className="w-3 h-3 text-green-600 mr-1" />
                  <h3 className="text-xs font-bold text-gray-800">DADOS DO CLIENTE</h3>
                </div>
                <div className="space-y-1">
                  <div>
                    <p className="text-xs text-gray-600 mb-0">Cliente</p>
                    <p className="font-bold text-gray-800 text-xs leading-tight">{data.cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0">CPF</p>
                    <p className="font-bold text-gray-800 font-mono text-xs">{data.cliente.documento}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0">Endereço</p>
                    <p className="text-gray-800 text-xs leading-tight">{data.cliente.endereco}</p>
                    <p className="text-gray-700 text-xs leading-tight">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                    <p className="text-gray-700 text-xs leading-tight">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                  </div>
                </div>
                <Separator className="my-1" />
                <div className="space-y-1">
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
              <div className="bg-green-50 rounded p-2">
                <div className="flex items-center mb-1">
                  <FileText className="w-3 h-3 text-green-600 mr-1" />
                  <h3 className="text-xs font-bold text-gray-800">DETALHES DA FATURA</h3>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-white p-2 rounded border-l-2 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-0">Nº DA FATURA</p>
                    <p className="text-sm font-bold text-gray-800">{data.numero}</p>
                  </div>
                  <div className="bg-white p-2 rounded border-l-2 border-red-500">
                    <p className="text-xs font-bold text-gray-600 mb-0">VENCIMENTO</p>
                    <p className="text-sm font-bold text-red-600">{data.vencimento}</p>
                  </div>
                  <div className="bg-white p-2 rounded border-l-2 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-0">REFERÊNCIA</p>
                    <p className="text-sm font-bold text-green-600">{data.detalhes.referencia}</p>
                  </div>
                  <div className="bg-white p-2 rounded border-l-2 border-green-500">
                    <p className="text-xs font-bold text-gray-600 mb-0">VALOR A PAGAR</p>
                    <p className="text-sm font-bold text-green-700">{formatCurrency(data.valor)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Economy showcase - compacto */}
            <div className="bg-green-100 p-2 rounded">
              <div className="flex items-center justify-center mb-1">
                <Award className="w-4 h-4 text-green-600 mr-1" />
                <h2 className="text-xs font-bold text-gray-800">Economia com a Energy Pay</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border-l-2 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      <span className="font-bold text-gray-700 text-xs">ECONOMIA NO MÊS</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                </div>
                <div className="bg-white p-2 rounded border-l-2 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 text-green-600 mr-1" />
                      <span className="font-bold text-gray-700 text-xs">ECONOMIA ACUMULADA</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">R$ 7.474,01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two columns: History and Invoice table - ultra compactos */}
            <div className="grid grid-cols-2 gap-2">
              {/* History chart */}
              <div className="bg-white border rounded overflow-hidden">
                <div className="bg-green-800 text-white p-1">
                  <h3 className="text-center font-bold text-xs">HISTÓRICO DE ECONOMIA</h3>
                </div>
                <div className="p-2">
                  <div className="space-y-1.5">
                    {data.historico.slice(0, 6).map((item, index) => (
                      <div key={index} className="grid grid-cols-[auto_1fr_auto] gap-1 items-center">
                        <span className="font-bold text-gray-600 text-xs font-mono w-14">{item.mes}</span>
                        <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.max(25, (item.valor / 2500) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-green-600 text-right w-16">{formatCurrency(item.valor)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>R$ 0</span>
                    <span>R$ 1.000</span>
                    <span>R$ 2.500</span>
                  </div>
                </div>
              </div>

              {/* Invoice table */}
              <div className="bg-white border rounded overflow-hidden">
                <div className="bg-green-800 text-white p-1">
                  <h3 className="text-center font-bold text-xs">FATURA ENERGY PAY</h3>
                </div>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-1 px-1 font-bold text-gray-700 text-xs">DESCRIÇÃO</th>
                        <th className="text-center py-1 px-1 font-bold text-gray-700 text-xs">QTD</th>
                        <th className="text-center py-1 px-1 font-bold text-gray-700 text-xs">VALOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-1 px-1 text-xs">Energia elétrica compensada</td>
                        <td className="text-center py-1 px-1 font-bold text-xs">8.458 kWh</td>
                        <td className="text-center py-1 px-1 font-bold text-green-600 text-xs">{formatCurrency(data.valor)}</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-1 px-1 text-xs">Desconto ajuste de tarifas</td>
                        <td className="text-center py-1 px-1 text-xs">-</td>
                        <td className="text-center py-1 px-1 text-xs">-R$ 0,00</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-1 px-1 font-bold text-green-700 text-xs">Total:</td>
                        <td className="text-center py-1 px-1"></td>
                        <td className="text-center py-1 px-1 font-bold text-green-700 text-xs">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Economics demonstration - ultra compacto */}
            <div className="bg-white border rounded overflow-hidden">
              <div className="bg-green-800 text-white p-1">
                <h3 className="text-center font-bold text-xs">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Without Energy Pay */}
                  <div className="bg-red-50 rounded p-2">
                    <h4 className="text-xs font-bold text-red-700 mb-1 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-white mr-1 text-xs">❌</span>
                      SEM A ENERGY PAY
                    </h4>
                    <div className="overflow-hidden rounded border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-red-100">
                            <th className="text-left py-1 px-1 font-bold text-gray-700 text-xs">DESCRIÇÃO</th>
                            <th className="text-center py-1 px-1 font-bold text-gray-700 text-xs">VALOR</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-1 px-1 text-xs">Energia elétrica</td>
                            <td className="text-center py-1 px-1 font-bold text-xs">R$ 8.666,01</td>
                          </tr>
                          <tr className="bg-red-100">
                            <td className="py-1 px-1 font-bold text-red-700 text-xs">Total:</td>
                            <td className="text-center py-1 px-1 font-bold text-red-700 text-xs">R$ 8.666,01</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* With Energy Pay */}
                  <div className="bg-green-50 rounded p-2">
                    <h4 className="text-xs font-bold text-green-700 mb-1 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white mr-1 text-xs">✅</span>
                      COM A ENERGY PAY
                    </h4>
                    <div className="overflow-hidden rounded border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-green-100">
                            <th className="text-left py-1 px-1 font-bold text-gray-700 text-xs">DESCRIÇÃO</th>
                            <th className="text-center py-1 px-1 font-bold text-gray-700 text-xs">VALOR</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-1 px-1 text-xs">Energia não compensada</td>
                            <td className="text-center py-1 px-1 text-xs">R$ 101,26</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 px-1 text-xs">Fatura ENERGY PAY</td>
                            <td className="text-center py-1 px-1 font-bold text-xs">{formatCurrency(data.valor)}</td>
                          </tr>
                          <tr className="bg-green-100">
                            <td className="py-1 px-1 font-bold text-green-700 text-xs">Total:</td>
                            <td className="text-center py-1 px-1 font-bold text-green-700 text-xs">R$ 6.385,90</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Savings summary - compacto */}
                <div className="bg-green-100 rounded p-2 mt-2">
                  <h4 className="text-xs font-bold text-green-700 mb-1 text-center flex items-center justify-center">
                    <Award className="w-3 h-3 mr-1" />
                    RESUMO DA ECONOMIA
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center py-1 bg-white rounded px-2">
                      <span className="text-gray-700 font-bold text-xs">Valor SEM Energy Pay:</span>
                      <span className="font-bold text-red-600 text-xs">R$ 8.666,01</span>
                    </div>
                    <div className="flex justify-between items-center py-1 bg-white rounded px-2">
                      <span className="text-gray-700 font-bold text-xs">Valor COM Energy Pay:</span>
                      <span className="font-bold text-green-600 text-xs">R$ 6.385,90</span>
                    </div>
                    <div className="bg-white rounded p-2 border-2 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-green-700">Economia Total:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment information - ultra compacto */}
            <div className="grid grid-cols-2 gap-2">
              {/* Company info and barcode */}
              <div className="bg-white border rounded p-2">
                <div className="bg-green-50 p-1 rounded mb-2">
                  <p className="text-xs font-bold text-green-700 flex items-center justify-center">
                    <Building2 className="w-3 h-3 mr-1" />
                    RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-bold text-center">CNPJ: 14.375.534/0001-07</p>
                </div>
                
                {/* Barcode section */}
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-mono text-xs font-bold mb-1 text-center text-gray-700 bg-white p-1 rounded border">
                    {data.codigoBarras}
                  </div>
                  <div className="flex justify-center mb-1">
                    <div className="h-6 bg-black w-full max-w-sm rounded" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                    }}></div>
                  </div>
                  <p className="text-gray-600 text-xs text-center">
                    Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                  </p>
                </div>
              </div>

              {/* QR Code PIX */}
              <div className="bg-white border rounded p-2 flex items-center justify-center">
                <div className="bg-green-50 p-3 rounded border-2 border-green-200 text-center">
                  <div className="w-14 h-14 mx-auto bg-gray-100 rounded flex items-center justify-center mb-1 border">
                    <QrCode className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xs font-bold mb-1 text-gray-800 flex items-center justify-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white mr-1 text-xs">📱</span>
                    Pague via PIX
                  </p>
                  <p className="text-sm font-bold text-green-600">{formatCurrency(data.valor)}</p>
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
