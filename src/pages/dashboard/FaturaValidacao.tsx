import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const FaturaValidacao = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Fatura em Validação</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-gray-600">Aguardando</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Com Pendências</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Aprovadas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-gray-600">Rejeitadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Fatura #FT-2024-001</span>
              </CardTitle>
              <CardDescription>Enviada em 15/03/2024</CardDescription>
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
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">Mar/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Aguardando Validação
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Aprovar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Fatura #FT-2024-002</span>
              </CardTitle>
              <CardDescription>Enviada em 14/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Maria Santos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-green-600">R$ 492,30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">Mar/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Com Pendências
                  </span>
                </div>
                <div className="p-2 bg-orange-50 rounded text-xs text-orange-700">
                  Divergência no consumo informado
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Corrigir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Fatura #FT-2024-003</span>
              </CardTitle>
              <CardDescription>Aprovada em 13/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Pedro Costa</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-green-600">R$ 298,75</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">Mar/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Aprovada
                  </span>
                </div>
                <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                  Aprovada por: Admin em 13/03/2024 às 14:30
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    Processada
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Fatura #FT-2024-004</span>
              </CardTitle>
              <CardDescription>Rejeitada em 12/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Ana Oliveira</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-red-600">R$ 156,20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">Mar/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Rejeitada
                  </span>
                </div>
                <div className="p-2 bg-red-50 rounded text-xs text-red-700">
                  Rejeitada: Dados incompletos na medição
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Reenviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Fatura #FT-2024-005</span>
              </CardTitle>
              <CardDescription>Enviada em 11/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente</span>
                  <span className="font-medium">Carlos Ferreira</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor</span>
                  <span className="font-bold text-green-600">R$ 567,80</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">Mar/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Aguardando Validação
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Aprovar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Fatura #FT-2024-006</span>
              </CardTitle>
              <CardDescription>Enviada em 10/03/2024</CardDescription>
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
                  <span className="text-sm text-gray-600">Período</span>
                  <span className="font-medium">Mar/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Com Pendências
                  </span>
                </div>
                <div className="p-2 bg-orange-50 rounded text-xs text-orange-700">
                  Valor fora da média histórica do cliente
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Corrigir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FaturaValidacao;
