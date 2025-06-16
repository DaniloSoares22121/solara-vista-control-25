
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Zap } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SubscriberSelectorProps {
  selectedSubscriber: SubscriberRecord | null;
  onSubscriberSelect: (subscriber: SubscriberRecord) => void;
}

const SubscriberSelector = ({ selectedSubscriber, onSubscriberSelect }: SubscriberSelectorProps) => {
  const { subscribers, isLoading } = useSubscribers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner text="Carregando assinantes..." />
      </div>
    );
  }

  const getSubscriberDisplayName = (subscriber: SubscriberRecord) => {
    const subscriberData = subscriber.subscriber as any;
    const energyAccount = subscriber.energy_account as any;
    
    if (subscriberData?.fullName) {
      return subscriberData.fullName;
    }
    if (subscriberData?.companyName) {
      return subscriberData.companyName;
    }
    if (energyAccount?.holderName) {
      return energyAccount.holderName;
    }
    return 'Assinante sem nome';
  };

  const getSubscriberType = (subscriber: SubscriberRecord) => {
    const subscriberData = subscriber.subscriber as any;
    if (subscriberData?.cpf) return 'Pessoa Física';
    if (subscriberData?.cnpj) return 'Pessoa Jurídica';
    return 'Não identificado';
  };

  const getSubscriberUC = (subscriber: SubscriberRecord) => {
    const energyAccount = subscriber.energy_account as any;
    return energyAccount?.uc || 'UC não informada';
  };

  return (
    <div className="space-y-4">
      <Select
        value={selectedSubscriber?.id || ''}
        onValueChange={(value) => {
          const subscriber = subscribers.find(s => s.id === value);
          if (subscriber) {
            onSubscriberSelect(subscriber);
          }
        }}
      >
        <SelectTrigger className="w-full h-12 text-left">
          <SelectValue placeholder="Selecione um assinante..." />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {subscribers.map((subscriber) => {
            const displayName = getSubscriberDisplayName(subscriber);
            const type = getSubscriberType(subscriber);
            const uc = getSubscriberUC(subscriber);
            
            return (
              <SelectItem key={subscriber.id} value={subscriber.id} className="p-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0">
                    {type === 'Pessoa Física' ? (
                      <User className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Building2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {displayName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {uc}
                      </span>
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedSubscriber && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                Selecionado
              </Badge>
              <span className="font-medium text-green-800">
                {getSubscriberDisplayName(selectedSubscriber)}
              </span>
              <span className="text-green-600">
                ({getSubscriberType(selectedSubscriber)})
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriberSelector;
