
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
        className: 'bg-green-500 text-white border-0 shadow-sm' 
      },
      inactive: { 
        label: 'Inativo', 
        className: 'bg-gray-400 text-white border-0 shadow-sm' 
      },
      pending: { 
        label: 'Pendente', 
        className: 'bg-yellow-500 text-white border-0 shadow-sm' 
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
    <Card className="group hover:shadow-lg transition-all duration-300 border bg-white overflow-hidden">
      {/* Header com informações principais */}
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar e info principal */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
                {subscriber.subscriber?.cpf ? (
                  <User className="w-8 h-8 text-white" />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
            </div>
            
            {/* Nome e badges */}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-lg truncate mb-2">
                {getSubscriberName()}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(subscriber.status)}
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                  {getSubscriberType()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Informações organizadas em seções */}
        <div className="space-y-4">
          
          {/* Seção: Dados Identificação */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-1">
              Identificação
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-blue-600 font-medium">Documento</p>
                  <p className="text-sm font-mono font-semibold text-blue-800 truncate">
                    {getSubscriberDocument()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-green-600 font-medium">UC</p>
                  <p className="text-sm font-mono font-semibold text-green-800 truncate">
                    {getEnergyAccount()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Plano e Contato */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Plano */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Plano</h4>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                  <p className="text-sm font-semibold text-purple-800 truncate">
                    {getPlanInfo()}
                  </p>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Localização</h4>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  <p className="text-sm font-semibold text-orange-800 truncate">
                    {contactInfo.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Contato */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-1">
              Contato
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{contactInfo.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{contactInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(subscriber);
            }}
            className="h-9 px-3 hover:bg-green-50 hover:text-green-700 transition-colors rounded-lg border border-green-200"
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Ver</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subscriber);
            }}
            className="h-9 px-3 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg border border-blue-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subscriber.id);
            }}
            className="h-9 px-3 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg border border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Excluir</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriberCard;
