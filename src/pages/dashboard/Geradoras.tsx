
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FileText, Zap, TrendingUp, Activity, Power, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useGenerators } from '@/hooks/useGenerators';
import GeneratorDetails from '@/components/GeneratorDetails';
import NovaGeradora from '@/pages/dashboard/NovaGeradora';

const Geradoras = () => {
  const { generators, loading, deleteGenerator } = useGenerators();
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
      <div className="p-6">
        <LoadingSpinner size="lg" text="Carregando geradoras..." />
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Geradoras
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gerencie suas usinas geradoras de energia solar com facilidade e controle total
          </p>
          <Button 
            onClick={() => setShowNewGeneratorForm(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold rounded-xl"
          >
            <Plus className="w-5 h-5 mr-3" />
            Nova Geradora
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Geradoras</p>
                  <p className="text-3xl font-bold text-gray-900">{generators.length}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {activeGenerators} ativas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Capacidade Total</p>
                  <p className="text-3xl font-bold text-gray-900">{totalCapacity.toFixed(1)}</p>
                  <p className="text-sm text-blue-600 font-medium">kWp instalados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Geração Mensal</p>
                  <p className="text-3xl font-bold text-gray-900">{totalGeneration.toFixed(0)}</p>
                  <p className="text-sm text-yellow-600 font-medium">kWh/mês</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <Power className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Status Geral</p>
                  <p className="text-3xl font-bold text-green-600">{((activeGenerators / generators.length) * 100 || 0).toFixed(0)}%</p>
                  <p className="text-sm text-purple-600 font-medium">operacionais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Geradoras */}
        {generators.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <Zap className="h-16 w-16 text-green-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">0</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Nenhuma geradora cadastrada
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                    Comece criando sua primeira geradora no sistema para gerenciar suas usinas de energia solar.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowNewGeneratorForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Criar Primeira Geradora
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {generators.map((generator) => {
              const totalCapacityGen = generator.plants?.reduce((total: number, plant: any) => {
                return total + (plant.potenciaTotalUsina || 0);
              }, 0) || 0;

              const totalGenerationGen = generator.plants?.reduce((total: number, plant: any) => {
                return total + (plant.geracaoProjetada || 0);
              }, 0) || 0;

              return (
                <Card key={generator.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group hover:scale-105 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"></div>
                  
                  <CardHeader className="pb-4 bg-gradient-to-br from-gray-50/50 to-white/50">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <div className={`w-3 h-3 rounded-full ${generator.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-bold text-gray-900 truncate mb-2">
                          {generator.owner?.name || 'Geradora'}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            className={`${
                              generator.status === 'active' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md' 
                                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-md'
                            }`}
                          >
                            {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                          </Badge>
                          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 text-xs">
                            {generator.concessionaria}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4 p-6">
                    {/* Estatísticas da Geradora */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-green-600 font-medium">Usinas</p>
                            <p className="text-2xl font-bold text-green-800">{generator.plants?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Capacidade</p>
                            <p className="text-2xl font-bold text-blue-800">{totalCapacityGen.toFixed(1)}</p>
                            <p className="text-xs text-blue-600">kWp</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">Geração Mensal Projetada</p>
                          <p className="text-2xl font-bold text-yellow-800">{totalGenerationGen.toFixed(0)} kWh</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-100">
                      <Button 
                        onClick={() => handleView(generator)}
                        variant="outline" 
                        className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 font-medium"
                      >
                        Ver Detalhes
                      </Button>
                      <Button 
                        onClick={() => handleEdit(generator)}
                        variant="outline"
                        className="flex-1 bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 border border-green-200 text-green-600 hover:text-green-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 font-medium"
                      >
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
    </div>
  );
};

export default Geradoras;
