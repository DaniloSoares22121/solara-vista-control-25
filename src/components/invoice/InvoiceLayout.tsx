
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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botão para gerar PDF */}
        <div className="mb-4 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLayoutRoute ? 'Baixar Modelo PDF' : 'Baixar PDF Completo'}
          </Button>
        </div>

        {/* Invoice content with ref */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontSize: '10pt' }}>
          
          {/* Header com design curvo verde */}
          <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white" style={{ 
            borderBottomLeftRadius: '60px',
            borderBottomRightRadius: '60px',
            padding: '1.5rem 2rem 2.5rem 2rem'
          }}>
            <div className="flex justify-between items-start">
              <div className="flex items-baseline">
                <h1 className="text-5xl font-bold mr-3" style={{ fontFamily: 'Arial, sans-serif' }}>energy</h1>
                <h2 className="text-3xl font-light">PAY</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <span className="text-2xl mr-2">📱</span>
                  <span className="text-base font-semibold">(62) 3140-7070</span>
                </div>
                <p className="font-bold text-lg mb-3 tracking-wide">energypay.me</p>
                <div className="text-xs leading-relaxed space-y-1">
                  <p>Av. Antônio Fidelis, 205</p>
                  <p>Parque Amazônia - 74840-090</p>
                  <p>Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Seção 1: Informações do Cliente e Dados da Fatura */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dados do Cliente */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">DADOS DO CLIENTE</h3>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 gap-1">
                    <p><span className="font-semibold text-gray-600">Cliente:</span> {data.cliente.nome}</p>
                    <p><span className="font-semibold text-gray-600">CPF:</span> {data.cliente.documento}</p>
                    <p><span className="font-semibold text-gray-600">Endereço:</span> {data.cliente.endereco}</p>
                    <p className="text-gray-700">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                    <p className="text-gray-700">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <p><span className="font-medium">Data de emissão:</span> {data.detalhes.dataEmissao}</p>
                  <p><span className="font-medium">Nº da Instalação:</span> 1000052091б</p>
                  <p><span className="font-medium">Classe:</span> Residencial Trifásico</p>
                </div>
              </div>

              {/* Detalhes da Fatura */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">DETALHES DA FATURA</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Nº DA FATURA</p>
                    <p className="text-lg font-bold text-gray-800">{data.numero}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-red-500 shadow-sm">
                    <p className="text-xs font-semibold text-gray-600 mb-1">VENCIMENTO</p>
                    <p className="text-lg font-bold text-gray-800">{data.vencimento}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <p className="text-xs font-semibold text-gray-600 mb-1">REFERÊNCIA</p>
                    <p className="text-lg font-bold text-gray-800">{data.detalhes.referencia}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-600 shadow-sm">
                    <p className="text-xs font-semibold text-gray-600 mb-1">VALOR A PAGAR</p>
                    <p className="text-lg font-bold text-green-700">{formatCurrency(data.valor)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 2: Economia com Energy Pay */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800">Economia com a Energy Pay ✓</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-300 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">ECONOMIA NO MÊS</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-300 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">ECONOMIA ACUMULADA</span>
                    <span className="text-xl font-bold text-green-600">R$ 7.474,01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 3: Histórico de Economia */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="bg-green-600 text-white p-3 rounded-t-xl">
                <h3 className="text-center font-bold text-sm">HISTÓRICO DE ECONOMIA</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {data.historico.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-xs font-medium text-gray-600 w-16 text-right mr-3">{item.mes}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full flex items-center justify-end pr-2 shadow-inner" 
                          style={{ width: `${Math.max(20, (item.valor / 2500) * 100)}%` }}
                        >
                          <span className="text-xs font-bold text-white">{formatCurrency(item.valor)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-500 px-16">
                  <span>0</span>
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                  <span>R$</span>
                </div>
              </div>
            </div>

            {/* Seção 4: Fatura Energy Pay */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="bg-green-600 text-white p-3 rounded-t-xl">
                <h3 className="text-center font-bold text-sm">FATURA ENERGY PAY</h3>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-bold text-gray-600">DESCRIÇÃO</th>
                        <th className="text-center py-2 font-bold text-gray-600">QUANTIDADE</th>
                        <th className="text-center py-2 font-bold text-gray-600">VALOR A PAGAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Energia elétrica compensada</td>
                        <td className="text-center py-2 font-medium">8.458 kWh</td>
                        <td className="text-center py-2 font-bold">{formatCurrency(data.valor)}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Desconto ajuste de tarifas</td>
                        <td className="text-center py-2"></td>
                        <td className="text-center py-2 font-bold">-R$ 0,00</td>
                      </tr>
                      <tr className="border-t-2 border-gray-400 bg-gray-50">
                        <td className="py-2 font-bold">Total:</td>
                        <td className="text-center py-2"></td>
                        <td className="text-center py-2 font-bold text-green-600 text-sm">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Seção 5: Demonstrativo de Economia */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="bg-green-600 text-white p-3 rounded-t-xl">
                <h3 className="text-center font-bold text-sm">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Valor sem Energy Pay */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="text-sm font-bold text-red-700 mb-3">VALOR TOTAL DA ENERGIA SEM A ENERGY PAY</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-red-300">
                          <th className="text-left py-2 font-bold text-gray-600">DESCRIÇÃO</th>
                          <th className="text-center py-2 font-bold text-gray-600">QUANTIDADE</th>
                          <th className="text-center py-2 font-bold text-gray-600">TARIFA</th>
                          <th className="text-center py-2 font-bold text-gray-600">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-red-200">
                          <td className="py-2">Energia elétrica</td>
                          <td className="text-center py-2">8.558 kWh</td>
                          <td className="text-center py-2">R$ 1,01262100</td>
                          <td className="text-center py-2 font-bold">R$ 8.666,01</td>
                        </tr>
                        <tr className="border-t-2 border-red-400 bg-red-100">
                          <td className="py-2 font-bold">Total:</td>
                          <td className="text-center py-2"></td>
                          <td className="text-center py-2"></td>
                          <td className="text-center py-2 font-bold text-red-700 text-sm">R$ 8.666,01</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Valor com Energy Pay */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-sm font-bold text-green-700 mb-3">VALOR TOTAL DA ENERGIA COM A ENERGY PAY</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-green-300">
                          <th className="text-left py-2 font-bold text-gray-600">DESCRIÇÃO</th>
                          <th className="text-center py-2 font-bold text-gray-600">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-green-200">
                          <td className="py-2">Energia elétrica não compensada</td>
                          <td className="text-center py-2">R$ 101,26</td>
                        </tr>
                        <tr className="border-b border-green-200">
                          <td className="py-2">Ajuste de tarifas</td>
                          <td className="text-center py-2">R$ 0,00</td>
                        </tr>
                        <tr className="border-b border-green-200">
                          <td className="py-2">Fatura ENERGY PAY</td>
                          <td className="text-center py-2 font-bold">{formatCurrency(data.valor)}</td>
                        </tr>
                        <tr className="border-t-2 border-green-400 bg-green-100">
                          <td className="py-2 font-bold">Total:</td>
                          <td className="text-center py-2 font-bold text-green-700 text-sm">R$ 6.385,90</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cálculo da Economia */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4 border-2 border-green-400">
                  <h4 className="text-sm font-bold text-green-700 mb-3 text-center">RESUMO DA ECONOMIA</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-700">Valor <strong>SEM</strong> Energy Pay:</span>
                      <span className="font-bold text-red-600">R$ 8.666,01</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-700">Valor <strong>COM</strong> Energy Pay:</span>
                      <span className="font-bold text-green-600">R$ 6.385,90</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="bg-white rounded-lg p-3 border-2 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-700">Economia Total:</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 6: Informações de Pagamento */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                  <p className="text-sm font-bold text-green-700">
                    RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                  </p>
                  <p className="text-xs text-green-600 mt-1">CNPJ: 14.375.534/0001-07</p>
                </div>
                
                {/* Código de Barras */}
                <div className="bg-gray-50 p-4 rounded-xl border mb-4">
                  <div className="font-mono text-sm font-bold mb-3 tracking-wider text-center">
                    {data.codigoBarras}
                  </div>
                  <div className="flex justify-center mb-3">
                    <div className="h-12 bg-black w-full max-w-md rounded" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                    }}></div>
                  </div>
                  <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
                    Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                  </p>
                </div>

                {/* QR Code PIX */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-green-200">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-2 border-2 border-gray-300">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold mb-1 text-gray-800">Pague via PIX</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(data.valor)}</p>
                  </div>
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
