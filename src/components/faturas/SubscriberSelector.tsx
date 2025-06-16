
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Building2 } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SubscriberSelectorProps {
  onSelect: (subscriber: SubscriberRecord) => void;
}

export function SubscriberSelector({ onSelect }: SubscriberSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { subscribers, isLoading, error } = useSubscribers();

  const filteredSubscribers = subscribers.filter(subscriber => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const subscriberData = subscriber.subscriber;
    const energyAccount = subscriber.energy_account;
    
    // Buscar por nome, CPF/CNPJ, UC
    const name = subscriberData?.fullName || subscriberData?.companyName || '';
    const document = subscriberData?.cpf || subscriberData?.cnpj || '';
    const uc = energyAccount?.uc || '';
    
    return (
      name.toLowerCase().includes(searchLower) ||
      document.includes(searchTerm) ||
      uc.includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Carregando assinantes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Erro ao carregar assinantes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Assinante</h3>
        <p className="text-muted-foreground">
          Escolha o assinante para processar a fatura manual
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CPF/CNPJ ou UC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subscribers List */}
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {filteredSubscribers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum assinante encontrado' : 'Nenhum assinante cadastrado'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubscribers.map((subscriber) => {
            const subscriberData = subscriber.subscriber;
            const energyAccount = subscriber.energy_account;
            const isCompany = subscriberData?.cnpj;
            
            return (
              <Card key={subscriber.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {isCompany ? (
                          <Building2 className="h-8 w-8 text-blue-600" />
                        ) : (
                          <User className="h-8 w-8 text-green-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold">
                          {subscriberData?.fullName || subscriberData?.companyName || 'Nome não informado'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {isCompany ? 'Empresa' : 'Pessoa Física'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            UC: {energyAccount?.uc || 'N/A'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {subscriberData?.cpf || subscriberData?.cnpj || 'Documento não informado'}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => onSelect(subscriber)}>
                      Selecionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
