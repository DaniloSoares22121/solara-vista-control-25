
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Search, Filter, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SubscriberForm from '@/components/forms/subscriber/SubscriberForm';

const Assinantes = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Novo Assinante
              </h1>
              <p className="text-gray-600">Cadastre um novo assinante no sistema</p>
            </div>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              Voltar para Lista
            </Button>
          </div>
          
          <SubscriberForm />
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total de Assinantes',
      value: '0',
      description: 'Assinantes cadastrados',
      icon: Users,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: '+0%'
    },
    {
      title: 'Assinantes Ativos',
      value: '0',
      description: 'Com contratos vigentes',
      icon: UserCheck,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: '+0%'
    },
    {
      title: 'Aguardando Ativação',
      value: '0',
      description: 'Pendentes de aprovação',
      icon: UserX,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: '+0%'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 min-h-screen bg-gradient-to-br from-green-50/30 to-blue-50/30">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Assinantes
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Gerencie os assinantes do sistema de energia solar
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Assinante</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statsCards.map((card, index) => (
            <Card key={index} className={`border-2 ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {card.title}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-lg sm:text-2xl font-bold text-gray-900">{card.value}</span>
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {card.trend}
                    </div>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${card.bgColor} flex-shrink-0 shadow-md`}>
                  <card.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar assinantes por nome, CPF ou email..."
                  className="pl-10 border-gray-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Lista de Assinantes</span>
                </CardTitle>
                <p className="text-gray-600 mt-1 text-sm">
                  Gerencie todos os assinantes cadastrados no sistema
                </p>
              </div>
              <Button 
                variant="outline" 
                className="text-green-600 border-green-200 hover:bg-green-50 w-fit"
              >
                Exportar Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-center py-16 sm:py-20">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                    Nenhum assinante cadastrado
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Comece criando seu primeiro assinante no sistema. Adicione clientes interessados em energia solar e gerencie seus contratos.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button 
                    onClick={() => setShowForm(true)} 
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Primeiro Assinante</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Ver Tutorial
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Assinantes;
