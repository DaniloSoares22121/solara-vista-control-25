
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
import { Users, Edit, Trash2, Eye, Phone, Mail, Building2, User, FileText, MapPin } from 'lucide-react';
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
    return 'Nome não cadastrado';
  };

  const getSubscriberType = (subscriber: SubscriberRecord) => {
    return subscriber.subscriber?.fullName ? 'Pessoa Física' : 'Pessoa Jurídica';
  };

  const getSubscriberDocument = (subscriber: SubscriberRecord) => {
    if (subscriber.subscriber?.cpf) {
      return subscriber.subscriber.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (subscriber.subscriber?.cnpj) {
      return subscriber.subscriber.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return 'Documento não cadastrado';
  };

  const getSubscriberContact = (subscriber: SubscriberRecord) => {
    const email = subscriber.subscriber?.email;
    const phone = subscriber.subscriber?.phone;
    
    if (email && phone) {
      return { type: 'both', email, phone };
    } else if (email) {
      return { type: 'email', email };
    } else if (phone) {
      return { type: 'phone', phone };
    }
    return { type: 'none' };
  };

  const getSubscriberAddress = (subscriber: SubscriberRecord) => {
    const address = subscriber.subscriber?.address;
    if (address?.city && address?.state) {
      return `${address.city} - ${address.state}`;
    }
    return 'Endereço não cadastrado';
  };

  const getEnergyAccount = (subscriber: SubscriberRecord) => {
    const account = subscriber.energy_account;
    if (account?.accountNumber) {
      return account.accountNumber;
    }
    return 'Conta não cadastrada';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { 
        label: 'Ativo', 
        className: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' 
      },
      inactive: { 
        label: 'Inativo', 
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300' 
      },
      pending: { 
        label: 'Pendente', 
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (subscribers.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md">
        <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Nenhum assinante cadastrado
                </h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  Comece criando seu primeiro assinante no sistema para gerenciar contratos de energia solar.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md">
      <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span>Lista de Assinantes</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                {subscribers.length}
              </Badge>
            </CardTitle>
            <p className="text-gray-600 mt-2 text-sm">
              Gerencie todos os assinantes cadastrados no sistema
            </p>
          </div>
          <Button 
            variant="outline" 
            className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar Lista
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-50 hover:from-gray-100 hover:to-gray-100">
                <TableHead className="font-semibold text-gray-700 py-4">Assinante</TableHead>
                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-700">Documento</TableHead>
                <TableHead className="font-semibold text-gray-700">Contato</TableHead>
                <TableHead className="font-semibold text-gray-700">Localização</TableHead>
                <TableHead className="font-semibold text-gray-700">Conta Energia</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Criado em</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber, index) => {
                const contact = getSubscriberContact(subscriber);
                const isEven = index % 2 === 0;
                
                return (
                  <TableRow 
                    key={subscriber.id} 
                    className={`hover:bg-green-50/50 transition-all duration-200 ${
                      isEven ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          {subscriber.subscriber?.fullName ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Building2 className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{getSubscriberName(subscriber)}</p>
                          <p className="text-sm text-gray-500">
                            {subscriber.concessionaria || 'Concessionária não informada'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {subscriber.subscriber?.fullName ? (
                          <User className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Building2 className="w-4 h-4 text-purple-500" />
                        )}
                        <span className="text-sm text-gray-600">{getSubscriberType(subscriber)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {getSubscriberDocument(subscriber)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {contact.type === 'both' && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600 truncate max-w-[120px]">{contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{contact.phone}</span>
                            </div>
                          </>
                        )}
                        {contact.type === 'email' && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600 truncate max-w-[120px]">{contact.email}</span>
                          </div>
                        )}
                        {contact.type === 'phone' && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.phone}</span>
                          </div>
                        )}
                        {contact.type === 'none' && (
                          <span className="text-sm text-gray-400 italic">Contato não cadastrado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{getSubscriberAddress(subscriber)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono text-gray-700 bg-blue-50 px-2 py-1 rounded">
                        {getEnergyAccount(subscriber)}
                      </span>
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
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(subscriber)}
                          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(subscriber)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(subscriber.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscribersTable;
