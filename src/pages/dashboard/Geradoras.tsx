
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FileText, Zap, TrendingUp, Activity, Power } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useGenerators } from '@/hooks/useGenerators';
import GeneratorDetails from '@/components/GeneratorDetails';
import NewGeneratorModal from '@/components/forms/NewGeneratorModal';
import DashboardLayout from '@/components/DashboardLayout';

const Geradoras = () => {
  const { generators, loading, deleteGenerator, refreshGenerators } = useGenerators();
  const [selectedGenerator, setSelectedGenerator] = useState<any>(null);
  const [showNewGeneratorModal, setShowNewGeneratorModal] = useState(false);

  const handleView = (generator: any) => {
    setSelectedGenerator(generator);
  };

  const handleEdit = () => {
    // TODO: Implementar edição
  };

  const handleDelete = async (id: string) => {
    await deleteGenerator(id);
  };

  const handleCloseDetails = () => {
    setSelectedGenerator(null);
  };

  const handleNewGeneratorSuccess = () => {
    refreshGenerators();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner size="lg" text="Carregando geradoras..." />
        </div>
      </DashboardLayout>
    );
  }

  const totalCapacity = generators.reduce((total, gen) => {
    return total + (gen.plants?.reduce((plantTotal: number, plant: any) => {
      return plantTotal + (plant.potenciaTotalUsina || 0);
    }, 0) || 0);
  }, 0);

  const totalGeneration = generators.reduce((total, gen) => {
    return total + (gen.plants?.reduce((plantTotal: number, plant: any) => {
      return plantTotal + (plant.geracaoProjetada || 0);
    }, 0) || 0);
  }, 0);

  const activeGenerators = generators.filter(gen => gen.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Geradoras</h1>
            <p className="text-gray-600 mt-1">Gerencie suas usinas geradoras de energia solar</p>
          </div>
          <Button 
            onClick={() => setShowNewGeneratorModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Geradora
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Geradoras</CardTitle>
                <Zap className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{generators.length}</div>
              <p className="text-sm text-gray-600 mt-1">
                {activeGenerators} ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Capacidade Total</CardTitle>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalCapacity.toFixed(1)}</div>
              <p className="text-sm text-gray-600 mt-1">kWp instalados</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Geração Mensal</CardTitle>
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalGeneration.toFixed(0)}</div>
              <p className="text-sm text-gray-600 mt-1">kWh/mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Status Geral</CardTitle>
                <Power className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{((activeGenerators / generators.length) * 100 || 0).toFixed(0)}%</div>
              <p className="text-sm text-gray-600 mt-1">operacionais</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Geradoras */}
        {generators.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Nenhuma geradora cadastrada</h3>
                  <p className="text-gray-600 mt-2">
                    Comece criando sua primeira geradora no sistema.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowNewGeneratorModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Geradora
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generators.map((generator) => {
              const totalCapacityGen = generator.plants?.reduce((total: number, plant: any) => {
                return total + (plant.potenciaTotalUsina || 0);
              }, 0) || 0;

              const totalGenerationGen = generator.plants?.reduce((total: number, plant: any) => {
                return total + (plant.geracaoProjetada || 0);
              }, 0) || 0;

              return (
                <Card key={generator.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{generator.owner?.name || 'Geradora'}</CardTitle>
                          <p className="text-sm text-gray-600">{generator.concessionaria}</p>
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          generator.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Usinas</p>
                        <p className="text-xl font-bold text-gray-900">{generator.plants?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Capacidade</p>
                        <p className="text-xl font-bold text-gray-900">{totalCapacityGen.toFixed(1)} kWp</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Geração Mensal</p>
                      <p className="text-lg font-semibold text-gray-900">{totalGenerationGen.toFixed(0)} kWh</p>
                    </div>
                    <Button 
                      onClick={() => handleView(generator)}
                      variant="outline" 
                      className="w-full"
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de Nova Geradora */}
        <NewGeneratorModal
          isOpen={showNewGeneratorModal}
          onClose={() => setShowNewGeneratorModal(false)}
          onSuccess={handleNewGeneratorSuccess}
        />

        {/* Modal de Detalhes da Geradora */}
        <GeneratorDetails
          generator={selectedGenerator}
          isOpen={!!selectedGenerator}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={handleCloseDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default Geradoras;
