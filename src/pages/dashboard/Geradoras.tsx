
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Zap, Plus, Search, RefreshCw, Filter, MapPin, Activity } from 'lucide-react';
import NovaGeradora from './NovaGeradora';
import { useGenerators } from '@/hooks/useGenerators';

const Geradoras = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generators, loading, refreshGenerators } = useGenerators();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    refreshGenerators(); // Recarregar dados após fechar modal
  };

  const activeGenerators = generators.filter(g => g.status === 'active').length;
  const totalCapacity = generators.reduce((total, generator) => {
    const plants = generator.plants || [];
    return total + plants.reduce((plantTotal: number, plant: any) => {
      return plantTotal + (plant.potenciaTotalUsina || 0);
    }, 0);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Geradoras</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Gerencie suas unidades geradoras de energia</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3 w-fit"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Nova Geradora
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total de Geradoras</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{generators.length}</div>
              <p className="text-xs sm:text-sm text-gray-500">Unidades cadastradas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Geradoras Ativas</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{activeGenerators}</div>
              <p className="text-xs sm:text-sm text-gray-500">Em funcionamento</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Capacidade Total</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{totalCapacity.toFixed(1)} kWp</div>
              <p className="text-xs sm:text-sm text-gray-500">Potência instalada</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Buscar geradoras por nome, UC ou localização..."
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-gray-50 text-sm"
                />
              </div>
              
              <div className="flex gap-2 sm:gap-0">
                <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-6 border-gray-200 hover:bg-gray-50 text-sm">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Filtros
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-6 border-gray-200 hover:bg-gray-50 text-sm"
                  onClick={refreshGenerators}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Geradoras ou Estado Vazio */}
        {generators.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                    Novo
                  </Badge>
                </div>
              </div>
              
              <div className="text-center space-y-3 sm:space-y-4 max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nenhuma geradora encontrada
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                  Comece adicionando sua primeira geradora para monitorar a produção de energia e gerenciar seus assinantes.
                </p>
                
                <div className="pt-2 sm:pt-4">
                  <Button 
                    onClick={handleOpenModal}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Adicionar Primeira Geradora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generators.map((generator) => (
              <Card key={generator.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {generator.owner?.name || 'Geradora'}
                    </CardTitle>
                    <Badge className={`${generator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{generator.concessionaria}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usinas:</span>
                      <span className="font-medium">{generator.plants?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacidade:</span>
                      <span className="font-medium">
                        {generator.plants?.reduce((total: number, plant: any) => {
                          return total + (plant.potenciaTotalUsina || 0);
                        }, 0).toFixed(1)} kWp
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sheet for New Generator */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-7xl p-0 overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Nova Geradora</SheetTitle>
          </SheetHeader>
          <NovaGeradora onClose={handleCloseModal} />
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Geradoras;
