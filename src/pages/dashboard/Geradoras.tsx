
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Zap, Plus, Search, RefreshCw, Filter, MapPin, Activity, Eye, Building, Calendar, User } from 'lucide-react';
import NovaGeradora from './NovaGeradora';
import GeneratorDetails from '@/components/GeneratorDetails';
import { useGenerators } from '@/hooks/useGenerators';

const Geradoras = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { generators, loading, refreshGenerators, deleteGenerator } = useGenerators();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGenerator(null);
    refreshGenerators(); // Recarregar dados após fechar modal
  };

  const handleViewDetails = (generator: any) => {
    setSelectedGenerator(generator);
    setShowDetails(true);
  };

  const handleEdit = () => {
    setShowDetails(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGenerator(id);
      setShowDetails(false);
    } catch (error) {
      console.error('Erro ao excluir geradora:', error);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedGenerator(null);
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
              <Card key={generator.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {generator.owner?.name || 'Geradora'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            {generator.concessionaria}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${generator.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
                    >
                      {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Informações da Geradora */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-600">Usinas</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {generator.plants?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">Capacidade</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {generator.plants?.reduce((total: number, plant: any) => {
                          return total + (plant.potenciaTotalUsina || 0);
                        }, 0).toFixed(1)} kWp
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <span className={`text-sm font-bold ${generator.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                        {generator.status === 'active' ? 'Em funcionamento' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  {/* Informações do Proprietário */}
                  {generator.owner && (
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-xs text-gray-500">Proprietário:</span>
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {generator.owner.name}
                            <br />
                            <span className="text-xs text-gray-500">
                              {generator.owner.email}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="border-t border-gray-100 pt-3">
                    <Button 
                      onClick={() => handleViewDetails(generator)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
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

      {/* Sheet for Generator Details */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="right" className="w-full sm:max-w-6xl p-0 overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Detalhes da Geradora</SheetTitle>
          </SheetHeader>
          {selectedGenerator && (
            <GeneratorDetails
              generator={selectedGenerator}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClose={handleCloseDetails}
            />
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Geradoras;
