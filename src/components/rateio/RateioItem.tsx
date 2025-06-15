
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Zap, Users, TrendingUp, Clock, CheckCircle2, AlertTriangle, Eye, Edit, Trash2 } from 'lucide-react';
import { RateioData } from '@/types/rateio';

interface RateioItemProps {
  rateio: RateioData;
  index: number;
}

const RateioItem: React.FC<RateioItemProps> = ({ rateio, index }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': 
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Concluído',
          bgGradient: 'from-emerald-50 to-green-50'
        };
      case 'processed': 
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="w-4 h-4" />,
          text: 'Processado',
          bgGradient: 'from-blue-50 to-indigo-50'
        };
      case 'pending': 
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          text: 'Pendente',
          bgGradient: 'from-amber-50 to-yellow-50'
        };
      default: 
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-4 h-4" />,
          text: status,
          bgGradient: 'from-gray-50 to-slate-50'
        };
    }
  };

  const statusConfig = getStatusConfig(rateio.status);

  return (
    <div 
      className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 group animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`p-4 bg-gradient-to-br ${statusConfig.bgGradient} rounded-xl group-hover:scale-105 transition-transform duration-300`}>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">
              Rateio {rateio.month}/{rateio.year}
            </h4>
            <p className="text-gray-600">
              Tipo: <span className="font-medium">{rateio.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'}</span>
            </p>
          </div>
          <Badge className={`${statusConfig.color} flex items-center space-x-2 px-4 py-2 shadow-sm`}>
            {statusConfig.icon}
            <span className="font-medium">{statusConfig.text}</span>
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Energia Esperada</span>
          </div>
          <p className="text-xl font-bold text-green-900">
            {(rateio.expectedGeneration || 0).toLocaleString('pt-BR')} kWh
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Assinantes</span>
          </div>
          <p className="text-xl font-bold text-blue-900">
            {rateio.subscribers.length} participantes
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">Valor Total</span>
          </div>
          <p className="text-xl font-bold text-purple-900">
            R$ {rateio.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-800">Status Atual</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 flex items-center">
            {statusConfig.icon}
            <span className="ml-2">{statusConfig.text}</span>
          </p>
        </div>
      </div>

      {rateio.notes && (
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="font-medium text-amber-800">Observações</span>
          </div>
          <p className="text-amber-700">{rateio.notes}</p>
        </div>
      )}
    </div>
  );
};

export default RateioItem;
