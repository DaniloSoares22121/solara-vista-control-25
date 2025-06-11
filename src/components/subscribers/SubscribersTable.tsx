
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SubscribersTableProps {
  subscribers: SubscriberRecord[];
  onEdit: (subscriber: SubscriberRecord) => void;
  onDelete: (id: string) => void;
  onView: (subscriber: SubscriberRecord) => void;
}

const SubscribersTable = ({ subscribers, onEdit, onDelete, onView }: SubscribersTableProps) => {
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
    return subscriber.subscriber?.fullName ? 'Pessoa Física' : 'Pessoa Jurídica';
  };

  const getSubscriberDocument = (subscriber: SubscriberRecord) => {
    if (subscriber.subscriber?.cpf) {
      return subscriber.subscriber.cpf;
    }
    if (subscriber.subscriber?.cnpj) {
      return subscriber.subscriber.cnpj;
    }
    return 'Não informado';
  };

  const getSubscriberContact = (subscriber: SubscriberRecord) => {
    return subscriber.subscriber?.email || subscriber.subscriber?.phone || 'Não informado';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      pending: { label: 'Pendente', variant: 'outline' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (subscribers.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-50">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-green-700 bg-clip-text text-transparent">
                  Nenhum assinante cadastrado
                </h3>
                <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Comece criando seu primeiro assinante no sistema.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Lista de Assinantes ({subscribers.length})</span>
            </CardTitle>
            <p className="text-gray-600 mt-1 text-sm">
              Gerencie todos os assinantes cadastrados no sistema
            </p>
          </div>
          <Button 
            variant="outline" 
            className="text-green-600 border-green-200 hover:bg-green-50 w-fit"
          >
            Exportar Lista
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-700">Documento</TableHead>
                <TableHead className="font-semibold text-gray-700">Contato</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Criado em</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id} className="hover:bg-green-50/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getSubscriberName(subscriber)}</p>
                        <p className="text-sm text-gray-500">{subscriber.concessionaria || 'Concessionária não informada'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{getSubscriberType(subscriber)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-700">{getSubscriberDocument(subscriber)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {subscriber.subscriber?.email && <Mail className="w-3 h-3 text-gray-400" />}
                      {subscriber.subscriber?.phone && <Phone className="w-3 h-3 text-gray-400" />}
                      <span className="text-sm text-gray-600 truncate max-w-[150px]">
                        {getSubscriberContact(subscriber)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(subscriber.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {format(new Date(subscriber.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(subscriber)}
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(subscriber)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(subscriber.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscribersTable;
