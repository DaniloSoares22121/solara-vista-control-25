
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Trash2, Eye, Phone, Mail, Building2, User, FileText, Zap, Star, MapPin } from 'lucide-react';
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
        className: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md' 
      },
      inactive: { 
        label: 'Inativo', 
        className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-md' 
      },
      pending: { 
        label: 'Pendente', 
        className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md' 
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
      <Card className="border-0 shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <CardTitle className="text-2xl font-bold flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-green-200">
                  <Users className="h-20 w-20 text-green-600" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">0</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  Nenhum assinante cadastrado
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
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
    <div className="space-y-8">
      <Card className="border-0 shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <span>Lista de Assinantes</span>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg px-3 py-1">
                  {subscribers.length}
                </Badge>
              </CardTitle>
              <p className="text-green-100 text-base">
                Gerencie todos os assinantes cadastrados no sistema
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg px-6 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              Exportar Lista
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cards Grid - Melhorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subscribers.map((subscriber) => (
          <Card 
            key={subscriber.id}
            className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden hover:scale-105 hover:-translate-y-2"
          >
            {/* Header do Card com Gradiente */}
            <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"></div>
            
            <CardHeader className="pb-4 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-xl">
                      {subscriber.subscriber?.fullName ? (
                        <User className="w-8 h-8 text-white" />
                      ) : (
                        <Building2 className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-xl truncate mb-2">
                      {getSubscriberName(subscriber)}
                    </h3>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(subscriber.status)}
                      <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
                        {subscriber.subscriber?.fullName ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4 pb-6">
              {/* Unidade Consumidora */}
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-blue-600 font-medium mb-1">Unidade Consumidora</p>
                  <p className="text-sm font-mono font-bold text-blue-800 truncate">{getEnergyAccount(subscriber)}</p>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">{subscriber.subscriber?.phone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">{subscriber.subscriber?.email || 'Não informado'}</p>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">
                      {subscriber.subscriber?.address?.city || 'Cidade não informada'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plano */}
              <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-indigo-600 font-medium mb-1">Plano Contratado</p>
                    <p className="text-sm font-bold text-indigo-800 truncate">{getPlanInfo(subscriber)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleViewClick(e, subscriber)}
                  className="h-10 w-10 p-0 hover:bg-green-100 hover:text-green-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                  title="Visualizar"
                >
                  <Eye className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleEditClick(e, subscriber)}
                  className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                  title="Editar"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, subscriber.id)}
                  className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                  title="Excluir"
                >
                  <Trash2 className="h-5 w-5" />
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
