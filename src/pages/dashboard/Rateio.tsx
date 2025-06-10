
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Plus, DollarSign, Percent, Users, Zap } from 'lucide-react';

const Rateio = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Rateio</h1>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Rateio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <span>Rateio Janeiro 2024</span>
              </CardTitle>
              <CardDescription>Período: 01/01 - 31/01/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Valor Total</span>
                  </div>
                  <span className="font-bold text-green-600">R$ 45.230,00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Assinantes</span>
                  </div>
                  <span className="font-bold">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Energia (kWh)</span>
                  </div>
                  <span className="font-bold">18.500</span>
                </div>
                <div className="mt-3 p-2 bg-green-100 rounded">
                  <span className="text-sm text-green-800 font-medium">Finalizado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <span>Rateio Fevereiro 2024</span>
              </CardTitle>
              <CardDescription>Período: 01/02 - 29/02/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Valor Total</span>
                  </div>
                  <span className="font-bold text-green-600">R$ 42.780,00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Assinantes</span>
                  </div>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Energia (kWh)</span>
                  </div>
                  <span className="font-bold">17.200</span>
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded">
                  <span className="text-sm text-blue-800 font-medium">Em Processamento</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <span>Rateio Março 2024</span>
              </CardTitle>
              <CardDescription>Período: 01/03 - 31/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Valor Estimado</span>
                  </div>
                  <span className="font-bold text-gray-600">R$ 48.500,00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Assinantes</span>
                  </div>
                  <span className="font-bold">130</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Energia (kWh)</span>
                  </div>
                  <span className="font-bold">19.800</span>
                </div>
                <div className="mt-3 p-2 bg-yellow-100 rounded">
                  <span className="text-sm text-yellow-800 font-medium">Aguardando</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Rateio</CardTitle>
            <CardDescription>Métricas e estatísticas dos últimos rateios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">R$ 136.510</div>
                <div className="text-sm text-gray-600">Total Distribuído</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-sm text-gray-600">Assinantes Médios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">55.500</div>
                <div className="text-sm text-gray-600">kWh Distribuídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">R$ 2,46</div>
                <div className="text-sm text-gray-600">Valor Médio/kWh</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Rateio;
