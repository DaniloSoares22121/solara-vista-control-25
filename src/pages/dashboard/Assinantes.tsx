
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Search, Plus, Filter, User, Users, MapPin, Activity, Download, Loader2 } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';
import NovoAssinante from './NovoAssinante';
import SubscriberCard from '@/components/subscribers/SubscriberCard';
import EditSubscriber from '@/components/subscribers/EditSubscriber';

const Assinantes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSubscriber, setEditingSubscriber] = useState<(SubscriberFormData & { id: string }) | null>(null);
  const [deletingSubscriberId, setDeletingSubscriberId] = useState<string | null>(null);
  
  const { subscribers, loading, deleteSubscriber } = useSubscribers();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (subscriber: SubscriberFormData & { id: string }) => {
    setEditingSubscriber(subscriber);
  };

  const handleCloseEdit = () => {
    setEditingSubscriber(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscriber(id);
      toast.success('Assinante removido com sucesso!');
      setDeletingSubscriberId(null);
    } catch (error) {
      console.error('Erro ao remover assinante:', error);
      toast.error('Erro ao remover assinante');
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
  const totalUCs = subscribers.reduce((acc, sub) => acc + 1, 0);
  const totalEconomy = 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
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
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3 text-sm"
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
                <div className="p-2 rounded-lg bg-green-50">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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
                <div className="p-2 rounded-lg bg-green-50">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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
                <div className="p-2 rounded-lg bg-green-50">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-gray-50 text-sm"
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
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Carregando assinantes...</span>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Empty State or Subscribers List */}
        {!loading && filteredSubscribers.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
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
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg px-6 sm:px-8 py-2 sm:py-3 text-sm"
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
          // Lista de assinantes usando o novo card component
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredSubscribers.map((subscriber) => (
              <SubscriberCard
                key={subscriber.id}
                subscriber={subscriber}
                onEdit={handleEdit}
                onDelete={setDeletingSubscriberId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sheet for New Subscriber */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-7xl p-0 overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Novo Assinante</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto">
            <NovoAssinante onClose={handleCloseModal} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog for Edit Subscriber */}
      <EditSubscriber 
        isOpen={!!editingSubscriber}
        onClose={handleCloseEdit}
        subscriber={editingSubscriber}
      />

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={!!deletingSubscriberId} onOpenChange={() => setDeletingSubscriberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este assinante? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingSubscriberId && handleDelete(deletingSubscriberId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Assinantes;
