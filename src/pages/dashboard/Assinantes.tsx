
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Plus, Filter, User, Users, MapPin, Activity, Download, Loader2 } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import NovoAssinante from './NovoAssinante';

const Assinantes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { subscribers, loading, createSubscriber } = useSubscribers();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubscriberCreated = async (data: any) => {
    try {
      await createSubscriber(data);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar assinante:', error);
    }
  };

  // Filtrar assinantes baseado no termo de busca
  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.subscriber.cpfCnpj.includes(searchTerm) ||
    subscriber.energyAccount.originalAccount.uc.includes(searchTerm)
  );

  // Calcular estatísticas
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(sub => sub.planContract.modalidadeCompensacao).length;
  const totalUCs = subscribers.reduce((acc, sub) => acc + 1, 0); // Por enquanto 1 UC por assinante
  const totalEconomy = 0; // Implementar cálculo de economia depois

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Assinantes</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Gerencie seus clientes de energia por UC</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={handleOpenModal}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              )}
              Novo Assinante
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total de Assinantes</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{totalSubscribers}</div>
              <p className="text-xs sm:text-sm text-gray-500">Clientes cadastrados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Assinantes Ativos</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{activeSubscribers}</div>
              <p className="text-xs sm:text-sm text-gray-500">Com geração ativa</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">UCs Vinculadas</CardTitle>
                <div className="p-2 rounded-lg bg-purple-50">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{totalUCs}</div>
              <p className="text-xs sm:text-sm text-gray-500">Unidades consumidoras</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Economia Total</CardTitle>
                <div className="p-2 rounded-lg bg-orange-50">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">R$ {totalEconomy.toLocaleString()}</div>
              <p className="text-xs sm:text-sm text-gray-500">Este mês</p>
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
                  placeholder="Buscar assinantes por nome, UC ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 text-sm"
                />
              </div>
              
              <Button variant="outline" className="h-10 sm:h-12 px-4 sm:px-6 border-gray-200 hover:bg-gray-50 text-sm whitespace-nowrap">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando assinantes...</span>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Empty State or Subscribers List */}
        {!loading && filteredSubscribers.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                    {searchTerm ? 'Não encontrado' : 'Vazio'}
                  </Badge>
                </div>
              </div>
              
              <div className="text-center space-y-3 sm:space-y-4 max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum assinante encontrado'}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                  {searchTerm 
                    ? 'Tente ajustar sua pesquisa ou limpar os filtros.'
                    : 'Comece adicionando seus primeiros assinantes para gerenciar suas unidades consumidoras e acompanhar a economia de energia.'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4 justify-center">
                  <Button 
                    onClick={handleOpenModal}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-6 sm:px-8 py-2 sm:py-3 text-sm"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Adicionar Assinante
                  </Button>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50 px-6 sm:px-8 py-2 sm:py-3 text-sm">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Importar Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Lista de assinantes (implementar depois se necessário)
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{subscriber.subscriber.name}</h3>
                        <p className="text-sm text-gray-600">UC: {subscriber.energyAccount.originalAccount.uc}</p>
                        <p className="text-sm text-gray-600">{subscriber.subscriber.cpfCnpj}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {subscriber.planContract.modalidadeCompensacao}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {subscriber.planContract.kwhContratado} kWh
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sheet for New Subscriber */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-6xl p-0 overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Novo Assinante</SheetTitle>
          </SheetHeader>
          <NovoAssinante onClose={handleCloseModal} onSubmit={handleSubscriberCreated} />
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Assinantes;
