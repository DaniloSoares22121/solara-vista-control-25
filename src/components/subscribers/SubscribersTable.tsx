
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Trash2, Eye, Phone, Mail, Building2, User, FileText, Zap } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SubscribersTableProps {
  subscribers: SubscriberRecord[];
  onEdit: (subscriber: SubscriberRecord) => void;
  onDelete: (id: string) => void;
  onView: (subscriber: SubscriberRecord) => void;
}

const SubscribersTable = ({ subscribers, onEdit, onDelete, onView }: SubscribersTableProps) => {
  const getSubscriberName = (subscriber: SubscriberRecord) => {
    if (subscriber.subscriber?.fullName) {
      return subscriber.subscriber.fullName;
    }
    if (subscriber.subscriber?.companyName) {
      return subscriber.subscriber.companyName;
    }
    return 'Nome não cadastrado';
  };

  const getEnergyAccount = (subscriber: SubscriberRecord) => {
    const account = subscriber.energy_account;
    if (account?.uc) {
      return account.uc;
    }
    return 'UC não cadastrada';
  };

  const getPlanInfo = (subscriber: SubscriberRecord) => {
    const plan = subscriber.plan_contract;
    if (plan?.informedKwh) {
      return `${plan.informedKwh} kWh/mês`;
    }
    return 'Plano não cadastrado';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { 
        label: 'Ativo', 
        className: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' 
      },
      inactive: { 
        label: 'Inativo', 
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300' 
      },
      pending: { 
        label: 'Pendente', 
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleViewClick = (e: React.MouseEvent, subscriber: SubscriberRecord) => {
    e.stopPropagation();
    console.log('Clicando no olho para visualizar:', subscriber);
    onView(subscriber);
  };

  const handleEditClick = (e: React.MouseEvent, subscriber: SubscriberRecord) => {
    e.stopPropagation();
    console.log('Clicando para editar:', subscriber);
    onEdit(subscriber);
  };

  const handleDeleteClick = (e: React.MouseEvent, subscriberId: string) => {
    e.stopPropagation();
    console.log('Clicando para deletar ID:', subscriberId);
    onDelete(subscriberId);
  };

  if (subscribers.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md">
        <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Nenhum assinante cadastrado
                </h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  Comece criando seu primeiro assinante no sistema para gerenciar contratos de energia solar.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md">
        <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <span>Lista de Assinantes</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                  {subscribers.length}
                </Badge>
              </CardTitle>
              <p className="text-gray-600 mt-2 text-sm">
                Gerencie todos os assinantes cadastrados no sistema
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar Lista
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscribers.map((subscriber) => (
          <Card 
            key={subscriber.id}
            className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-md hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    {subscriber.subscriber?.fullName ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Building2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {getSubscriberName(subscriber)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(subscriber.status)}
                      <Badge variant="outline" className="text-xs">
                        {subscriber.subscriber?.fullName ? 'PF' : 'PJ'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              {/* Unidade Consumidora */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-mono text-gray-900 truncate">{getEnergyAccount(subscriber)}</p>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 truncate">{subscriber.subscriber?.phone || 'Não informado'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 truncate">{subscriber.subscriber?.email || 'Não informado'}</p>
                </div>
              </div>

              {/* Plano */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{getPlanInfo(subscriber)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-1 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleViewClick(e, subscriber)}
                  className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700 transition-colors"
                  title="Visualizar"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleEditClick(e, subscriber)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, subscriber.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscribersTable;
