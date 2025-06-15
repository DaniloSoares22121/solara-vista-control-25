
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Zap, Users, TrendingUp, Activity } from 'lucide-react';
import { RateioData } from '@/types/rateio';

interface RateioStatsProps {
  rateios: RateioData[];
  isLoading?: boolean;
}

const RateioStats: React.FC<RateioStatsProps> = ({ rateios, isLoading }) => {
  const stats = {
    total: rateios.length,
    pending: rateios.filter(r => r.status === 'pending').length,
    processed: rateios.filter(r => r.status === 'processed').length,
    completed: rateios.filter(r => r.status === 'completed').length,
    totalEnergy: rateios.reduce((acc, r) => acc + (r.geracaoEsperada || 0), 0),
    averageSubscribers: rateios.length > 0 ? Math.round(rateios.reduce((acc, r) => acc + r.assinantes.length, 0) / rateios.length) : 0
  };

  const statCards = [
    {
      title: 'Total de Rateios',
      value: stats.total,
      icon: Calculator,
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-500/10 to-purple-500/10',
      color: 'text-blue-700',
      details: `${stats.pending} pendentes • ${stats.completed} concluídos`
    },
    {
      title: 'Energia Total',
      value: `${(stats.totalEnergy / 1000).toFixed(1)}k kWh`,
      icon: Zap,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      color: 'text-green-700',
      details: 'Energia distribuída total'
    },
    {
      title: 'Média de Assinantes',
      value: stats.averageSubscribers,
      icon: Users,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      color: 'text-yellow-700',
      details: 'Por rateio realizado'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      color: 'text-purple-700',
      details: 'Rateios concluídos'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden border-0 shadow-lg animate-pulse">
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="p-3 bg-gray-200 rounded-xl">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.title} 
          className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`}></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className={`text-sm font-semibold ${stat.color}`}>
              {stat.title}
            </CardTitle>
            <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-3xl font-bold ${stat.color.replace('text-', 'text-').replace('-700', '-900')} mb-1`}>
              {stat.value}
            </div>
            <p className={`text-sm ${stat.color.replace('-700', '-600')}`}>
              {stat.details}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RateioStats;
