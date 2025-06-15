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
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden hover:scale-[1.02]">
      <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"></div>
      
      <CardHeader className="pb-3 bg-gradient-to-br from-gray-50 to-white px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                {subscriber.subscriber?.cpf ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Building2 className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-lg truncate mb-1.5">
                {getSubscriberName()}
              </h3>
              <div className="flex items-center gap-2">
                {getStatusBadge(subscriber.status)}
                <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 px-2 py-0.5">
                  {getSubscriberType()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3 pb-4 px-4">
        {/* Documento formatado */}
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-blue-600 font-medium mb-0.5">Documento</p>
            <p className="text-sm font-mono font-bold text-blue-800 truncate">{getSubscriberDocument()}</p>
          </div>
        </div>

        {/* Unidade Consumidora */}
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-green-600 font-medium mb-0.5">Unidade Consumidora</p>
            <p className="text-sm font-mono font-bold text-green-800 truncate">{getEnergyAccount()}</p>
          </div>
        </div>

        {/* Informações de Contato Compactas */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-md flex items-center justify-center">
              <Phone className="w-3 h-3 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-900 truncate">{contactInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-violet-100 rounded-md flex items-center justify-center">
              <Mail className="w-3 h-3 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-900 truncate">{contactInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-md flex items-center justify-center">
              <MapPin className="w-3 h-3 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-900 truncate">
                {contactInfo.city}
              </p>
            </div>
          </div>
        </div>

        {/* Plano Formatado */}
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-green-600 font-medium mb-0.5">Plano Contratado</p>
              <p className="text-sm font-bold text-green-800 truncate">{getPlanInfo()}</p>
            </div>
          </div>
        </div>

        {/* Actions - Redesigned */}
        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(subscriber);
            }}
            className="h-10 w-10 p-0 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105"
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subscriber);
            }}
            className="h-10 w-10 p-0 bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 border border-green-200 text-green-600 hover:text-green-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subscriber.id);
            }}
            className="h-10 w-10 p-0 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 text-red-600 hover:text-red-700 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriberCard;
