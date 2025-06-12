
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Building2, Mail, Phone, MapPin, FileText, Calendar, Zap } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SubscriberViewModalProps {
  subscriber: SubscriberRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriberViewModal = ({ subscriber, isOpen, onClose }: SubscriberViewModalProps) => {
  if (!subscriber) return null;

  const subscriberData = subscriber.subscriber;
  const energyAccount = subscriber.energy_account;
  const planContract = subscriber.plan_contract;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800 border-green-300' },
      inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-800 border-gray-300' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDocument = (doc: string) => {
    if (!doc) return 'Não informado';
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (doc.length === 14) {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto fixed right-8 top-1/2 -translate-y-1/2 left-auto translate-x-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
              {subscriberData?.fullName ? (
                <User className="w-6 h-6 text-green-600" />
              ) : (
                <Building2 className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <span>{subscriberData?.fullName || subscriberData?.companyName || 'Nome não cadastrado'}</span>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(subscriber.status)}
                <Badge variant="outline" className="text-xs">
                  {subscriberData?.fullName ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-blue-600" />
                Dados do Assinante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome/Razão Social</label>
                <p className="text-sm text-gray-900 mt-1">
                  {subscriberData?.fullName || subscriberData?.companyName || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Documento</label>
                <p className="text-sm font-mono text-gray-900 mt-1">
                  {formatDocument(subscriberData?.cpf || subscriberData?.cnpj || '')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{subscriberData?.email || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefone
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{subscriberData?.phone || 'Não informado'}</p>
                </div>
              </div>
              {subscriberData?.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Endereço
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {`${subscriberData.address.street || ''}, ${subscriberData.address.number || ''} - ${subscriberData.address.neighborhood || ''}, ${subscriberData.address.city || ''} - ${subscriberData.address.state || ''}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conta de Energia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                Conta de Energia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Unidade Consumidora (UC)</label>
                <p className="text-sm font-mono text-gray-900 mt-1">
                  {energyAccount?.uc || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Titular da Conta</label>
                <p className="text-sm text-gray-900 mt-1">
                  {energyAccount?.holderName || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">CPF/CNPJ do Titular</label>
                <p className="text-sm font-mono text-gray-900 mt-1">
                  {formatDocument(energyAccount?.cpfCnpj || '')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plano Contratado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-purple-600" />
                Plano Contratado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Plano Selecionado</label>
                <p className="text-sm text-gray-900 mt-1">
                  {planContract?.selectedPlan || 'Não informado'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">kWh Informado</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {planContract?.informedKwh ? `${planContract.informedKwh} kWh` : 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">kWh Contratado</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {planContract?.contractedKwh ? `${planContract.contractedKwh} kWh` : 'Não informado'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Fidelidade</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {planContract?.loyalty === 'none' ? 'Sem Fidelidade' : 
                     planContract?.loyalty === 'oneYear' ? '1 Ano' :
                     planContract?.loyalty === 'twoYears' ? '2 Anos' : 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Desconto</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {planContract?.discountPercentage ? `${planContract.discountPercentage}%` : 'Não informado'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Concessionária</label>
                <p className="text-sm text-gray-900 mt-1">
                  {subscriber.concessionaria || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                <p className="text-sm text-gray-900 mt-1">
                  {format(new Date(subscriber.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              {subscriber.updated_at !== subscriber.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Última Atualização</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(subscriber.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriberViewModal;
