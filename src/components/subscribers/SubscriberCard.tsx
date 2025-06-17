
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { formatCpfCnpj, formatPhone, formatKwh } from '@/utils/formatters';
import {
  Users, Edit, Trash2, Eye, Phone, Mail, Building2, User, FileText, 
  Zap, Star, MapPin, CheckCircle2
} from 'lucide-react';

interface SubscriberCardProps {
  subscriber: SubscriberRecord;
  onEdit: (subscriber: SubscriberRecord) => void;
  onDelete: (id: string) => void;
  onView: (subscriber: SubscriberRecord) => void;
}

const SubscriberCard = ({ subscriber, onEdit, onDelete, onView }: SubscriberCardProps) => {
  const getSubscriberName = () => {
    const subscriberData = subscriber.subscriber;
    return subscriberData?.fullName || subscriberData?.companyName || subscriberData?.razaoSocial || 'Nome não cadastrado';
  };

  const getSubscriberDocument = () => {
    const subscriberData = subscriber.subscriber;
    const document = subscriberData?.cpf || subscriberData?.cnpj || '';
    return formatCpfCnpj(document);
  };

  const getEnergyAccount = () => {
    const account = subscriber.energy_account;
    return account?.uc || 'UC não cadastrada';
  };

  const getPlanInfo = () => {
    const plan = subscriber.plan_contract;
    if (plan?.contractedKwh) {
      return formatKwh(plan.contractedKwh);
    }
    return 'Plano não cadastrado';
  };

  const getSubscriberType = () => {
    const subscriberData = subscriber.subscriber;
    
    if (subscriberData?.cnpj || subscriberData?.companyName || subscriberData?.razaoSocial) {
      return 'Pessoa Jurídica';
    }
    if (subscriberData?.cpf || subscriberData?.fullName) {
      return 'Pessoa Física';
    }
    
    const energyAccount = subscriber.energy_account;
    if (energyAccount?.holderType === 'company') {
      return 'Pessoa Jurídica';
    }
    
    return 'Pessoa Física';
  };

  const getContactInfo = () => {
    const subscriberData = subscriber.subscriber;
    return {
      phone: formatPhone(subscriberData?.phone || ''),
      email: subscriberData?.email || 'Não informado',
      city: subscriberData?.address?.city || 'Cidade não informada'
    };
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

  const contactInfo = getContactInfo();

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden hover:scale-102 hover:-translate-y-1">
      <div className="h-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"></div>
      
      <CardHeader className="pb-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center space-x-6 flex-1 min-w-0">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-xl">
                {subscriber.subscriber?.cpf ? (
                  <User className="w-10 h-10 text-white" />
                ) : (
                  <Building2 className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-2xl truncate mb-3">
                {getSubscriberName()}
              </h3>
              <div className="flex items-center gap-4">
                {getStatusBadge(subscriber.status)}
                <Badge variant="outline" className="text-sm font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 px-3 py-1">
                  {getSubscriberType()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-6 pb-8">
        {/* Grid Layout para melhor organização */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Coluna Esquerda - Dados Principais */}
          <div className="space-y-5">
            {/* Documento formatado */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-blue-600 font-semibold mb-1">Documento</p>
                <p className="text-lg font-mono font-bold text-blue-800 truncate">{getSubscriberDocument()}</p>
              </div>
            </div>

            {/* Unidade Consumidora */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-green-600 font-semibold mb-1">Unidade Consumidora</p>
                <p className="text-lg font-mono font-bold text-green-800 truncate">{getEnergyAccount()}</p>
              </div>
            </div>

            {/* Plano Contratado */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-purple-600 font-semibold mb-1">Plano Contratado</p>
                <p className="text-lg font-bold text-purple-800 truncate">{getPlanInfo()}</p>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Informações de Contato */}
          <div className="space-y-5">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h4>
              
              <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Telefone</p>
                  <p className="text-sm text-gray-900 font-medium truncate">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">E-mail</p>
                  <p className="text-sm text-gray-900 font-medium truncate">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Cidade</p>
                  <p className="text-sm text-gray-900 font-medium truncate">{contactInfo.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Mais espaçadas e visíveis */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(subscriber);
            }}
            className="h-12 px-4 hover:bg-green-100 hover:text-green-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border border-green-200"
            title="Visualizar"
          >
            <Eye className="h-5 w-5 mr-2" />
            <span className="font-medium">Visualizar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subscriber);
            }}
            className="h-12 px-4 hover:bg-green-100 hover:text-green-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border border-green-200"
            title="Editar"
          >
            <Edit className="h-5 w-5 mr-2" />
            <span className="font-medium">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subscriber.id);
            }}
            className="h-12 px-4 hover:bg-red-100 hover:text-red-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border border-red-200"
            title="Excluir"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            <span className="font-medium">Excluir</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriberCard;
