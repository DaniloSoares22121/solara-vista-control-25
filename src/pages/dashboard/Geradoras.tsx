
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FileText, Zap, TrendingUp, Activity, Power, ArrowLeft, MapPin, Calendar, Building2, Edit, Eye } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useGenerators } from '@/hooks/useGenerators';
import GeneratorDetails from '@/components/GeneratorDetails';
import NovaGeradora from '@/pages/dashboard/NovaGeradora';
import DashboardLayout from '@/components/DashboardLayout';

const Geradoras = () => {
  const { generators, loading, deleteGenerator, refreshGenerators } = useGenerators();
  const [selectedGenerator, setSelectedGenerator] = useState<any>(null);
  const [showNewGeneratorForm, setShowNewGeneratorForm] = useState(false);
  const [editingGenerator, setEditingGenerator] = useState<any>(null);

  const handleView = (generator: any) => {
    setSelectedGenerator(generator);
  };

  const handleEdit = (generator: any) => {
    setEditingGenerator(generator);
    setShowNewGeneratorForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteGenerator(id);
  };

  const handleCloseDetails = () => {
    setSelectedGenerator(null);
  };

  const handleNewGeneratorSuccess = () => {
    refreshGenerators();
    setShowNewGeneratorForm(false);
    setEditingGenerator(null);
  };

  const handleCloseForm = () => {
    setShowNewGeneratorForm(false);
    setEditingGenerator(null);
  };

  // Se estiver mostrando o formulário, renderizar apenas ele
  if (showNewGeneratorForm) {
    return (
      <NovaGeradora 
        onClose={handleCloseForm}
        editMode={!!editingGenerator}
        generatorData={editingGenerator}
      />
    );
  }

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
            onClick={() => setShowNewGeneratorForm(true)}
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
                  onClick={() => setShowNewGeneratorForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Geradora
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {generators.map((generator) => {
              const totalCapacityGen = generator.plants?.reduce((total: number, plant: any) => {
                return total + (plant.potenciaTotalUsina || 0);
              }, 0) || 0;

              const totalGenerationGen = generator.plants?.reduce((total: number, plant: any) => {
                return total + (plant.geracaoProjetada || 0);
              }, 0) || 0;

              // Extrair informações do endereço da primeira usina
              const firstPlant = generator.plants?.[0];
              const city = firstPlant?.endereco?.cidade || 'N/A';
              const state = firstPlant?.endereco?.estado || '';

              return (
                <Card key={generator.id} className="group shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Zap className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-gray-900 truncate">
                            {generator.owner?.name || 'Geradora'}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600 truncate">{generator.concessionaria}</p>
                          </div>
                          {(city !== 'N/A' || state) && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <p className="text-sm text-gray-600">{city}{state && `, ${state}`}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge 
                        className={`shrink-0 ${
                          generator.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                        variant="outline"
                      >
                        {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Estatísticas principais */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-2xl font-bold text-blue-700 mb-1">
                          {generator.plants?.length || 0}
                        </div>
                        <p className="text-sm text-blue-600 font-medium">Usinas</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="text-2xl font-bold text-amber-700 mb-1">
                          {totalCapacityGen.toFixed(1)}
                        </div>
                        <p className="text-sm text-amber-600 font-medium">kWp</p>
                      </div>
                    </div>

                    {/* Geração mensal */}
                    <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">Geração Mensal</p>
                          <p className="text-xl font-bold text-green-700">{totalGenerationGen.toFixed(0)} kWh</p>
                        </div>
                        <Activity className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleView(generator)}
                        variant="outline" 
                        className="flex-1 group-hover:border-green-300 transition-colors"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button 
                        onClick={() => handleEdit(generator)}
                        variant="outline"
                        className="flex-1 group-hover:border-blue-300 transition-colors"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de Detalhes da Geradora */}
        <GeneratorDetails
          generator={selectedGenerator}
          isOpen={!!selectedGenerator}
          onEdit={() => handleEdit(selectedGenerator)}
          onDelete={handleDelete}
          onClose={handleCloseDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default Geradoras;
