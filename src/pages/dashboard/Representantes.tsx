
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, Users, UserCheck, Percent, MapPin, TrendingUp } from 'lucide-react';

const Representantes = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Representantes</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Gerencie os representantes e vendedores cadastrados no sistema</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-2 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Vendas: R$ 0,00
            </Badge>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Total de Representantes
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-50">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs sm:text-sm text-gray-500">Cadastrados no sistema</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Representantes Ativos
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs sm:text-sm text-gray-500">Com vendas ativas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Comissão Média
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-50">
                <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0%</div>
              <p className="text-xs sm:text-sm text-gray-500">Taxa padrão</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Regiões Cobertas
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs sm:text-sm text-gray-500">Áreas de atuação</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Buscar representante por nome, região ou contato..."
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-gray-50 text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button variant="outline" className="h-10 sm:h-12 px-4 sm:px-6 border-gray-200 hover:bg-gray-50 text-sm">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Exportar Lista
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg h-10 sm:h-12 px-4 sm:px-6 text-sm">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Adicionar Representante
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Table */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Lista de Representantes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-3 sm:py-4 text-xs sm:text-sm">Nome</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Contato</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Região</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Comissão</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 sm:py-20">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Nenhum representante encontrado</h3>
                          <p className="text-gray-500 text-sm sm:text-base">Adicione representantes para gerenciar vendas e comissões</p>
                        </div>
                        <div className="pt-2">
                          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg px-6 sm:px-8 py-2 sm:py-3 text-sm">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Adicionar Primeiro Representante
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Representantes;
