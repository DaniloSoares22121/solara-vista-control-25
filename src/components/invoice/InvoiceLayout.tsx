
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
    documento: "000.745.35-03",
    endereco: "AV FLAMBOYANT",
    cidade: "Goiânia",
    uf: "GO",
    cep: "74000-000"
  },
  consumo: {
    energiaConvencional: { quantidade: 8458, valorUnit: 1.073200, total: 8666.01 },
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

  const chartData = data.historico.map(item => ({
    mes: item.mes.split('/')[0],
    valor: item.valor
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

      if (isLayoutRoute) {
        const customPdfBytes = await generateCustomPDF('invoice-layout');
        
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
    <div className="min-h-screen bg-white py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botão para gerar PDF */}
        <div className="mb-6 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLayoutRoute ? 'Baixar Modelo PDF' : 'Baixar PDF Completo'}
          </Button>
        </div>

        {/* Invoice content with ref */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-teal-400 p-6 rounded-t-lg relative">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-white text-4xl font-bold mb-2">energy</h1>
                <h1 className="text-white text-4xl font-bold">PAY</h1>
              </div>
              <div className="text-white text-right">
                <p className="text-sm">📱 (62) 3140-7070</p>
                <p className="text-sm">energypay.me</p>
                <p className="text-xs mt-2">Av. Antônio Fidélis, 205</p>
                <p className="text-xs">Parque Amazônia • 74545-090</p>
                <p className="text-xs">Goiânia • GO</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-gray-100 p-4 border-l-4 border-teal-400">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Cliente:</strong> {data.cliente.nome}</p>
                <p><strong>CPF:</strong> {data.cliente.documento}</p>
                <p><strong>Endereço:</strong> {data.cliente.endereco}</p>
                <p className="text-xs text-gray-600">74545-090 • GOIÂNIA GO</p>
              </div>
              <div>
                <p><strong>Data de emissão:</strong> {data.detalhes.dataEmissao}</p>
                <p><strong>N° da instalação:</strong> 100005059516 <strong>Classe:</strong> Residencial Trifásico</p>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-white">
            <div className="text-center border border-teal-400 p-3 rounded">
              <p className="text-xs text-gray-600">N.° DA FATURA:</p>
              <p className="font-bold text-lg">{data.numero}</p>
            </div>
            <div className="text-center border border-teal-400 p-3 rounded">
              <p className="text-xs text-gray-600">VENCIMENTO:</p>
              <p className="font-bold text-lg">{data.vencimento}</p>
            </div>
            <div className="text-center border border-teal-400 p-3 rounded">
              <p className="text-xs text-gray-600">REF.:</p>
              <p className="font-bold text-lg">{data.detalhes.referencia}</p>
            </div>
          </div>

          <div className="text-center p-2">
            <p className="text-xs text-gray-600">VALOR A PAGAR:</p>
            <p className="font-bold text-3xl text-black">{formatCurrency(data.valor)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {/* Economia Section */}
            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">💰</span>
                  </div>
                  <h3 className="font-bold text-lg">Economia com</h3>
                </div>
                <h3 className="font-bold text-lg text-green-600 mb-2">a Energy Pay ✓</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm">ECONOMIA NO MÊS</span>
                    <span className="font-bold">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ECONOMIA ACUMULADA</span>
                    <span className="font-bold">R$ 7.474,01</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-bold text-sm mb-2">HISTÓRICO DE ECONOMIA</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis 
                          dataKey="mes" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis hide />
                        <Bar 
                          dataKey="valor" 
                          fill="#10b981" 
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Fatura Energy Pay Section */}
            <div>
              <div className="bg-green-500 text-white p-3 rounded-t text-center">
                <h3 className="font-bold">FATURA ENERGY PAY</h3>
              </div>
              
              <div className="border border-green-500 border-t-0 p-4 rounded-b">
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center">
                    <p>QUANTIDADE</p>
                  </div>
                  <div className="text-center">
                    <p>VALOR A PAGAR</p>
                  </div>
                  <div></div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                  <div>
                    <p>Energia elétrica compensada</p>
                  </div>
                  <div className="text-center">
                    <p>8.458 kWh</p>
                  </div>
                  <div className="text-right">
                    <p>R$ 6.284,64</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                  <div>
                    <p>Desconto ajuste de tarifas</p>
                  </div>
                  <div></div>
                  <div className="text-right">
                    <p>-R$ 0,00</p>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid grid-cols-3 gap-2 text-sm font-bold">
                  <div>
                    <p>Total:</p>
                  </div>
                  <div></div>
                  <div className="text-right">
                    <p>R$ 6.284,64</p>
                  </div>
                </div>
              </div>

              {/* Demonstrativo Section */}
              <div className="mt-4">
                <div className="bg-green-500 text-white p-2 rounded-t text-center">
                  <h4 className="font-bold text-sm">DEMONSTRATIVO DE ECONOMIA</h4>
                </div>
                
                <div className="border border-green-500 border-t-0 p-3 rounded-b">
                  <div className="text-center mb-2">
                    <p className="text-xs text-green-600">VALOR TOTAL DA ENERGIA SEM A ENERGY PAY</p>
                  </div>
                  
                  <div className="space-y-1 text-xs mb-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span>Energia elétrica</span>
                      <span className="text-center">8.558 kWh</span>
                      <span className="text-right">R$ 8.666,01</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-bold">
                      <span>Total:</span>
                      <span></span>
                      <span className="text-right">R$ 8.666,01</span>
                    </div>
                  </div>

                  <div className="text-center mb-2">
                    <p className="text-xs text-green-600">VALOR TOTAL DA ENERGIA COM A ENERGY PAY</p>
                  </div>
                  
                  <div className="space-y-1 text-xs mb-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span>Energia elétrica não compensada</span>
                      <span className="text-center">100 kWh</span>
                      <span className="text-right">R$ 385,90</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span>Ajuste de tarifas</span>
                      <span></span>
                      <span className="text-right">-R$ 0,00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span>Fatura ENERGY PAY</span>
                      <span></span>
                      <span className="text-right">R$ 6.284,64</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-bold">
                      <span>Total:</span>
                      <span></span>
                      <span className="text-right">R$ 6.385,90</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-center">
                      <p className="text-xs font-bold text-green-800">CÁLCULO DA ECONOMIA</p>
                      <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                        <div>
                          <p>Valor total da energia SEM A ENERGY PAY</p>
                          <p>Valor total da energia COM A ENERGY PAY</p>
                        </div>
                        <div className="text-right">
                          <p>R$ 8.666,01</p>
                          <p>R$ 6.385,90</p>
                        </div>
                      </div>
                      <div className="border-t border-green-200 mt-1 pt-1">
                        <div className="flex justify-between font-bold text-green-800">
                          <span>Total Economizado:</span>
                          <span>{formatCurrency(data.economiaTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PIX Payment Section */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center max-w-xs">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                <QrCode className="w-20 h-20 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 mb-2">Pague via PIX</p>
              <p className="text-lg font-bold">{formatCurrency(data.valor)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-4 rounded-b-lg">
            <div className="text-center text-xs">
              <p><strong>RECEBEDOR:</strong> J7 EMPREENDIMENTOS E CONSULTORIA LTDA - CNPJ: 14.375.534/0001-07</p>
              <div className="mt-2 font-mono text-xs">
                {data.codigoBarras}
              </div>
              <div className="flex justify-center mt-2">
                <div className="h-12 bg-black bg-opacity-20 w-full max-w-md rounded" style={{
                  backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, transparent 2px, transparent 4px)`
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLayout;
