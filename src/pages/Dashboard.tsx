
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Users, Home, Clock, CheckCircle, CreditCard, Receipt, TrendingUp, Activity } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');

  const statsCards = [
    {
      title: 'Total de Faturas',
      value: '0',
      description: 'No período selecionado',
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+0%'
    },
    {
      title: 'Valor Total',
      value: 'R$ 0,00',
      description: 'Valor total das faturas no período',
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+0%'
    },
    {
      title: 'Total de Assinantes',
      value: '0',
      description: 'Assinantes cadastrados no sistema',
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+0%'
    },
    {
      title: 'Total de Geradoras',
      value: '0',
      description: 'Geradoras cadastradas no sistema',
      icon: Home,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+0%'
    }
  ];

  const statusCards = [
    {
      title: 'Faturas Pendentes',
      value: '0',
      percentage: '0% do total',
      icon: Clock,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Faturas Processadas',
      value: '0',
      percentage: '0% do total',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Faturas Emitidas',
      value: '0',
      percentage: '0% do total',
      icon: CreditCard,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Faturas Pagas',
      value: '0',
      percentage: '0% do total',
      icon: Receipt,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Visão geral do sistema Energy Pay</p>
          </div>
          
          {/* Period Filter */}
          <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            {['Semana', 'Mês', 'Ano'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 transition-all duration-200 ${
                  selectedPeriod === period 
                    ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {card.trend}
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
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

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusCards.map((card, index) => (
            <Card key={index} className={`border-2 ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-200 bg-white`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {card.percentage}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Invoices Section */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Faturas Recentes
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Últimas faturas registradas no sistema
                </CardDescription>
              </div>
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Nenhuma fatura encontrada</h3>
                  <p className="text-gray-500">Quando houver faturas, elas aparecerão aqui</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
