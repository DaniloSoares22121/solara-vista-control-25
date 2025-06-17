
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
        title: "Gerando PDF Premium...",
        description: "Processando fatura com design otimizado.",
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
        link.download = `fatura-premium-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "PDF Premium baixado!",
          description: "Fatura com design otimizado foi baixada.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Premium action button */}
        <div className="mb-8 flex justify-end print:hidden">
          <Button 
            onClick={handleGenerateAndSavePDF}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl border-0 px-10 py-5 text-xl font-black transform transition-all duration-500 hover:scale-110 hover:shadow-purple-500/30 rounded-2xl"
          >
            <Download className="w-7 h-7 mr-4" />
            {isLayoutRoute ? 'Baixar PDF Premium' : 'Gerar PDF Completo'}
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>
        </div>

        {/* Ultra-premium invoice container */}
        <div id="invoice-layout" ref={invoiceRef} className="bg-white shadow-[0_35px_60px_-12px_rgba(0,0,0,0.25)] rounded-[2rem] overflow-hidden border-4 border-gray-100/50 relative backdrop-blur-sm" style={{ width: '210mm', minHeight: '297mm', fontSize: '11pt', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          
          {/* Sophisticated decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/40 via-purple-100/30 to-transparent rounded-full -mr-40 -mt-40 pointer-events-none blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100/40 via-cyan-100/30 to-transparent rounded-full -ml-32 -mb-32 pointer-events-none blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-violet-50/20 to-fuchsia-50/20 rounded-full -ml-48 -mt-48 pointer-events-none blur-3xl"></div>
          
          {/* Ultra-premium header with refined styling */}
          <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden" style={{ 
            borderBottomLeftRadius: '120px',
            borderBottomRightRadius: '120px',
            padding: '4rem 4rem 5rem 4rem'
          }}>
            {/* Sophisticated background patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/5 to-transparent rounded-full -mr-24 -mt-24 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-300/10 to-transparent rounded-full -ml-20 -mb-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-purple-300/5 to-transparent rounded-full -ml-16 -mt-16 animate-pulse delay-500"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex items-baseline">
                  <h1 className="text-8xl font-black mr-5 tracking-tight drop-shadow-2xl" style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>energy</h1>
                  <h2 className="text-6xl font-light tracking-[0.2em] opacity-95 drop-shadow-xl">PAY</h2>
                </div>
                <div className="ml-6 w-4 h-20 bg-gradient-to-b from-white via-indigo-200 to-purple-200 rounded-full opacity-90 shadow-lg"></div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-indigo-200/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-md border border-white/30 shadow-xl">
                    <Phone className="w-7 h-7 text-white drop-shadow" />
                  </div>
                  <span className="text-2xl font-bold drop-shadow-lg tracking-wide">(62) 3140-7070</span>
                </div>
                <div className="flex items-center justify-end mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-purple-200/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-md border border-white/30 shadow-xl">
                    <Globe className="w-7 h-7 text-white drop-shadow" />
                  </div>
                  <span className="text-2xl font-bold tracking-wide drop-shadow-lg">energypay.me</span>
                </div>
                <div className="text-sm leading-relaxed space-y-2 bg-gradient-to-br from-white/15 via-indigo-100/10 to-purple-100/15 rounded-2xl p-6 backdrop-blur-md border border-white/30 shadow-2xl">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 opacity-90" />
                    <p className="font-bold text-lg">Av. Antônio Fidelis, 205</p>
                  </div>
                  <p className="ml-8 opacity-95 text-base">Parque Amazônia - 74840-090</p>
                  <p className="ml-8 opacity-95 text-base font-medium">Goiânia - GO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-10">
            {/* Ultra-enhanced client and invoice section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Premium client data card */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/50 rounded-3xl p-10 border-3 border-slate-200/50 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -mr-20 -mt-20 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-5 shadow-2xl">
                      <User className="w-9 h-9 text-white drop-shadow" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-wide">DADOS DO CLIENTE</h3>
                  </div>
                  <div className="space-y-6 text-base">
                    <div className="bg-white rounded-2xl p-6 border-l-6 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-slate-600 text-sm mb-3 font-bold uppercase tracking-wider">Cliente</p>
                      <p className="font-black text-slate-800 text-xl">{data.cliente.nome}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border-l-6 border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-slate-600 text-sm mb-3 font-bold uppercase tracking-wider">CPF</p>
                      <p className="font-black text-slate-800 text-xl font-mono">{data.cliente.documento}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border-l-6 border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <p className="text-slate-600 text-sm mb-3 font-bold uppercase tracking-wider">Endereço</p>
                      <p className="font-bold text-slate-800 text-lg">{data.cliente.endereco}</p>
                      <p className="text-slate-700 mt-2 leading-relaxed">99999 Q. 18, L. 17, CASA - 02 PARQUE DAS LARANJEIRAS</p>
                      <p className="text-slate-700 font-medium">{data.cliente.cep} {data.cliente.cidade} {data.cliente.uf}</p>
                    </div>
                  </div>
                  <Separator className="my-8 bg-slate-300" />
                  <div className="grid grid-cols-1 gap-5 text-base">
                    <div className="flex justify-between items-center bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-md border border-slate-100">
                      <span className="text-slate-600 font-bold flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-slate-500" />
                        Data de emissão:
                      </span>
                      <span className="font-black text-slate-800 text-lg">{data.detalhes.dataEmissao}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-md border border-slate-100">
                      <span className="text-slate-600 font-bold flex items-center">
                        <Hash className="w-5 h-5 mr-3 text-slate-500" />
                        Nº da Instalação:
                      </span>
                      <span className="font-black text-slate-800 text-lg font-mono">1000052091б</span>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-md border border-slate-100">
                      <span className="text-slate-600 font-bold flex items-center">
                        <Building2 className="w-5 h-5 mr-3 text-slate-500" />
                        Classe:
                      </span>
                      <span className="font-black text-slate-800 text-lg">Residencial Trifásico</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ultra-premium invoice details card */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50/50 rounded-3xl p-10 border-3 border-emerald-200/50 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full -mr-20 -mt-20 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-5 shadow-2xl">
                      <FileText className="w-9 h-9 text-white drop-shadow" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-wide">DETALHES DA FATURA</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border-l-6 border-emerald-500 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                      <p className="text-xs font-black text-slate-600 mb-3 uppercase tracking-wider flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Nº DA FATURA
                      </p>
                      <p className="text-3xl font-black text-slate-800">{data.numero}</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border-l-6 border-red-500 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(239,68,68,0.25)] transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                      <p className="text-xs font-black text-slate-600 mb-3 uppercase tracking-wider flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        VENCIMENTO
                      </p>
                      <p className="text-3xl font-black text-red-600">{data.vencimento}</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border-l-6 border-blue-500 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)] transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                      <p className="text-xs font-black text-slate-600 mb-3 uppercase tracking-wider flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        REFERÊNCIA
                      </p>
                      <p className="text-3xl font-black text-blue-600">{data.detalhes.referencia}</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border-l-6 border-green-500 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(34,197,94,0.25)] transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                      <p className="text-xs font-black text-slate-600 mb-3 uppercase tracking-wider flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        VALOR A PAGAR
                      </p>
                      <p className="text-3xl font-black text-green-700">{formatCurrency(data.valor)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ultra-premium economy showcase */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-12 rounded-[2rem] border-4 border-emerald-200/60 shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full -mr-32 -mt-32 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full -ml-24 -mb-24 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-full flex items-center justify-center mr-8 shadow-[0_20px_25px_-5px_rgba(16,185,129,0.4)]">
                    <Award className="w-12 h-12 text-white drop-shadow" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-wide">Economia com a Energy Pay</h2>
                    <div className="flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-500 mr-2" />
                      <p className="text-emerald-700 font-black text-2xl">Energia solar inteligente</p>
                      <Star className="w-6 h-6 text-yellow-500 ml-2" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-3xl border-4 border-emerald-300/60 shadow-[0_20px_25px_-5px_rgba(16,185,129,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-3 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="w-10 h-10 text-emerald-600 mr-5" />
                        <span className="text-xl font-black text-slate-700 tracking-wide">ECONOMIA NO MÊS</span>
                      </div>
                      <span className="text-4xl font-black text-emerald-600">{formatCurrency(data.economiaTotal)}</span>
                    </div>
                  </div>
                  <div className="bg-white p-10 rounded-3xl border-4 border-teal-300/60 shadow-[0_20px_25px_-5px_rgba(20,184,166,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(20,184,166,0.4)] transition-all duration-500 hover:-translate-y-3 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Zap className="w-10 h-10 text-teal-600 mr-5" />
                        <span className="text-xl font-black text-slate-700 tracking-wide">ECONOMIA ACUMULADA</span>
                      </div>
                      <span className="text-4xl font-black text-teal-600">R$ 7.474,01</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ultra-enhanced history chart */}
            <div className="bg-white rounded-[2rem] border-3 border-slate-200/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white p-8">
                <h3 className="text-center font-black text-3xl flex items-center justify-center tracking-wide">
                  <TrendingUp className="w-8 h-8 mr-4" />
                  HISTÓRICO DE ECONOMIA
                  <Sparkles className="w-8 h-8 ml-4" />
                </h3>
              </div>
              <div className="p-12">
                <div className="space-y-8">
                  {data.historico.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center group hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 p-6 rounded-2xl transition-all duration-500 shadow-sm hover:shadow-lg">
                      <span className="text-xl font-black text-slate-600 w-32 text-right mr-8 font-mono">{item.mes}</span>
                      <div className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full h-12 relative overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 h-12 rounded-full flex items-center justify-end pr-6 shadow-xl transition-all duration-1000 group-hover:from-emerald-600 group-hover:to-teal-600" 
                          style={{ width: `${Math.max(35, (item.valor / 2500) * 100)}%` }}
                        >
                          <span className="text-lg font-black text-white drop-shadow-lg">{formatCurrency(item.valor)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 flex justify-between text-lg text-slate-500 px-36 font-bold">
                  <span>0</span>
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                  <span className="font-black text-slate-700">R$</span>
                </div>
              </div>
            </div>

            {/* Ultra-enhanced invoice table */}
            <div className="bg-white rounded-[2rem] border-3 border-slate-200/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white p-8">
                <h3 className="text-center font-black text-3xl tracking-wide">FATURA ENERGY PAY</h3>
              </div>
              <div className="p-12">
                <div className="overflow-hidden rounded-2xl border-3 border-slate-100/60 shadow-inner">
                  <table className="w-full text-lg">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100">
                        <th className="text-left py-6 px-8 font-black text-slate-700 tracking-wide text-xl">DESCRIÇÃO</th>
                        <th className="text-center py-6 px-8 font-black text-slate-700 tracking-wide text-xl">QUANTIDADE</th>
                        <th className="text-center py-6 px-8 font-black text-slate-700 tracking-wide text-xl">VALOR A PAGAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b-3 border-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-300">
                        <td className="py-6 px-8 font-bold text-lg">Energia elétrica compensada</td>
                        <td className="text-center py-6 px-8 font-black text-xl">8.458 kWh</td>
                        <td className="text-center py-6 px-8 font-black text-emerald-600 text-2xl">{formatCurrency(data.valor)}</td>
                      </tr>
                      <tr className="border-b-3 border-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-300">
                        <td className="py-6 px-8 font-bold text-lg">Desconto ajuste de tarifas</td>
                        <td className="text-center py-6 px-8 text-xl">-</td>
                        <td className="text-center py-6 px-8 font-black text-slate-600 text-xl">-R$ 0,00</td>
                      </tr>
                      <tr className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-t-6 border-emerald-400">
                        <td className="py-6 px-8 font-black text-emerald-700 text-2xl">Total:</td>
                        <td className="text-center py-6 px-8"></td>
                        <td className="text-center py-6 px-8 font-black text-emerald-700 text-3xl">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Ultra-premium economics demonstration */}
            <div className="bg-white rounded-[2rem] border-3 border-slate-200/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
                <h3 className="text-center font-black text-3xl tracking-wide">DEMONSTRATIVO DE ECONOMIA</h3>
              </div>
              
              <div className="p-12 space-y-12">
                {/* Without Energy Pay section */}
                <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-3xl p-10 border-4 border-red-200/60 shadow-[0_20px_25px_-5px_rgba(239,68,68,0.1)]">
                  <h4 className="text-2xl font-black text-red-700 mb-8 flex items-center">
                    <span className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl mr-6 shadow-lg">❌</span>
                    VALOR TOTAL DA ENERGIA SEM A ENERGY PAY
                  </h4>
                  <div className="overflow-hidden rounded-2xl border-3 border-red-100/60 shadow-inner">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-100 via-red-200 to-red-100">
                          <th className="text-left py-6 px-6 font-black text-slate-700">DESCRIÇÃO</th>
                          <th className="text-center py-6 px-6 font-black text-slate-700">QUANTIDADE</th>
                          <th className="text-center py-6 px-6 font-black text-slate-700">TARIFA</th>
                          <th className="text-center py-6 px-6 font-black text-slate-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b-2 border-red-200 hover:bg-red-50 transition-colors">
                          <td className="py-5 px-6 font-bold">Energia elétrica</td>
                          <td className="text-center py-5 px-6 font-bold">8.558 kWh</td>
                          <td className="text-center py-5 px-6 font-mono">R$ 1,01262100</td>
                          <td className="text-center py-5 px-6 font-black text-xl">R$ 8.666,01</td>
                        </tr>
                        <tr className="bg-gradient-to-r from-red-100 via-red-200 to-red-100 border-t-4 border-red-400">
                          <td className="py-5 px-6 font-black text-red-700 text-xl">Total:</td>
                          <td className="text-center py-5 px-6"></td>
                          <td className="text-center py-5 px-6"></td>
                          <td className="text-center py-5 px-6 font-black text-red-700 text-2xl">R$ 8.666,01</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* With Energy Pay section */}
                <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-3xl p-10 border-4 border-emerald-200/60 shadow-[0_20px_25px_-5px_rgba(16,185,129,0.1)]">
                  <h4 className="text-2xl font-black text-emerald-700 mb-8 flex items-center">
                    <span className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl mr-6 shadow-lg">✅</span>
                    VALOR TOTAL DA ENERGIA COM A ENERGY PAY
                  </h4>
                  <div className="overflow-hidden rounded-2xl border-3 border-emerald-100/60 shadow-inner">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-emerald-100 via-green-200 to-emerald-100">
                          <th className="text-left py-6 px-6 font-black text-slate-700">DESCRIÇÃO</th>
                          <th className="text-center py-6 px-6 font-black text-slate-700">VALOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b-2 border-emerald-200 hover:bg-emerald-50 transition-colors">
                          <td className="py-5 px-6 font-bold">Energia elétrica não compensada</td>
                          <td className="text-center py-5 px-6 font-bold text-xl">R$ 101,26</td>
                        </tr>
                        <tr className="border-b-2 border-emerald-200 hover:bg-emerald-50 transition-colors">
                          <td className="py-5 px-6 font-bold">Ajuste de tarifas</td>
                          <td className="text-center py-5 px-6 font-bold text-xl">R$ 0,00</td>
                        </tr>
                        <tr className="border-b-2 border-emerald-200 hover:bg-emerald-50 transition-colors">
                          <td className="py-5 px-6 font-bold">Fatura ENERGY PAY</td>
                          <td className="text-center py-5 px-6 font-black text-xl">{formatCurrency(data.valor)}</td>
                        </tr>
                        <tr className="bg-gradient-to-r from-emerald-100 via-green-200 to-emerald-100 border-t-4 border-emerald-400">
                          <td className="py-5 px-6 font-black text-emerald-700 text-xl">Total:</td>
                          <td className="text-center py-5 px-6 font-black text-emerald-700 text-2xl">R$ 6.385,90</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ultra-premium savings summary */}
                <div className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 rounded-3xl p-12 border-4 border-emerald-400/60 shadow-[0_25px_50px_-12px_rgba(16,185,129,0.3)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-200/40 to-transparent rounded-full -mr-24 -mt-24 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-200/40 to-transparent rounded-full -ml-20 -mb-20 blur-xl"></div>
                  <div className="relative z-10">
                    <h4 className="text-3xl font-black text-emerald-700 mb-10 text-center flex items-center justify-center">
                      <Award className="w-10 h-10 mr-4" />
                      RESUMO DA ECONOMIA
                      <Sparkles className="w-10 h-10 ml-4" />
                    </h4>
                    <div className="space-y-6 text-xl">
                      <div className="flex justify-between items-center py-5 bg-white rounded-2xl px-8 shadow-lg border-2 border-slate-100">
                        <span className="text-slate-700 font-bold">Valor <span className="font-black text-red-600">SEM</span> Energy Pay:</span>
                        <span className="font-black text-red-600 text-2xl">R$ 8.666,01</span>
                      </div>
                      <div className="flex justify-between items-center py-5 bg-white rounded-2xl px-8 shadow-lg border-2 border-slate-100">
                        <span className="text-slate-700 font-bold">Valor <span className="font-black text-emerald-600">COM</span> Energy Pay:</span>
                        <span className="font-black text-emerald-600 text-2xl">R$ 6.385,90</span>
                      </div>
                      <Separator className="my-6 bg-emerald-300 h-1" />
                      <div className="bg-gradient-to-r from-white via-emerald-50 to-white rounded-3xl p-8 border-4 border-emerald-500/60 shadow-[0_20px_25px_-5px_rgba(16,185,129,0.2)]">
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-black text-emerald-700 flex items-center">
                            <span className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mr-6 shadow-2xl">💰</span>
                            Economia Total:
                          </span>
                          <span className="text-4xl font-black text-emerald-600">{formatCurrency(data.economiaTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ultra-premium payment information */}
            <div className="bg-white rounded-[2rem] border-3 border-slate-200/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="p-12 text-center">
                <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8 rounded-3xl border-4 border-blue-200/60 mb-12 shadow-[0_15px_35px_rgba(59,130,246,0.1)]">
                  <p className="text-2xl font-black text-blue-700 flex items-center justify-center">
                    <span className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl mr-6 shadow-2xl">
                      <Building2 className="w-8 h-8" />
                    </span>
                    RECEBEDOR: J7 EMPREENDIMENTOS E CONSULTORIA LTDA
                  </p>
                  <p className="text-xl text-blue-600 mt-4 font-black">CNPJ: 14.375.534/0001-07</p>
                </div>
                
                {/* Ultra-enhanced barcode section */}
                <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 p-12 rounded-3xl border-4 border-slate-200/60 mb-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
                  <div className="font-mono text-2xl font-black mb-8 tracking-wider text-center text-slate-700 bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-inner">
                    {data.codigoBarras}
                  </div>
                  <div className="flex justify-center mb-8">
                    <div className="h-24 bg-gradient-to-r from-black to-slate-800 w-full max-w-2xl rounded-lg shadow-[0_15px_35px_rgba(0,0,0,0.3)]" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, black 0, black 3px, white 3px, white 6px)`
                    }}></div>
                  </div>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed bg-white p-6 rounded-2xl border-3 border-slate-100 shadow-lg">
                    Pague via internet banking, app do seu banco, ou imprima e pague em qualquer banco ou casa lotérica.
                  </p>
                </div>

                {/* Ultra-enhanced QR Code PIX */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-white via-emerald-50 to-white p-12 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] border-4 border-emerald-200/60">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-8 border-4 border-slate-300/60 shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
                      <QrCode className="w-32 h-32 text-slate-400" />
                    </div>
                    <p className="text-3xl font-black mb-4 text-slate-800 flex items-center justify-center">
                      <span className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-2xl">📱</span>
                      Pague via PIX
                    </p>
                    <p className="text-4xl font-black text-emerald-600">{formatCurrency(data.valor)}</p>
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
