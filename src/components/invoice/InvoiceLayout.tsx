
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Download, Award, TrendingUp, Zap, Star, Sparkles, User, FileText, Building2, Phone, Globe, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Enhanced action button */}
        <div className="mb-8 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-2xl border-0 px-8 py-4 text-lg font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25"
          >
            <Download className="w-6 h-6 mr-3" />
            {isLayoutRoute ? 'Baixar Modelo PDF' : 'Baixar PDF Completo'}
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Enhanced invoice container */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-gray-100 relative" style={{ width: '210mm', minHeight: '297mm', fontSize: '10pt' }}>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/30 to-transparent rounded-full -ml-24 -mb-24 pointer-events-none"></div>
          
          {/* Premium header with enhanced styling */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 text-white overflow-hidden" style={{ 
            borderBottomLeftRadius: '100px',
            borderBottomRightRadius: '100px',
            padding: '3rem 3rem 4rem 3rem'
          }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-[0.08] rounded-full -mr-20 -mt-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-[0.06] rounded-full -ml-16 -mb-16 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white opacity-[0.04] rounded-full -ml-12 -mt-12 animate-pulse delay-500"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex items-baseline">
                  <h1 className="text-7xl font-black mr-4 tracking-tight drop-shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>energy</h1>
                  <h2 className="text-5xl font-light tracking-wider opacity-95">PAY</h2>
                </div>
                <div className="ml-4 w-3 h-16 bg-white rounded-full opacity-80"></div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-4">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/20">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold drop-shadow">(62) 3140-7070</span>
                </div>
                <div className="flex items-center justify-end mb-5">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/20">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-wide drop-shadow">energypay.me</span>
                </div>
                <div className="text-sm leading-relaxed space-y-1 bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white/20 shadow-lg">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 opacity-80" />
                    <p className="font-semibold">Av. Antônio Fidelis, 205</p>
                  </div>
                  <p className="ml-6 opacity-90">Parque Amazônia - 74840-090</p>
                  <p className="ml-6 opacity-90">Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-8">
            {/* Enhanced client and invoice section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Premium client data card */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl p-8 border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 tracking-wide">DADOS DO CLIENTE</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                      <p className="text-slate-600 text-xs mb-2 font-semibold uppercase tracking-wide">Cliente</p>
                      <p className="font-bold text-slate-800 text-base">{data.cliente.nome}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
                      <p className="text-slate-600 text-xs mb-2 font-semibold uppercase tracking-wide">CPF</p>
                      <p className="font-bold text-slate-800 text-base">{data.cliente.documento}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                      <p className="text-slate-600 text-xs mb-2 font-semibold uppercase tracking-wide">Endereço</p>
                      <p className="font-semibold text-slate-800">{data.cliente.endereco}</p>
                      <p className="text-slate-700 mt-1">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                      <p className="text-slate-700">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                    </div>
                  </div>
                  <Separator className="my-6 bg-slate-200" />
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="text-slate-600 font-medium">Data de emissão:</span>
                      <span className="font-bold text-slate-800">{data.detalhes.dataEmissao}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="text-slate-600 font-medium">Nº da Instalação:</span>
                      <span className="font-bold text-slate-800">1000052091б</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="text-slate-600 font-medium">Classe:</span>
                      <span className="font-bold text-slate-800">Residencial Trifásico</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium invoice details card */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 tracking-wide">DETALHES DA FATURA</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border-l-4 border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Nº DA FATURA</p>
                      <p className="text-2xl font-black text-slate-800">{data.numero}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">VENCIMENTO</p>
                      <p className="text-2xl font-black text-red-600">{data.vencimento}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">REFERÊNCIA</p>
                      <p className="text-2xl font-black text-blue-600">{data.detalhes.referencia}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">VALOR A PAGAR</p>
                      <p className="text-2xl font-black text-green-700">{formatCurrency(data.valor)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium economy showcase */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-8 rounded-3xl border-3 border-emerald-200 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full flex items-center justify-center mr-6 shadow-2xl">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-wide">Economia com a Energy Pay</h2>
                    <div className="flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      <p className="text-emerald-700 font-bold text-lg">Energia solar inteligente</p>
                      <Star className="w-5 h-5 text-yellow-500 ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl border-3 border-emerald-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-emerald-600 mr-4" />
                        <span className="text-base font-black text-slate-700 tracking-wide">ECONOMIA NO MÊS</span>
                      </div>
                      <span className="text-3xl font-black text-emerald-600">{formatCurrency(data.economiaTotal)}</span>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border-3 border-teal-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Zap className="w-8 h-8 text-teal-600 mr-4" />
                        <span className="text-base font-black text-slate-700 tracking-wide">ECONOMIA ACUMULADA</span>
                      </div>
                      <span className="text-3xl font-black text-teal-600">R$ 7.474,01</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced history chart */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-6">
                <h3 className="text-center font-black text-xl flex items-center justify-center tracking-wide">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  HISTÓRICO DE ECONOMIA
                  <Sparkles className="w-6 h-6 ml-3" />
                </h3>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {data.historico.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center group hover:bg-slate-50 p-4 rounded-xl transition-all duration-300">
                      <span className="text-base font-bold text-slate-600 w-24 text-right mr-6">{item.mes}</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-10 relative overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 h-10 rounded-full flex items-center justify-end pr-4 shadow-lg transition-all duration-700 group-hover:from-emerald-600 group-hover:to-teal-600" 
                          style={{ width: `${Math.max(30, (item.valor / 2500) * 100)}%` }}
                        >
                          <span className="text-sm font-black text-white drop-shadow-lg">{formatCurrency(item.valor)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between text-sm text-slate-500 px-28 font-medium">
                  <span>0</span>
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                  <span className="font-bold">R$</span>
                </div>
              </div>
            </div>

            {/* Enhanced invoice table */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-6">
                <h3 className="text-center font-black text-xl tracking-wide">FATURA ENERGY PAY</h3>
              </div>
              <div className="p-8">
                <div className="overflow-hidden rounded-xl border-2 border-slate-100">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
                        <th className="text-left py-4 px-6 font-black text-slate-700 tracking-wide">DESCRIÇÃO</th>
                        <th className="text-center py-4 px-6 font-black text-slate-700 tracking-wide">QUANTIDADE</th>
                        <th className="text-center py-4 px-6 font-black text-slate-700 tracking-wide">VALOR A PAGAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-medium">Energia elétrica compensada</td>
                        <td className="text-center py-4 px-6 font-bold">8.458 kWh</td>
                        <td className="text-center py-4 px-6 font-black text-emerald-600 text-lg">{formatCurrency(data.valor)}</td>
                      </tr>
                      <tr className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-medium">Desconto ajuste de tarifas</td>
                        <td className="text-center py-4 px-6">-</td>
                        <td className="text-center py-4 px-6 font-bold text-slate-600">-R$ 0,00</td>
                      </tr>
                      <tr className="bg-gradient-to-r from-emerald-50 to-green-50 border-t-4 border-emerald-400">
                        <td className="py-4 px-6 font-black text-emerald-700 text-lg">Total:</td>
                        <td className="text-center py-4 px-6"></td>
                        <td className="text-center py-4 px-6 font-black text-emerald-700 text-2xl">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Premium economics demonstration */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
                <h3 className="text-center font-black text-xl tracking-wide">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Without Energy Pay section */}
                <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-2xl p-6 border-3 border-red-200 shadow-lg">
                  <h4 className="text-lg font-black text-red-700 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm mr-4">❌</span>
                    VALOR TOTAL DA ENERGIA SEM A ENERGY PAY
                  </h4>
                  <div className="overflow-hidden rounded-xl border-2 border-red-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-100 to-red-200">
                          <th className="text-left py-4 px-4 font-bold text-slate-700">DESCRIÇÃO</th>
                          <th className="text-center py-4 px-4 font-bold text-slate-700">QUANTIDADE</th>
                          <th className="text-center py-4 px-4 font-bold text-slate-700">TARIFA</th>
                          <th className="text-center py-4 px-4 font-bold text-slate-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-red-200 hover:bg-red-50 transition-colors">
                          <td className="py-3 px-4">Energia elétrica</td>
                          <td className="text-center py-3 px-4">8.558 kWh</td>
                          <td className="text-center py-3 px-4">R$ 1,01262100</td>
                          <td className="text-center py-3 px-4 font-bold">R$ 8.666,01</td>
                        </tr>
                        <tr className="bg-gradient-to-r from-red-100 to-red-200 border-t-2 border-red-400">
                          <td className="py-3 px-4 font-bold text-red-700">Total:</td>
                          <td className="text-center py-3 px-4"></td>
                          <td className="text-center py-3 px-4"></td>
                          <td className="text-center py-3 px-4 font-bold text-red-700 text-lg">R$ 8.666,01</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* With Energy Pay section */}
                <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-2xl p-6 border-3 border-emerald-200 shadow-lg">
                  <h4 className="text-lg font-black text-emerald-700 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm mr-4">✅</span>
                    VALOR TOTAL DA ENERGIA COM A ENERGY PAY
                  </h4>
                  <div className="overflow-hidden rounded-xl border-2 border-emerald-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-emerald-100 to-green-200">
                          <th className="text-left py-4 px-4 font-bold text-slate-700">DESCRIÇÃO</th>
                          <th className="text-center py-4 px-4 font-bold text-slate-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-emerald-200 hover:bg-emerald-50 transition-colors">
                          <td className="py-3 px-4">Energia elétrica não compensada</td>
                          <td className="text-center py-3 px-4">R$ 101,26</td>
                        </tr>
                        <tr className="border-b border-emerald-200 hover:bg-emerald-50 transition-colors">
                          <td className="py-3 px-4">Ajuste de tarifas</td>
                          <td className="text-center py-3 px-4">R$ 0,00</td>
                        </tr>
                        <tr className="border-b border-emerald-200 hover:bg-emerald-50 transition-colors">
                          <td className="py-3 px-4">Fatura ENERGY PAY</td>
                          <td className="text-center py-3 px-4 font-bold">{formatCurrency(data.valor)}</td>
                        </tr>
                        <tr className="bg-gradient-to-r from-emerald-100 to-green-200 border-t-2 border-emerald-400">
                          <td className="py-3 px-4 font-bold text-emerald-700">Total:</td>
                          <td className="text-center py-3 px-4 font-bold text-emerald-700 text-lg">R$ 6.385,90</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Premium savings summary */}
                <div className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 rounded-2xl p-8 border-3 border-emerald-400 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/40 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black text-emerald-700 mb-6 text-center flex items-center justify-center">
                      <Award className="w-8 h-8 mr-3" />
                      RESUMO DA ECONOMIA
                      <Sparkles className="w-8 h-8 ml-3" />
                    </h4>
                    <div className="space-y-4 text-lg">
                      <div className="flex justify-between items-center py-3 bg-white rounded-xl px-6 shadow-md border border-slate-100">
                        <span className="text-slate-700 font-medium">Valor <span className="font-black text-red-600">SEM</span> Energy Pay:</span>
                        <span className="font-black text-red-600 text-xl">R$ 8.666,01</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-white rounded-xl px-6 shadow-md border border-slate-100">
                        <span className="text-slate-700 font-medium">Valor <span className="font-black text-emerald-600">COM</span> Energy Pay:</span>
                        <span className="font-black text-emerald-600 text-xl">R$ 6.385,90</span>
                      </div>
                      <Separator className="my-4 bg-emerald-300" />
                      <div className="bg-gradient-to-r from-white via-emerald-50 to-white rounded-2xl p-6 border-3 border-emerald-500 shadow-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-black text-emerald-700 flex items-center">
                            <span className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-lg mr-4 shadow-lg">💰</span>
                            Economia Total:
                          </span>
                          <span className="text-3xl font-black text-emerald-600">{formatCurrency(data.economiaTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium payment information */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 rounded-2xl border-3 border-blue-200 mb-8 shadow-lg">
                  <p className="text-xl font-black text-blue-700 flex items-center justify-center">
                    <span className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg mr-4 shadow-lg">
                      <Building2 className="w-6 h-6" />
                    </span>
                    RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                  </p>
                  <p className="text-base text-blue-600 mt-3 font-bold">CNPJ: 14.375.534/0001-07</p>
                </div>
                
                {/* Enhanced barcode section */}
                <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 rounded-2xl border-3 border-slate-200 mb-8 shadow-xl">
                  <div className="font-mono text-lg font-bold mb-6 tracking-wider text-center text-slate-700">
                    {data.codigoBarras}
                  </div>
                  <div className="flex justify-center mb-6">
                    <div className="h-20 bg-gradient-to-r from-black to-slate-800 w-full max-w-lg rounded-lg shadow-2xl" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)`
                    }}></div>
                  </div>
                  <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed bg-white p-4 rounded-xl border-2 border-slate-100 shadow-md">
                    Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                  </p>
                </div>

                {/* Enhanced QR Code PIX */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-white via-emerald-50 to-white p-8 rounded-3xl shadow-2xl border-3 border-emerald-200">
                    <div className="w-40 h-40 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 border-3 border-slate-300 shadow-xl">
                      <QrCode className="w-24 h-24 text-slate-400" />
                    </div>
                    <p className="text-xl font-black mb-3 text-slate-800 flex items-center justify-center">
                      <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm mr-3 shadow-lg">📱</span>
                      Pague via PIX
                    </p>
                    <p className="text-3xl font-black text-emerald-600">{formatCurrency(data.valor)}</p>
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
