import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Download, Eye, Mail, Filter, Search } from 'lucide-react';

const FaturasEmitidas = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Faturas Emitidas</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Mensal</CardTitle>
            <CardDescription>Estatísticas das faturas emitidas em Março 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1.247</div>
                <div className="text-sm text-gray-600">Faturas Emitidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">R$ 387.5K</div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">R$ 310,8</div>
                <div className="text-sm text-gray-600">Valor Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">956</div>
                <div className="text-sm text-gray-600">Pagas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-green-600" />
                <span>Fatura #INV-2024-1001</span>
              </CardTitle>
              <CardDescription>Emitida em 01/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">João Silva</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-green-600">R$ 385,50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vencimento</span>
                  <span className="font-medium">15/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Paga
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-orange-600" />
                <span>Fatura #INV-2024-1002</span>
              </CardTitle>
              <CardDescription>Emitida em 01/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Maria Santos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-orange-600">R$ 492,30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vencimento</span>
                  <span className="font-medium">15/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Vencida
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span>Fatura #INV-2024-1003</span>
              </CardTitle>
              <CardDescription>Emitida em 02/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Pedro Costa</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-blue-600">R$ 298,75</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vencimento</span>
                  <span className="font-medium">17/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Pendente
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-green-600" />
                <span>Fatura #INV-2024-1004</span>
              </CardTitle>
              <CardDescription>Emitida em 02/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Ana Oliveira</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-green-600">R$ 156,20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vencimento</span>
                  <span className="font-medium">17/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Paga
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span>Fatura #INV-2024-1005</span>
              </CardTitle>
              <CardDescription>Emitida em 03/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Carlos Ferreira</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-blue-600">R$ 567,80</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vencimento</span>
                  <span className="font-medium">18/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Pendente
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-green-600" />
                <span>Fatura #INV-2024-1006</span>
              </CardTitle>
              <CardDescription>Emitida em 03/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Lucia Gonçalves</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-green-600">R$ 234,60</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vencimento</span>
                  <span className="font-medium">18/03/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Paga
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturas por Status</CardTitle>
            <CardDescription>Distribuição das faturas por situação de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">291</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">956</div>
                <div className="text-sm text-gray-600">Pagas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">47</div>
                <div className="text-sm text-gray-600">Vencidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-sm text-gray-600">Canceladas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">76.7%</div>
                <div className="text-sm text-gray-600">Taxa de Pagamento</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FaturasEmitidas;
