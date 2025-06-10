
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Users, Home, Clock, CheckCircle, CreditCard, Receipt } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');

  const statsCards = [
    {
      title: 'Total de Faturas',
      value: '0',
      description: 'No período selecionado',
      icon: FileText,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Valor Total',
      value: 'R$ 0,00',
      description: 'Valor total das faturas no período',
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total de Assinantes',
      value: '0',
      description: 'Assinantes cadastrados no sistema',
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Geradoras',
      value: '0',
      description: 'Geradoras cadastradas no sistema',
      icon: Home,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const statusCards = [
    {
      title: 'Faturas Pendentes',
      value: '0',
      percentage: '0% do total',
      icon: Clock,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Faturas Processadas',
      value: '0',
      percentage: '0% do total',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Faturas Emitidas',
      value: '0',
      percentage: '0% do total',
      icon: CreditCard,
      iconColor: 'text-teal-500',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Faturas Pagas',
      value: '0',
      percentage: '0% do total',
      icon: Receipt,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral do sistema Energy Pay</p>
          </div>
          
          {/* Period Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['Semana', 'Mês', 'Ano'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 ${
                  selectedPeriod === period 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
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
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
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
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
                <p className="text-xs text-gray-500">
                  {card.percentage}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Invoices Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Faturas Recentes
            </CardTitle>
            <CardDescription className="text-gray-600">
              Últimas faturas registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhuma fatura encontrada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
