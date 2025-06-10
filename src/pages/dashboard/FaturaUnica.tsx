
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Calendar, DollarSign, Download, Eye } from 'lucide-react';

const FaturaUnica = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Fatura Única</h1>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Gerar Nova Fatura
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerar Fatura Consolidada</CardTitle>
            <CardDescription>
              Crie uma fatura única consolidando todos os assinantes para o período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Março 2024</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assinantes</label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">1.247 assinantes</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Total</label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-bold text-green-600">R$ 48.500,00</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              Gerar Fatura Consolidada
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Fatura Janeiro 2024</span>
              </CardTitle>
              <CardDescription>Fatura consolidada do mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">01/01 - 31/01/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assinantes</span>
                  <span className="font-medium">1.189</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor Total</span>
                  <span className="font-bold text-green-600">R$ 45.230,00</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Fatura Fevereiro 2024</span>
              </CardTitle>
              <CardDescription>Fatura consolidada do mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">01/02 - 29/02/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assinantes</span>
                  <span className="font-medium">1.198</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor Total</span>
                  <span className="font-bold text-green-600">R$ 42.780,00</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Fatura Março 2024</span>
              </CardTitle>
              <CardDescription>Em processamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">01/03 - 31/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assinantes</span>
                  <span className="font-medium">1.247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor Estimado</span>
                  <span className="font-bold text-blue-600">R$ 48.500,00</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Processando... 75%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>Resumo das faturas consolidadas geradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">36</div>
                <div className="text-sm text-gray-600">Faturas Geradas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">R$ 1.6M</div>
                <div className="text-sm text-gray-600">Valor Total Faturado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">R$ 44.5K</div>
                <div className="text-sm text-gray-600">Valor Médio/Fatura</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1.211</div>
                <div className="text-sm text-gray-600">Assinantes Médios</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FaturaUnica;
