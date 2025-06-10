
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Calculator, History, Zap, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Rateio = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showError, setShowError] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de Rateio</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Gerencie a distribuição de energia entre geradoras e assinantes.</p>
          </div>
          
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assinantes" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-white rounded-xl border border-gray-200 p-1 gap-1 sm:gap-0">
            <TabsTrigger 
              value="assinantes" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm p-2 sm:p-3"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Assinantes por Geradora</span>
              <span className="sm:hidden">Assinantes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cadastrar" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm p-2 sm:p-3"
            >
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cadastrar Rateio</span>
              <span className="sm:hidden">Cadastrar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historico" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm p-2 sm:p-3"
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Histórico de Rateios</span>
              <span className="sm:hidden">Histórico</span>
            </TabsTrigger>
          </TabsList>

          {/* Assinantes por Geradora Tab */}
          <TabsContent value="assinantes" className="mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Consultar Assinantes por Geradora</CardTitle>
                <CardDescription className="text-sm">
                  Selecione uma geradora para visualizar os assinantes vinculados e gerenciar seus vínculos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Buscar geradora por nome ou UC..."
                    className="pl-10 bg-gray-50 border-gray-200 h-10 sm:h-12 text-sm"
                  />
                </div>

                <div className="flex items-center justify-center py-12 sm:py-16">
                  <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-gray-600 text-sm sm:text-base">Carregando geradoras...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cadastrar Rateio Tab */}
          <TabsContent value="cadastrar" className="mt-6">
            <Card className="border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Criar Novo Rateio</CardTitle>
                <CardDescription className="text-sm">
                  Siga os passos abaixo para configurar a distribuição de energia
                </CardDescription>
                
                {/* Steps */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 mt-6">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm ${
                    activeStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <div className={`w-8 sm:w-16 h-0.5 ${activeStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm ${
                    activeStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <div className={`w-8 sm:w-16 h-0.5 ${activeStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm ${
                    activeStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Step 1 - Escolher Geradora */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Escolher Geradora</h3>
                    <p className="text-gray-600 text-sm">Selecione a geradora para o rateio</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Qual geradora você quer configurar?</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mb-4">Busque e selecione a geradora que terá um novo rateio</p>
                      </div>

                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input 
                          placeholder="Buscar geradora por nome ou UC..."
                          className="pl-10 bg-white border-gray-300 h-10 sm:h-12 text-sm"
                        />
                      </div>

                      {/* Error State */}
                      {showError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                          <div className="flex items-center gap-2 text-red-600 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium text-sm">Erro ao Carregar Geradoras</span>
                          </div>
                          <p className="text-red-600 text-xs sm:text-sm mb-3">Nenhuma geradora encontrada no banco de dados.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-300 hover:bg-green-50 text-xs"
                          >
                            Tentar Novamente
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button variant="outline" className="flex items-center gap-2 text-sm">
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm">
                      Próximo
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Histórico de Rateios Tab */}
          <TabsContent value="historico" className="mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <CardTitle className="text-lg sm:text-xl">Histórico de Rateios</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Consulte os rateios realizados anteriormente para uma geradora.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Selecionar Geradora</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      placeholder="Buscar geradora por nome ou UC..."
                      className="pl-10 bg-gray-50 border-gray-200 h-10 sm:h-12 text-sm"
                    />
                  </div>
                </div>

                {/* Error State */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Erro ao Carregar Geradoras</span>
                  </div>
                  <p className="text-red-600 text-xs sm:text-sm mb-4">Nenhuma geradora encontrada no banco de dados.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 border-green-300 hover:bg-green-50 text-xs sm:text-sm"
                  >
                    Tentar Novamente
                  </Button>
                </div>

                {/* Empty State */}
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Selecione uma Geradora</h3>
                  <p className="text-gray-500 text-sm sm:text-base">Para visualizar o histórico de rateios.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Rateio;
