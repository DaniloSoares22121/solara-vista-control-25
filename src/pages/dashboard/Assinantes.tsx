
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Search, Filter, UserCheck, UserX, TrendingUp, Clock, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SubscriberForm from '@/components/forms/subscriber/SubscriberForm';
import SubscribersTable from '@/components/subscribers/SubscribersTable';
import SubscriberViewModal from '@/components/subscribers/SubscriberViewModal';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

const Assinantes = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<SubscriberRecord | null>(null);
  const [viewingSubscriber, setViewingSubscriber] = useState<SubscriberRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { subscribers, isLoading, deleteSubscriber } = useSubscribers();

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(subscriber => {
    const name = subscriber.subscriber?.fullName || subscriber.subscriber?.companyName || '';
    const document = subscriber.subscriber?.cpf || subscriber.subscriber?.cnpj || '';
    const email = subscriber.subscriber?.email || '';
    const uc = subscriber.energy_account?.uc || '';
    
    const searchLower = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(searchLower) ||
      document.includes(searchTerm) ||
      email.toLowerCase().includes(searchLower) ||
      uc.includes(searchTerm)
    );
  });

  const handleEdit = (subscriber: SubscriberRecord) => {
    console.log('Editar assinante:', subscriber);
    setEditingSubscriber(subscriber);
    setShowForm(true);
  };

  const handleView = (subscriber: SubscriberRecord) => {
    console.log('Visualizar assinante:', subscriber);
    setViewingSubscriber(subscriber);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este assinante?')) {
      deleteSubscriber(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSubscriber(null);
  };

  const handleNewSubscriber = () => {
    setEditingSubscriber(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50">
          <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {editingSubscriber ? 'Editar Assinante' : 'Novo Assinante'}
                </h1>
                <p className="text-gray-600 text-lg">
                  {editingSubscriber ? 'Edite os dados do assinante selecionado' : 'Cadastre um novo assinante no sistema'}
                </p>
              </div>
              <Button
                onClick={handleCloseForm}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 shadow-md"
              >
                Voltar para Lista
              </Button>
            </div>
            
            <SubscriberForm 
              existingData={editingSubscriber} 
              subscriberId={editingSubscriber?.id}
              onSuccess={handleCloseForm}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const pendingSubscribers = subscribers.filter(s => s.status === 'pending').length;
  const inactiveSubscribers = subscribers.filter(s => s.status === 'inactive').length;

  const statsCards = [
    {
      title: 'Total de Assinantes',
      value: totalSubscribers,
      description: 'Assinantes cadastrados',
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      trend: totalSubscribers > 0 ? `+${totalSubscribers}` : '0',
      changePercent: '+12%'
    },
    {
      title: 'Assinantes Ativos',
      value: activeSubscribers,
      description: 'Com contratos vigentes',
      icon: UserCheck,
      iconColor: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      trend: activeSubscribers > 0 ? `+${activeSubscribers}` : '0',
      changePercent: '+8%'
    },
    {
      title: 'Aguardando Ativação',
      value: pendingSubscribers,
      description: 'Pendentes de aprovação',
      icon: Clock,
      iconColor: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      trend: pendingSubscribers > 0 ? `+${pendingSubscribers}` : '0',
      changePercent: '+3%'
    },
    {
      title: 'Inativos',
      value: inactiveSubscribers,
      description: 'Contratos suspensos',
      icon: UserX,
      iconColor: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      trend: inactiveSubscribers > 0 ? `${inactiveSubscribers}` : '0',
      changePercent: '-2%'
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50">
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Assinantes
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Gerencie todos os assinantes do sistema de energia solar
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 shadow-md"
              >
                <Activity className="w-4 h-4" />
                <span>Relatórios</span>
              </Button>
              
              <Button 
                onClick={handleNewSubscriber} 
                className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Novo Assinante</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
              <Card key={index} className={`border-2 ${card.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm overflow-hidden group`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${card.bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs text-green-600 font-medium mb-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.changePercent}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <CardTitle className="text-sm font-medium text-gray-600 leading-tight">
                      {card.title}
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                      <span className="text-sm text-green-600 font-medium">
                        {card.trend}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filter Section */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar assinantes por nome, CPF/CNPJ, email ou UC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-green-400 focus:ring-green-400 bg-white shadow-sm rounded-xl text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 h-12 px-6 rounded-xl shadow-sm"
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filtros Avançados</span>
                </Button>
              </div>
              
              {searchTerm && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span>Mostrando {filteredSubscribers.length} resultado(s) para:</span>
                  <span className="font-semibold text-green-600">"{searchTerm}"</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscribers Table com loading consistente */}
          <SubscribersTable
            subscribers={filteredSubscribers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isLoading={isLoading}
          />

          {/* View Modal */}
          <SubscriberViewModal
            subscriber={viewingSubscriber}
            isOpen={!!viewingSubscriber}
            onClose={() => setViewingSubscriber(null)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assinantes;
