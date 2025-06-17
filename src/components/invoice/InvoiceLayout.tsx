
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Download } from 'lucide-react';
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
        <div id="invoice-layout" ref={invoiceRef} className="bg-white" style={{ width: '210mm', minHeight: '297mm', fontSize: '11pt' }}>
          
          {/* Header with green curved design */}
          <div className="relative bg-gradient-to-r from-green-500 to-green-400 text-white p-6 mb-6" style={{ 
            borderBottomLeftRadius: '100px',
            borderBottomRightRadius: '100px',
            clipPath: 'ellipse(100% 100% at 50% 0%)'
          }}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold">energy</h1>
                <h2 className="text-2xl font-normal text-gray-200">PAY</h2>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">📱</span>
                  <span>(62) 3140-7070</span>
                </div>
                <p className="font-semibold">energypay.me</p>
                <div className="mt-3 text-xs">
                  <p>Av. Antônio Fidelis, 205</p>
                  <p>Parque Amazônia - 74840-090</p>
                  <p>Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* Client Info */}
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="text-sm mb-1"><strong>Cliente:</strong> {data.cliente.nome}</p>
                  <p className="text-sm mb-1"><strong>CPF:</strong> {data.cliente.documento}</p>
                  <p className="text-sm mb-1"><strong>Endereço:</strong> {data.cliente.endereco}</p>
                  <p className="text-sm mb-1">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                  <p className="text-sm">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                  <div className="mt-3 text-xs text-gray-600">
                    <p>Data de emissão: {data.detalhes.dataEmissao}</p>
                    <p>Nº da Instalação: 1000052091б  Classe: Residencial Trifásico</p>
                  </div>
                </div>
                <div className="ml-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border-l-4 border-green-500">
                      <p className="font-semibold text-gray-600">Nº DA FATURA:</p>
                      <p className="text-lg font-bold">{data.numero}</p>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-red-500">
                      <p className="font-semibold text-gray-600">VENCIMENTO:</p>
                      <p className="text-lg font-bold">{data.vencimento}</p>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                      <p className="font-semibold text-gray-600">REF:</p>
                      <p className="text-lg font-bold">{data.detalhes.referencia}</p>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-600">
                      <p className="font-semibold text-gray-600">VALOR A PAGAR:</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(data.valor)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Economy Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">🏆</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Economia com</h2>
                </div>
                <h2 className="text-xl font-bold text-green-600 mb-6">a Energy Pay ✓</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border-l-4 border-green-500">
                    <span className="font-semibold text-gray-700">ECONOMIA NO MÊS</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border-l-4 border-green-500">
                    <span className="font-semibold text-gray-700">ECONOMIA ACUMULADA</span>
                    <span className="text-lg font-bold text-green-600">R$ 7.474,01</span>
                  </div>
                </div>

                {/* Historical Chart */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-700 mb-4 text-center">HISTÓRICO DE ECONOMIA</h3>
                  <div className="space-y-2">
                    {data.historico.slice(0, 6).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600">{item.mes}</span>
                        <div className="flex-1 mx-3">
                          <div className="bg-green-500 h-4 rounded" style={{ 
                            width: `${Math.max(10, (item.valor / 2500) * 100)}%` 
                          }}></div>
                        </div>
                        <span className="text-xs font-bold text-green-600">{formatCurrency(item.valor)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>500</span>
                    <span>1000</span>
                    <span>1500</span>
                    <span>2000</span>
                    <span>R$</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Invoice Details */}
              <div>
                {/* Fatura Energy Pay */}
                <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
                  <h3 className="text-center font-bold text-lg">FATURA ENERGY PAY</h3>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 mb-2">
                    <span></span>
                    <span className="text-center">QUANTIDADE</span>
                    <span className="text-center">VALOR A PAGAR</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <span>Energia elétrica compensada</span>
                    <span className="text-center">8.458 kWh</span>
                    <span className="text-center">{formatCurrency(data.valor)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <span>Desconto ajuste de tarifas</span>
                    <span className="text-center"></span>
                    <span className="text-center">-R$ 0,00</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="grid grid-cols-3 gap-2 text-sm font-bold">
                      <span>Total:</span>
                      <span></span>
                      <span className="text-center">{formatCurrency(data.valor)}</span>
                    </div>
                  </div>
                </div>

                {/* Demonstrativo de Economia */}
                <div className="bg-green-500 text-white p-3 rounded-lg mb-4">
                  <h3 className="text-center font-bold">DEMONSTRATIVO DE ECONOMIA</h3>
                </div>

                {/* Valor sem Energy Pay */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-green-600 mb-2">VALOR TOTAL DA ENERGIA SEM A ENERGY PAY</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 mb-2">
                      <span></span>
                      <span className="text-center">QUANTIDADE</span>
                      <span className="text-center">TARIFA</span>
                      <span className="text-center">VALOR A PAGAR</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                      <span>Energia elétrica</span>
                      <span className="text-center">8.558 kWh</span>
                      <span className="text-center">R$ 1,01262100</span>
                      <span className="text-center">R$ 8.666,01</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="grid grid-cols-4 gap-2 text-sm font-bold">
                        <span>Total:</span>
                        <span></span>
                        <span></span>
                        <span className="text-center">R$ 8.666,01</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Valor com Energy Pay */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-green-600 mb-2">VALOR TOTAL DA ENERGIA COM A ENERGY PAY</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-600 mb-2">
                      <span></span>
                      <span className="text-center">VALOR A PAGAR</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <span>Energia elétrica não compensada</span>
                        <span className="text-center">R$ 101,26</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span>Ajuste de tarifas</span>
                        <span className="text-center">R$ 0,00</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span>Fatura ENERGY PAY</span>
                        <span className="text-center">{formatCurrency(data.valor)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                        <span>Total:</span>
                        <span className="text-center">R$ 6.385,90</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cálculo da Economia */}
                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="text-sm font-bold text-green-600 mb-3 text-center">CÁLCULO DA ECONOMIA</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor total da energia <strong>SEM</strong> A ENERGY PAY</span>
                      <span className="font-bold">R$ 8.666,01</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor total da energia <strong>COM</strong> A ENERGY PAY</span>
                      <span className="font-bold">R$ 6.385,90</span>
                    </div>
                    <div className="border-t-2 border-green-500 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-green-600">
                        <span>Total Economizado:</span>
                        <span>{formatCurrency(data.economiaTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-green-600 mb-4">
                RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA - CNPJ: 14.375.534/0001-07
              </p>
              
              {/* Barcode */}
              <div className="mb-4">
                <div className="font-mono text-lg font-bold mb-2">
                  {data.codigoBarras}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="h-16 bg-black w-full max-w-md" style={{
                    backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                  }}></div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                Você poderá pagar sua fatura via internet banking pelo app ou site do seu banco, ou imprimir e pagar em qualquer banco ou casa lotérica.
              </p>

              {/* PIX QR Code */}
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold">Pague via PIX</p>
                  <p className="font-bold text-green-600">{formatCurrency(data.valor)}</p>
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
