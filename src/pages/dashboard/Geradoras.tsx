
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Zap, Plus, Search, RefreshCw, Filter, MapPin, Activity, Eye, Building, Calendar, User, Edit, Power, TrendingUp, Users } from 'lucide-react';
import NovaGeradora from './NovaGeradora';
import GeneratorDetails from '@/components/GeneratorDetails';
import { useGenerators } from '@/hooks/useGenerators';

const Geradoras = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { generators, loading, refreshGenerators, deleteGenerator } = useGenerators();

  const handleOpenModal = () => {
    setSelectedGenerator(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGenerator(null);
    setEditMode(false);
    refreshGenerators();
  };

  const handleViewDetails = (generator: any) => {
    setSelectedGenerator(generator);
    setShowDetails(true);
  };

  const handleEdit = (generator?: any) => {
    if (generator) {
      setSelectedGenerator(generator);
    }
    setShowDetails(false);
    setEditMode(true);
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

  // Filtrar geradoras baseado no termo de busca
  const filteredGenerators = generators.filter(generator => {
    const searchLower = searchTerm.toLowerCase();
    return (
      generator.owner?.name?.toLowerCase().includes(searchLower) ||
      generator.concessionaria?.toLowerCase().includes(searchLower) ||
      generator.plants?.some((plant: any) => 
        plant.uc?.toLowerCase().includes(searchLower) ||
        plant.apelido?.toLowerCase().includes(searchLower)
      )
    );
  });

  const activeGenerators = generators.filter(g => g.status === 'active').length;
  const totalCapacity = generators.reduce((total, generator) => {
    const plants = generator.plants || [];
    return total + plants.reduce((plantTotal: number, plant: any) => {
      return plantTotal + (plant.potenciaTotalUsina || 0);
    }, 0);
  }, 0);

  const totalPlants = generators.reduce((total, generator) => {
    return total + (generator.plants?.length || 0);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Header Aprimorado */}
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Geradoras</h1>
                  <p className="text-green-100 text-lg sm:text-xl">Gerencie suas unidades geradoras de energia solar</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleOpenModal}
              className="bg-white text-green-700 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg font-semibold"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Geradora
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas Aprimorados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">Total de Geradoras</CardTitle>
                <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                  <Building className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-blue-900 mb-1">{generators.length}</div>
              <p className="text-sm text-blue-600">Unidades cadastradas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700">Geradoras Ativas</CardTitle>
                <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                  <Power className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-900 mb-1">{activeGenerators}</div>
              <p className="text-sm text-green-600">Em funcionamento</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-yellow-700">Capacidade Total</CardTitle>
                <div className="p-3 rounded-xl bg-yellow-500 shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-yellow-900 mb-1">{totalCapacity.toFixed(1)}</div>
              <p className="text-sm text-yellow-600">kWp instalados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700">Total de Usinas</CardTitle>
                <div className="p-3 rounded-xl bg-purple-500 shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-purple-900 mb-1">{totalPlants}</div>
              <p className="text-sm text-purple-600">Usinas cadastradas</p>
            </CardContent>
          </Card>
        </div>

        {/* Search e Filtros Aprimorados */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nome, UC, concessionária ou localização..."
                  className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-gray-50 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 px-6 border-gray-200 hover:bg-gray-50">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-12 px-6 border-gray-200 hover:bg-gray-50"
                  onClick={refreshGenerators}
                  disabled={loading}
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Geradoras ou Estado Vazio */}
        {filteredGenerators.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="flex flex-col items-center justify-center py-20 px-4">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <Zap className="w-16 h-16 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    {searchTerm ? 'Filtro' : 'Novo'}
                  </Badge>
                </div>
              </div>
              
              <div className="text-center space-y-4 max-w-md">
                <h3 className="text-2xl font-bold text-gray-900">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhuma geradora encontrada'}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {searchTerm 
                    ? `Não encontramos geradoras que correspondam à busca "${searchTerm}". Tente ajustar os termos de pesquisa.`
                    : 'Comece adicionando sua primeira geradora para monitorar a produção de energia e gerenciar seus assinantes.'
                  }
                </p>
                
                {!searchTerm && (
                  <div className="pt-4">
                    <Button 
                      onClick={handleOpenModal}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg px-8 py-3 text-base"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Primeira Geradora
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGenerators.map((generator) => (
              <Card key={generator.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                          {generator.owner?.name || 'Geradora'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-600 truncate">
                            {generator.concessionaria}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${generator.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'} flex-shrink-0`}
                    >
                      {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Informações em Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Usinas</span>
                      </div>
                      <span className="text-lg font-bold text-blue-900">
                        {generator.plants?.length || 0}
                      </span>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Capacidade</span>
                      </div>
                      <span className="text-lg font-bold text-green-900">
                        {generator.plants?.reduce((total: number, plant: any) => {
                          return total + (plant.potenciaTotalUsina || 0);
                        }, 0).toFixed(1)} kWp
                      </span>
                    </div>
                  </div>

                  {/* Informações do Proprietário */}
                  {generator.owner && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-500">Proprietário:</span>
                          <p className="text-sm text-gray-900 leading-relaxed truncate">
                            {generator.owner.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {generator.owner.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <Button 
                      onClick={() => handleViewDetails(generator)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    
                    <Button 
                      onClick={() => handleEdit(generator)}
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sheet for New/Edit Generator */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-7xl p-0 overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{editMode ? 'Editar Geradora' : 'Nova Geradora'}</SheetTitle>
          </SheetHeader>
          <NovaGeradora 
            onClose={handleCloseModal} 
            editMode={editMode}
            generatorData={selectedGenerator}
          />
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
