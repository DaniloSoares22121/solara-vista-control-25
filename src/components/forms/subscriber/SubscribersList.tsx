import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  User, 
  Building2,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberRecord } from '@/services/subscriberService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SubscribersListProps {
  onEdit?: (subscriber: SubscriberRecord) => void;
  onView?: (subscriber: SubscriberRecord) => void;
}

const SubscribersList = ({ onEdit, onView }: SubscribersListProps) => {
  const { subscribers, isLoading, deleteSubscriber } = useSubscribers();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (subscribers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum assinante cadastrado
          </h3>
          <p className="text-gray-600">
            Comece criando seu primeiro assinante no sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSubscriberName = (subscriber: SubscriberRecord) => {
    if (subscriber.subscriber?.fullName) {
      return subscriber.subscriber.fullName;
    }
    if (subscriber.subscriber?.companyName) {
      return subscriber.subscriber.companyName;
    }
    return 'Nome não informado';
  };

  const getSubscriberType = (subscriber: SubscriberRecord) => {
    return subscriber.subscriber?.fullName ? 'person' : 'company';
  };

  const getSubscriberContact = (subscriber: SubscriberRecord) => {
    return {
      phone: subscriber.subscriber?.phone || 'Não informado',
      email: subscriber.subscriber?.email || 'Não informado',
    };
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este assinante?')) {
      await deleteSubscriber(id);
    }
  };

  return (
    <div className="space-y-4">
      {subscribers.map((subscriber) => {
        const subscriberType = getSubscriberType(subscriber);
        const contact = getSubscriberContact(subscriber);
        
        return (
          <Card key={subscriber.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg
                      ${subscriberType === 'person' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                    `}>
                      {subscriberType === 'person' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getSubscriberName(subscriber)}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={subscriberType === 'person' ? 'default' : 'secondary'}>
                          {subscriberType === 'person' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </Badge>
                        <Badge variant={subscriber.status === 'active' ? 'default' : 'destructive'}>
                          {subscriber.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(subscriber.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  {/* Concessionária e UC */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {subscriber.concessionaria ? 
                          subscriber.concessionaria.replace('-', ' ').toUpperCase() : 
                          'Concessionária não informada'
                        }
                      </span>
                    </div>
                    {subscriber.energy_account?.uc && (
                      <div className="text-gray-600">
                        <span className="font-medium">UC:</span> {subscriber.energy_account.uc}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(subscriber)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(subscriber)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscribersList;
