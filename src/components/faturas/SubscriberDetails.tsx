
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Building2, Zap, Percent, Calendar, FileText } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

interface SubscriberDetailsProps {
  subscriber: SubscriberRecord;
}

export function SubscriberDetails({ subscriber }: SubscriberDetailsProps) {
  const subscriberData = subscriber.subscriber;
  const energyAccount = subscriber.energy_account;
  const planContract = subscriber.plan_contract;
  const planDetails = subscriber.plan_details;
  const isCompany = subscriberData?.cnpj;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Dados do Assinante</h3>
        <p className="text-muted-foreground">
          Verifique os dados e descontos do assinante selecionado
        </p>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isCompany ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="font-medium">
                {subscriberData?.fullName || subscriberData?.companyName || 'Não informado'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {isCompany ? 'CNPJ' : 'CPF'}
              </label>
              <p className="font-medium">
                {subscriberData?.cpf || subscriberData?.cnpj || 'Não informado'}
              </p>
            </div>
            {isCompany && subscriberData?.fantasyName && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome Fantasia</label>
                <p className="font-medium">{subscriberData.fantasyName}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <Badge variant={isCompany ? "default" : "secondary"}>
                {isCompany ? 'Pessoa Jurídica' : 'Pessoa Física'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conta de Energia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Conta de Energia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">UC (Unidade Consumidora)</label>
              <p className="font-medium">{energyAccount?.uc || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Número do Sócio</label>
              <p className="font-medium">{energyAccount?.partnerNumber || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Titular da Conta</label>
              <p className="font-medium">{energyAccount?.holderName || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo do Titular</label>
              <Badge variant="outline">
                {energyAccount?.holderType === 'person' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano Contratado e Descontos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Plano e Descontos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plano Selecionado</label>
              <p className="font-medium">{planContract?.selectedPlan || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Modo de Compensação</label>
              <Badge variant="outline">
                {planContract?.compensationMode === 'autoConsumption' ? 'Autoconsumo' : 'Geração Compartilhada'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">KWh Informado</label>
              <p className="font-medium">{planContract?.informedKwh || 0} kWh</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">KWh Contratado</label>
              <p className="font-medium">{planContract?.contractedKwh || 0} kWh</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Percentual de Desconto</label>
              <Badge variant="default" className="text-lg">
                {planContract?.discountPercentage || 0}%
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fidelidade</label>
              <Badge variant="outline">
                {planContract?.loyalty === 'none' ? 'Sem fidelidade' : 
                 planContract?.loyalty === 'oneYear' ? '1 ano' : '2 anos'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Data de Adesão</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {planContract?.adhesionDate ? formatDate(planContract.adhesionDate) : 'Não informado'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Plano */}
      {planDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes do Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Paga PIS e COFINS</span>
                <Badge variant={planDetails.paysPisAndCofins ? "default" : "secondary"}>
                  {planDetails.paysPisAndCofins ? 'Sim' : 'Não'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Paga Fio B</span>
                <Badge variant={planDetails.paysWireB ? "default" : "secondary"}>
                  {planDetails.paysWireB ? 'Sim' : 'Não'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Adiciona Valor Distribuidora</span>
                <Badge variant={planDetails.addDistributorValue ? "default" : "secondary"}>
                  {planDetails.addDistributorValue ? 'Sim' : 'Não'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Isento de Pagamento</span>
                <Badge variant={planDetails.exemptFromPayment ? "default" : "secondary"}>
                  {planDetails.exemptFromPayment ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
