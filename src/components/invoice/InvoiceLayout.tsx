
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { QrCode, Zap, DollarSign, Calendar, User, FileText, TrendingDown } from 'lucide-react';

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
  economiaTotal: string;
  pixCode: string;
}

const mockInvoiceData: InvoiceData = {
  numero: "2025088853",
  vencimento: "30/05/2025",
  valor: 758.40,
  cliente: {
    nome: "Laura Ritini Canesio Silva",
    documento: "33.386.705/0001-13",
    endereco: "Avenida Berlim",
    cidade: "Goiânia",
    uf: "GO",
    cep: "74000-000"
  },
  consumo: {
    energiaConvencional: { quantidade: 1, valorUnit: 948.01, total: 948.01 },
    descontoTarifa: { quantidade: 1, valorUnit: -94.00, total: -94.00 },
    economiaMes: { quantidade: 1, valorUnit: -189.61, total: -189.61 }
  },
  detalhes: {
    numeroFatura: "2025088853",
    referencia: "MAI/2025",
    dataEmissao: "15/05/2025",
    dataVencimento: "30/05/2025"
  },
  historico: [
    { mes: "JAN/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "FEV/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "MAR/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "ABR/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "MAI/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 },
    { mes: "JUN/25", valor: 948.01, semEnergyPay: 948.01, comEnergyPay: 758.40 }
  ],
  economiaTotal: "20%",
  pixCode: "00020101021126580014br.gov.bcb.pix2536pix.lovable.dev/qr/v2/cobv/9d3d2f1a-4b8e-4c7d-8f2e-1a2b3c4d5e6f5204000053039865802BR5925Energy Pay Energia Solar6009SAO PAULO62070503***6304D2A4"
};

const InvoiceLayout: React.FC = () => {
  const data = mockInvoiceData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">energyPAY</h1>
                  <p className="text-sm text-gray-600">Energia Solar Inteligente</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">CNPJ: 14.375.534/0001-27</p>
                <p className="text-sm text-gray-600">contato@energypay.com.br</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">FATURA DE ENERGIA SOLAR</h2>
                  <p className="text-green-100">VENCIMENTO: {data.vencimento}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatCurrency(data.valor)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Cliente */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">DADOS DO CLIENTE</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cliente</p>
                    <p className="font-medium text-gray-900">{data.cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CNPJ</p>
                    <p className="font-medium text-gray-900">{data.cliente.documento}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Endereço</p>
                    <p className="font-medium text-gray-900">
                      {data.cliente.endereco}, {data.cliente.cidade} - {data.cliente.uf}, {data.cliente.cep}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demonstrativo de Consumo */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">DEMONSTRATIVO DE CONSUMO</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Descrição</th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">Qtd</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600">Valor Unit.</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-3 text-gray-900">Energia elétrica convencional</td>
                        <td className="py-3 text-center text-gray-900">{data.consumo.energiaConvencional.quantidade}</td>
                        <td className="py-3 text-right text-gray-900">{formatCurrency(data.consumo.energiaConvencional.valorUnit)}</td>
                        <td className="py-3 text-right text-gray-900">{formatCurrency(data.consumo.energiaConvencional.total)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-900">Desconto sobre da tarifa</td>
                        <td className="py-3 text-center text-gray-900">{data.consumo.descontoTarifa.quantidade}</td>
                        <td className="py-3 text-right text-gray-900">{formatCurrency(data.consumo.descontoTarifa.valorUnit)}</td>
                        <td className="py-3 text-right text-red-600">{formatCurrency(data.consumo.descontoTarifa.total)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-900">Economia do mês</td>
                        <td className="py-3 text-center text-gray-900">{data.consumo.economiaMes.quantidade}</td>
                        <td className="py-3 text-right text-gray-900">{formatCurrency(data.consumo.economiaMes.valorUnit)}</td>
                        <td className="py-3 text-right text-red-600">{formatCurrency(data.consumo.economiaMes.total)}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300">
                        <td className="py-3 font-semibold text-gray-900" colSpan={3}>Total</td>
                        <td className="py-3 text-right font-bold text-green-600 text-lg">{formatCurrency(data.valor)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-semibold">ECONOMIA TOTAL</span>
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">{data.economiaTotal}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes da Fatura */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">DETALHES DA FATURA</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nº da Fatura</p>
                    <p className="font-medium text-gray-900">{data.detalhes.numeroFatura}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Referência</p>
                    <p className="font-medium text-gray-900">{data.detalhes.referencia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Data de Emissão</p>
                    <p className="font-medium text-gray-900">{data.detalhes.dataEmissao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vencimento</p>
                    <p className="font-medium text-gray-900">{data.detalhes.dataVencimento}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Economia */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">HISTÓRICO DE ECONOMIA</h3>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {data.historico.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-green-600 text-white rounded-lg p-3 mb-2">
                        <div className="h-16 flex items-end justify-center">
                          <div 
                            className="bg-white bg-opacity-30 rounded-sm w-full"
                            style={{ height: `${(item.comEnergyPay / item.semEnergyPay) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-900">{item.mes}</p>
                      <p className="text-xs text-gray-600">{formatCurrency(item.comEnergyPay)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Valor SEM Energy Pay</p>
                    <p className="font-bold text-lg text-gray-900">{formatCurrency(948.01)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor COM Energy Pay</p>
                    <p className="font-bold text-lg text-green-600">{formatCurrency(data.valor)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Pagamento via PIX */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">PAGAMENTO VIA PIX</h3>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-3">Pague esta fatura usando PIX</p>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-gray-700">Abra o app do seu banco</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-gray-700">Escolha pagamento via PIX</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-gray-700">Escaneie o QR Code ou use o código</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Chave PIX e Código</p>
                  <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-2 rounded">
                    {data.pixCode.substring(0, 50)}...
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Valor</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(data.valor)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                Energy Pay - Energia Solar Inteligente | CNPJ: 14.375.534/0001-27
              </p>
              <p>
                Você acabou de receber esta fatura por pertencer à nossa lista bancária. Internet banking
                Para saber de dúvidas, entre em contato pelo telefone (62) 3749-7878 ou acesse energypay.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceLayout;
