import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Building2, Mail, Phone, MapPin, FileText, Calendar, Zap, CreditCard, UserCheck, Shield } from 'lucide-react';
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
      active: { label: 'Ativo', className: 'bg-green-50 text-green-700 border-green-200 shadow-sm' },
      inactive: { label: 'Inativo', className: 'bg-gray-50 text-gray-600 border-gray-200 shadow-sm' },
      pending: { label: 'Pendente', className: 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm' },
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

  const isPersonalData = subscriberData?.fullName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] max-h-none p-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Header Redesenhado */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            
            <DialogHeader className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                    {isPersonalData ? (
                      <User className="w-10 h-10 text-white" />
                    ) : (
                      <Building2 className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-bold text-white mb-3">
                      {subscriberData?.fullName || subscriberData?.companyName || 'Nome não cadastrado'}
                    </DialogTitle>
                    <div className="flex items-center gap-4 flex-wrap">
                      {getStatusBadge(subscriber.status)}
                      <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                        {isPersonalData ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                      {subscriber.concessionaria && (
                        <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                          {subscriber.concessionaria}
                        </Badge>
                      )}
                    </div>
                    <p className="text-blue-100 mt-2 text-lg">
                      Membro desde {format(new Date(subscriber.created_at), 'MMMM yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="p-8 pb-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">
                      {planContract?.contractedKwh || planContract?.informedKwh || '0'} kWh
                    </p>
                    <p className="text-green-600 text-sm font-medium">Energia Contratada</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">
                      {planContract?.discountPercentage || '0'}%
                    </p>
                    <p className="text-blue-600 text-sm font-medium">Desconto Aplicado</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-700">
                      {planContract?.loyalty === 'none' ? 'Sem' : 
                       planContract?.loyalty === 'oneYear' ? '1 Ano' :
                       planContract?.loyalty === 'twoYears' ? '2 Anos' : 'Indefinido'}
                    </p>
                    <p className="text-purple-600 text-sm font-medium">Fidelidade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="px-8 pb-8 bg-gray-50">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Lado Esquerdo - Dados Pessoais/Empresa */}
              <div className="space-y-8">
                {/* Dados do Assinante */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        {isPersonalData ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Building2 className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className="text-blue-800 font-bold">
                        {isPersonalData ? 'Dados Pessoais' : 'Dados da Empresa'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          {isPersonalData ? 'Nome Completo' : 'Razão Social'}
                        </label>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {subscriberData?.fullName || subscriberData?.companyName || 'Não informado'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          {isPersonalData ? 'CPF' : 'CNPJ'}
                        </label>
                        <p className="text-lg font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {formatDocument(subscriberData?.cpf || subscriberData?.cnpj || '')}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg break-all">
                          {subscriberData?.email || 'Não informado'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Telefone
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {subscriberData?.phone || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    {subscriberData?.address && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Endereço
                          </label>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-base text-gray-900 leading-relaxed">
                              {`${subscriberData.address.street || ''}, ${subscriberData.address.number || ''}`}
                              {subscriberData.address.complement && ` - ${subscriberData.address.complement}`}
                              <br />
                              {`${subscriberData.address.neighborhood || ''}, ${subscriberData.address.city || ''} - ${subscriberData.address.state || ''}`}
                              {subscriberData.address.cep && (
                                <span className="block text-gray-600 mt-1">
                                  CEP: {subscriberData.address.cep}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Conta de Energia */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-b border-yellow-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-yellow-800 font-bold">Conta de Energia</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Unidade Consumidora (UC)
                        </label>
                        <p className="text-lg font-mono font-bold text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          {energyAccount?.uc || 'Não informado'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Titular da Conta
                        </label>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {energyAccount?.holderName || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        CPF/CNPJ do Titular
                      </label>
                      <p className="text-base font-mono text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {formatDocument(energyAccount?.cpfCnpj || '')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lado Direito - Plano e Sistema */}
              <div className="space-y-8">
                {/* Plano Contratado */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 border-b border-purple-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-purple-800 font-bold">Plano Contratado</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Plano Selecionado
                      </label>
                      <p className="text-lg font-medium text-gray-900 bg-purple-50 p-4 rounded-lg border border-purple-200">
                        {planContract?.selectedPlan || 'Não informado'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          kWh Informado
                        </label>
                        <p className="text-lg font-bold text-gray-900 bg-gray-50 p-3 rounded-lg text-center">
                          {planContract?.informedKwh ? `${planContract.informedKwh} kWh` : 'Não informado'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          kWh Contratado
                        </label>
                        <p className="text-lg font-bold text-green-700 bg-green-50 p-3 rounded-lg text-center border border-green-200">
                          {planContract?.contractedKwh ? `${planContract.contractedKwh} kWh` : 'Não informado'}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Período de Fidelidade
                        </label>
                        <p className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded-lg text-center">
                          {planContract?.loyalty === 'none' ? 'Sem Fidelidade' : 
                           planContract?.loyalty === 'oneYear' ? '1 Ano' :
                           planContract?.loyalty === 'twoYears' ? '2 Anos' : 'Não informado'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Desconto Aplicado
                        </label>
                        <p className="text-lg font-bold text-blue-700 bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                          {planContract?.discountPercentage ? `${planContract.discountPercentage}%` : 'Não informado'}
                        </p>
                      </div>
                    </div>

                    {planContract?.adhesionDate && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Data de Adesão
                          </label>
                          <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {format(new Date(planContract.adhesionDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Informações do Sistema */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b border-gray-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-bold">Informações do Sistema</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Concessionária
                      </label>
                      <p className="text-lg font-medium text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {subscriber.concessionaria || 'Não informado'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Data de Cadastro
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {format(new Date(subscriber.created_at), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                      
                      {subscriber.updated_at !== subscriber.created_at && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Última Atualização
                          </label>
                          <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {format(new Date(subscriber.updated_at), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Status da Conta
                      </label>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(subscriber.status)}
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriberViewModal;
