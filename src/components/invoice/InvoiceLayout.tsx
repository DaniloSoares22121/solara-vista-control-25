
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
        <div id="invoice-layout" ref={invoiceRef} className="bg-white border border-gray-300" style={{ width: '210mm', minHeight: '297mm', fontSize: '10pt' }}>
          {/* Header */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-blue-600 text-xl font-bold uppercase">energy</h1>
                <h1 className="text-blue-600 text-xl font-bold uppercase">PAY</h1>
              </div>
              <div className="text-right text-xs">
                <p>Av. Antônio Fidelis, 205</p>
                <p>Parque Amazônia - 74840-090</p>
                <p>Goiânia - GO</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-4">
              <div className="text-sm">
                <p><strong>Cliente:</strong> {data.cliente.nome}</p>
                <p><strong>CPF:</strong> {data.cliente.documento}</p>
                <p><strong>Endereço:</strong> {data.cliente.endereco}</p>
                <p>99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                <p>{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
              </div>
            </div>

            {/* Invoice Details Table */}
            <div className="mb-4">
              <table className="w-full border-collapse border border-black text-sm">
                <tr>
                  <td className="border border-black p-2">Data de emissão: {data.detalhes.dataEmissao}</td>
                  <td className="border border-black p-2">Nº da Instalação: 100005059516</td>
                  <td className="border border-black p-2">Classe: Residencial Trifásico</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2"><strong>Nº DA FATURA: {data.numero}</strong></td>
                  <td className="border border-black p-2"><strong>VENCIMENTO: {data.vencimento}</strong></td>
                  <td className="border border-black p-2"><strong>REF: {data.detalhes.referencia}</strong></td>
                  <td className="border border-black p-2 text-red-600"><strong>VALOR A PAGAR: {formatCurrency(data.valor)}</strong></td>
                </tr>
              </table>
            </div>

            {/* Economia Section */}
            <div className="mb-4">
              <h2 className="text-center font-bold uppercase text-lg mb-3">Economia com a Energy Pay</h2>
              
              <div className="flex justify-between mb-4">
                <div className="w-45% text-center border border-black p-3">
                  <p className="font-bold">ECONOMIA NO MÊS</p>
                  <p className="text-green-600 font-bold text-lg">{formatCurrency(data.economiaTotal)}</p>
                </div>
                <div className="w-45% text-center border border-black p-3">
                  <p className="font-bold">ECONOMIA ACUMULADA</p>
                  <p className="text-green-600 font-bold text-lg">R$ 7.474,01</p>
                </div>
              </div>
            </div>

            {/* Historical Savings */}
            <div className="mb-4">
              <h3 className="text-center font-bold uppercase text-lg mb-3">HISTÓRICO DE ECONOMIA</h3>
              
              {/* Sem Energy Pay */}
              <div className="mb-3">
                <p className="font-bold mb-2">VALOR TOTAL DA ENERGIA SEM A ENERGY PAY</p>
                <table className="w-full border-collapse border border-black text-sm">
                  <tr>
                    <td className="border border-black p-1 w-1/2">Energia elétrica</td>
                    <td className="border border-black p-1 w-15% text-center">8.558 kWh</td>
                    <td className="border border-black p-1 w-15% text-center">R$ 1,01262100</td>
                    <td className="border border-black p-1 w-1/5 text-right">R$ 8.666,01</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1 font-bold" colSpan={4}>Total: R$ 8.666,01</td>
                  </tr>
                </table>
              </div>

              {/* Com Energy Pay */}
              <div className="mb-3">
                <p className="font-bold mb-2">VALOR TOTAL DA ENERGIA COM A ENERGY PAY</p>
                <table className="w-full border-collapse border border-black text-sm">
                  <tr>
                    <td className="border border-black p-1 w-4/5">Energia elétrica não compensada</td>
                    <td className="border border-black p-1 w-1/5 text-right">R$ 101,26</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">Ajuste de tarifas</td>
                    <td className="border border-black p-1 text-right">R$ 0,00</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">Fatura ENERGY PAY</td>
                    <td className="border border-black p-1 text-right">{formatCurrency(data.valor)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1 font-bold" colSpan={2}>Total: R$ 6.385,90</td>
                  </tr>
                </table>
              </div>

              {/* Cálculo da Economia */}
              <div className="mb-4">
                <p className="font-bold mb-2">CÁLCULO DA ECONOMIA</p>
                <table className="w-full border-collapse border border-black text-sm">
                  <tr>
                    <td className="border border-black p-1 w-4/5">Valor total da energia SEM A ENERGY PAY</td>
                    <td className="border border-black p-1 w-1/5 text-right">R$ 8.666,01</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">Valor total da energia COM A ENERGY PAY</td>
                    <td className="border border-black p-1 text-right">R$ 6.385,90</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1 font-bold" colSpan={2}>Total Economizado: {formatCurrency(data.economiaTotal)}</td>
                  </tr>
                </table>
              </div>
            </div>

            {/* PIX QR Code */}
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-xs">Pague via PIX</p>
                <p className="font-bold">{formatCurrency(data.valor)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4">
              <p className="text-center text-sm mb-2">
                <strong>RECEBEDOR:</strong> J7 EMPREENDIMENTOS E CONSULTORIA LTDA - CNPJ: 14.375.534/0001-07
              </p>
              
              <div className="text-center mb-2">
                <div className="font-mono text-xs mb-1">
                  {data.codigoBarras}
                </div>
                <div className="flex justify-center">
                  <div className="h-12 bg-black bg-opacity-20 w-full max-w-md rounded" style={{
                    backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, transparent 2px, transparent 4px)`
                  }}></div>
                </div>
              </div>

              <p className="text-center text-xs">
                Você poderá pagar sua fatura via internet banking pelo app ou site do seu banco, ou imprimir e pagar em qualquer banco ou casa lotérica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLayout;
