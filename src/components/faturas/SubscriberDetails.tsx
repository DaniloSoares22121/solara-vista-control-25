
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Zap, CreditCard, Calendar, Percent, Clock } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

interface SubscriberDetailsProps {
  subscriber: SubscriberRecord;
}

const SubscriberDetails = ({ subscriber }: SubscriberDetailsProps) => {
  const subscriberData = subscriber.subscriber as any;
  const energyAccount = subscriber.energy_account as any;
  const planContract = subscriber.plan_contract as any;
  const planDetails = subscriber.plan_details as any;

  const getSubscriberInfo = () => {
    if (subscriberData?.cpf) {
      return {
        type: 'Pessoa Física',
        document: subscriberData.cpf,
        name: subscriberData.fullName || 'Nome não informado',
        icon: User
      };
    }
    if (subscriberData?.cnpj) {
      return {
        type: 'Pessoa Jurídica',
        document: subscriberData.cnpj,
        name: subscriberData.companyName || subscriberData.fantasyName || 'Nome não informado',
        icon: Building2
      };
    }
    return {
      type: 'Não identificado',
      document: 'Não informado',
      name: 'Nome não informado',
      icon: User
    };
  };

  const info = getSubscriberInfo();
  const Icon = info.icon;

  const formatLoyalty = (loyalty: string) => {
    switch (loyalty) {
      case 'none': return 'Sem Fidelidade';
      case 'oneYear': return '12 Meses';
      case 'twoYears': return '24 Meses';
      default: return 'Não informado';
    }
  };

  const formatCompensationMode = (mode: string) => {
    switch (mode) {
      case 'autoConsumption': return 'Autoconsumo Remoto';
      case 'sharedGeneration': return 'Geração Compartilhada';
      default: return 'Não informado';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações Básicas */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="w-5 h-5 text-blue-600" />
            Dados do Assinante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tipo:</span>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {info.type}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Nome:</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {info.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Documento:</span>
            <span className="font-mono text-sm">{info.document}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Concessionária:</span>
            <span className="font-medium">{subscriber.concessionaria || 'Não informada'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Conta de Energia */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-5 h-5 text-yellow-600" />
            Conta de Energia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">UC:</span>
            <span className="font-mono text-sm font-medium">
              {energyAccount?.uc || 'Não informada'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Titular:</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {energyAccount?.holderName || 'Não informado'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">CPF/CNPJ:</span>
            <span className="font-mono text-sm">
              {energyAccount?.cpfCnpj || 'Não informado'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Endereço:</span>
            <span className="text-right max-w-[200px] truncate text-sm">
              {energyAccount?.address?.street && energyAccount?.address?.number 
                ? `${energyAccount.address.street}, ${energyAccount.address.number}`
                : 'Não informado'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Plano Contratado */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="w-5 h-5 text-green-600" />
            Plano Contratado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plano:</span>
            <Badge variant="outline" className="text-green-700 border-green-300 capitalize">
              {planContract?.selectedPlan || 'Não informado'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">kWh Contratado:</span>
            <span className="font-medium">
              {planContract?.contractedKwh || 0} kWh
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Modalidade:</span>
            <span className="text-sm text-right max-w-[150px]">
              {formatCompensationMode(planContract?.compensationMode)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Fidelidade:</span>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              {formatLoyalty(planContract?.loyalty)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Desconto e Detalhes */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Percent className="w-5 h-5 text-purple-600" />
            Desconto e Datas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Desconto:</span>
            <Badge variant="outline" className="text-purple-700 border-purple-300 font-bold">
              {planContract?.discountPercentage || 0}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Data de Adesão:</span>
            <span className="font-medium">
              {planContract?.adhesionDate ? 
                new Date(planContract.adhesionDate).toLocaleDateString('pt-BR') : 
                'Não informada'
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">kWh Informado:</span>
            <span className="font-medium">
              {planContract?.informedKwh || 0} kWh
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge variant="outline" className="text-green-700 border-green-300 capitalize">
              {subscriber.status || 'Ativo'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriberDetails;
