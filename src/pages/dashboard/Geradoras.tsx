
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, Search, RefreshCw, Filter, MapPin, Activity } from 'lucide-react';

const Geradoras = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Geradoras</h1>
                <p className="text-gray-600 text-lg">Gerencie suas unidades geradoras de energia</p>
              </div>
            </div>
          </div>
          
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Nova Geradora
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Geradoras</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-500">Unidades cadastradas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Geradoras Ativas</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-500">Em funcionamento</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Capacidade Total</CardTitle>
                <div className="p-2 rounded-lg bg-orange-50">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">0 kW</div>
              <p className="text-sm text-gray-500">Potência instalada</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar geradoras por nome, UC ou localização..."
                  className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-gray-50"
                />
              </div>
              
              <Button variant="outline" className="h-12 px-6 border-gray-200 hover:bg-gray-50">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
              
              <Button variant="outline" className="h-12 px-6 border-gray-200 hover:bg-gray-50">
                <RefreshCw className="w-5 h-5 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Empty State */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <Zap className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                  Novo
                </Badge>
              </div>
            </div>
            
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900">
                Nenhuma geradora encontrada
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Comece adicionando sua primeira geradora para monitorar a produção de energia e gerenciar seus assinantes.
              </p>
              
              <div className="pt-4">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Primeira Geradora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Geradoras;
