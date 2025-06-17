
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Download, Award, TrendingUp, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Botão para gerar PDF */}
        <div className="mb-6 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl border-0 px-6 py-3 text-base font-semibold transform transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            {isLayoutRoute ? 'Baixar Modelo PDF' : 'Baixar PDF Completo'}
          </Button>
        </div>

        {/* Invoice content with ref */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100" style={{ width: '210mm', minHeight: '297mm', fontSize: '10pt' }}>
          
          {/* Header moderno com gradiente aprimorado */}
          <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white overflow-hidden" style={{ 
            borderBottomLeftRadius: '80px',
            borderBottomRightRadius: '80px',
            padding: '2rem 2.5rem 3rem 2.5rem'
          }}>
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-baseline">
                <h1 className="text-6xl font-bold mr-4 tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>energy</h1>
                <h2 className="text-4xl font-light tracking-wide">PAY</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">📱</span>
                  </div>
                  <span className="text-lg font-semibold">(62) 3140-7070</span>
                </div>
                <p className="font-bold text-xl mb-4 tracking-wide">energypay.me</p>
                <div className="text-sm leading-relaxed space-y-1 bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="font-medium">Av. Antônio Fidelis, 205</p>
                  <p>Parque Amazônia - 74840-090</p>
                  <p>Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Seção 1: Informações do Cliente e Dados da Fatura */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dados do Cliente */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">👤</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">DADOS DO CLIENTE</h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-xs mb-1">Cliente</p>
                    <p className="font-semibold text-gray-800">{data.cliente.nome}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                    <p className="text-gray-600 text-xs mb-1">CPF</p>
                    <p className="font-semibold text-gray-800">{data.cliente.documento}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-l-4 border-orange-500">
                    <p className="text-gray-600 text-xs mb-1">Endereço</p>
                    <p className="font-medium text-gray-800">{data.cliente.endereco}</p>
                    <p className="text-gray-700">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                    <p className="text-gray-700">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                    <span className="text-gray-600">Data de emissão:</span>
                    <span className="font-semibold">{data.detalhes.dataEmissao}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                    <span className="text-gray-600">Nº da Instalação:</span>
                    <span className="font-semibold">1000052091б</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                    <span className="text-gray-600">Classe:</span>
                    <span className="font-semibold">Residencial Trifásico</span>
                  </div>
                </div>
              </div>

              {/* Detalhes da Fatura */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">📄</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">DETALHES DA FATURA</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Nº DA FATURA</p>
                    <p className="text-xl font-bold text-gray-800">{data.numero}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-xs font-semibold text-gray-600 mb-1">VENCIMENTO</p>
                    <p className="text-xl font-bold text-red-600">{data.vencimento}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-xs font-semibold text-gray-600 mb-1">REFERÊNCIA</p>
                    <p className="text-xl font-bold text-blue-600">{data.detalhes.referencia}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-xs font-semibold text-gray-600 mb-1">VALOR A PAGAR</p>
                    <p className="text-xl font-bold text-emerald-700">{formatCurrency(data.valor)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 2: Economia com Energy Pay - Design aprimorado */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Economia com a Energy Pay</h2>
                  <p className="text-green-600 font-semibold">✨ Energia solar inteligente ✨</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                      <span className="text-sm font-bold text-gray-700">ECONOMIA NO MÊS</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-6 h-6 text-emerald-600 mr-3" />
                      <span className="text-sm font-bold text-gray-700">ECONOMIA ACUMULADA</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">R$ 7.474,01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 3: Histórico de Economia - Design aprimorado */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                <h3 className="text-center font-bold text-base flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  HISTÓRICO DE ECONOMIA
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data.historico.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <span className="text-sm font-medium text-gray-600 w-20 text-right mr-4">{item.mes}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 h-8 rounded-full flex items-center justify-end pr-3 shadow-md transition-all duration-500 group-hover:from-green-600 group-hover:to-emerald-700" 
                          style={{ width: `${Math.max(25, (item.valor / 2500) * 100)}%` }}
                        >
                          <span className="text-sm font-bold text-white drop-shadow">{formatCurrency(item.valor)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between text-xs text-gray-500 px-24">
                  <span>0</span>
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                  <span>R$</span>
                </div>
              </div>
            </div>

            {/* Seção 4: Fatura Energy Pay - Tabela melhorada */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                <h3 className="text-center font-bold text-base">FATURA ENERGY PAY</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300 bg-gray-50">
                        <th className="text-left py-3 px-4 font-bold text-gray-700">DESCRIÇÃO</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-700">QUANTIDADE</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-700">VALOR A PAGAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">Energia elétrica compensada</td>
                        <td className="text-center py-3 px-4 font-medium">8.458 kWh</td>
                        <td className="text-center py-3 px-4 font-bold text-green-600">{formatCurrency(data.valor)}</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">Desconto ajuste de tarifas</td>
                        <td className="text-center py-3 px-4">-</td>
                        <td className="text-center py-3 px-4 font-bold text-gray-600">-R$ 0,00</td>
                      </tr>
                      <tr className="border-t-2 border-green-400 bg-green-50">
                        <td className="py-3 px-4 font-bold text-green-700">Total:</td>
                        <td className="text-center py-3 px-4"></td>
                        <td className="text-center py-3 px-4 font-bold text-green-700 text-lg">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Seção 5: Demonstrativo de Economia - Layout otimizado */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <h3 className="text-center font-bold text-base">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Valor sem Energy Pay */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border-2 border-red-200">
                  <h4 className="text-base font-bold text-red-700 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mr-3">❌</span>
                    VALOR TOTAL DA ENERGIA SEM A ENERGY PAY
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-red-300 bg-red-100">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">DESCRIÇÃO</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">QUANTIDADE</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">TARIFA</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-red-200 hover:bg-red-50 transition-colors">
                          <td className="py-3 px-4">Energia elétrica</td>
                          <td className="text-center py-3 px-4">8.558 kWh</td>
                          <td className="text-center py-3 px-4">R$ 1,01262100</td>
                          <td className="text-center py-3 px-4 font-bold">R$ 8.666,01</td>
                        </tr>
                        <tr className="border-t-2 border-red-400 bg-red-100">
                          <td className="py-3 px-4 font-bold text-red-700">Total:</td>
                          <td className="text-center py-3 px-4"></td>
                          <td className="text-center py-3 px-4"></td>
                          <td className="text-center py-3 px-4 font-bold text-red-700 text-lg">R$ 8.666,01</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Valor com Energy Pay */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                  <h4 className="text-base font-bold text-green-700 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-3">✅</span>
                    VALOR TOTAL DA ENERGIA COM A ENERGY PAY
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-green-300 bg-green-100">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">DESCRIÇÃO</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-green-200 hover:bg-green-50 transition-colors">
                          <td className="py-3 px-4">Energia elétrica não compensada</td>
                          <td className="text-center py-3 px-4">R$ 101,26</td>
                        </tr>
                        <tr className="border-b border-green-200 hover:bg-green-50 transition-colors">
                          <td className="py-3 px-4">Ajuste de tarifas</td>
                          <td className="text-center py-3 px-4">R$ 0,00</td>
                        </tr>
                        <tr className="border-b border-green-200 hover:bg-green-50 transition-colors">
                          <td className="py-3 px-4">Fatura ENERGY PAY</td>
                          <td className="text-center py-3 px-4 font-bold">{formatCurrency(data.valor)}</td>
                        </tr>
                        <tr className="border-t-2 border-green-400 bg-green-100">
                          <td className="py-3 px-4 font-bold text-green-700">Total:</td>
                          <td className="text-center py-3 px-4 font-bold text-green-700 text-lg">R$ 6.385,90</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cálculo da Economia - Design aprimorado */}
                <div className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 rounded-xl p-6 border-2 border-emerald-400 shadow-lg">
                  <h4 className="text-lg font-bold text-green-700 mb-4 text-center flex items-center justify-center">
                    <Award className="w-6 h-6 mr-2" />
                    RESUMO DA ECONOMIA
                  </h4>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between items-center py-2 bg-white rounded-lg px-4 shadow-sm">
                      <span className="text-gray-700">Valor <span className="font-bold text-red-600">SEM</span> Energy Pay:</span>
                      <span className="font-bold text-red-600 text-lg">R$ 8.666,01</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-white rounded-lg px-4 shadow-sm">
                      <span className="text-gray-700">Valor <span className="font-bold text-green-600">COM</span> Energy Pay:</span>
                      <span className="font-bold text-green-600 text-lg">R$ 6.385,90</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="bg-gradient-to-r from-white to-green-50 rounded-xl p-4 border-2 border-green-500 shadow-md">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-700 flex items-center">
                          <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">💰</span>
                          Economia Total:
                        </span>
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(data.economiaTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 6: Informações de Pagamento - Design modernizado */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 mb-6">
                  <p className="text-base font-bold text-blue-700 flex items-center justify-center">
                    <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">🏢</span>
                    RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                  </p>
                  <p className="text-sm text-blue-600 mt-2 font-medium">CNPJ: 14.375.534/0001-07</p>
                </div>
                
                {/* Código de Barras */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 mb-6 shadow-inner">
                  <div className="font-mono text-base font-bold mb-4 tracking-wider text-center text-gray-700">
                    {data.codigoBarras}
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="h-16 bg-gradient-to-r from-black to-gray-800 w-full max-w-md rounded-lg shadow-lg" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                    }}></div>
                  </div>
                  <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed bg-white p-3 rounded-lg border">
                    Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                  </p>
                </div>

                {/* QR Code PIX */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl border-2 border-green-200">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 border-2 border-gray-300 shadow-inner">
                      <QrCode className="w-20 h-20 text-gray-400" />
                    </div>
                    <p className="text-base font-bold mb-2 text-gray-800 flex items-center justify-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">📱</span>
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
    </div>
  );
};

export default InvoiceLayout;
