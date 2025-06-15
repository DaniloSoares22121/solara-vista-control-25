
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Zap, Calendar, Activity } from 'lucide-react';
import { useRateioSubscribers } from '@/hooks/useRateio';

interface RateioStatsProps {
  totalRateios: number;
  totalDistribuido: number;
  geradorasAtivas: number;
}

export const RateioStats: React.FC<RateioStatsProps> = ({
  totalRateios,
  totalDistribuido,
  geradorasAtivas
}) => {
  const { data: subscribersData } = useRateioSubscribers();
  const assinantesAtivos = subscribersData?.length || 0;

  const stats = [
    {
      title: 'Total de Rateios',
      value: totalRateios.toString(),
      subtitle: 'realizados',
      icon: Activity,
      color: 'blue',
      trend: totalRateios > 0 ? '+' + totalRateios : '0'
    },
    {
      title: 'Energia Distribuída',
      value: `${totalDistribuido.toLocaleString('pt-BR')}`,
      subtitle: 'kWh total',
      icon: TrendingUp,
      color: 'green',
      trend: totalDistribuido > 0 ? '+' + Math.round(totalDistribuido / 1000) + 'k' : '0'
    },
    {
      title: 'Geradoras Ativas',
      value: geradorasAtivas.toString(),
      subtitle: 'em operação',
      icon: Zap,
      color: 'yellow',
      trend: geradorasAtivas > 0 ? '+' + geradorasAtivas : '0'
    },
    {
      title: 'Assinantes',
      value: assinantesAtivos.toString(),
      subtitle: 'cadastrados',
      icon: Users,
      color: 'purple',
      trend: assinantesAtivos > 0 ? '+' + assinantesAtivos : '0'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <Badge variant="outline" className={`${getColorClasses(stat.color)} border`}>
                {stat.trend}
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
