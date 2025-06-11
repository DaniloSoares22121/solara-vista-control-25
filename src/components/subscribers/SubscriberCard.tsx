
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Zap, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import { SubscriberFormData } from '@/types/subscriber';
import SubscriberDetails from './SubscriberDetails';

interface SubscriberCardProps {
  subscriber: SubscriberFormData & { id: string };
  onEdit: (subscriber: SubscriberFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

const SubscriberCard = ({ subscriber, onEdit, onDelete }: SubscriberCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatModalidade = (modalidade: string) => {
    return modalidade === 'autoconsumo' ? 'Autoconsumo Remoto' : 'Geração Compartilhada';
  };

  const getModalidadeBadgeColor = (modalidade: string) => {
    return modalidade === 'autoconsumo' 
      ? 'bg-blue-100 text-blue-700 border-blue-200' 
      : 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {subscriber.subscriber.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  UC: {subscriber.energyAccount.originalAccount.uc}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={getModalidadeBadgeColor(subscriber.planContract.modalidadeCompensacao)}
          >
            {formatModalidade(subscriber.planContract.modalidadeCompensacao)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Informações de Contato */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{subscriber.subscriber.telefone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900 truncate">{subscriber.subscriber.email}</span>
          </div>
        </div>

        {/* Dados do Plano */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Plano</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {subscriber.planContract.kwhContratado.toLocaleString()} kWh/mês
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Desde</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {formatDate(subscriber.planContract.dataAdesao)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Desconto</span>
            <span className="text-sm font-bold text-green-600">
              {subscriber.planContract.desconto}%
            </span>
          </div>
        </div>

        {/* Endereço */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-gray-500">Endereço:</span>
              <p className="text-sm text-gray-900 leading-relaxed">
                {subscriber.subscriber.address.endereco}, {subscriber.subscriber.address.numero}
                {subscriber.subscriber.address.complemento && `, ${subscriber.subscriber.address.complemento}`}
                <br />
                {subscriber.subscriber.address.bairro}, {subscriber.subscriber.address.cidade}/{subscriber.subscriber.address.estado}
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="border-t border-gray-100 pt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <SubscriberDetails 
            subscriber={subscriber}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(subscriber)}
            className="hover:bg-blue-50 hover:border-blue-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(subscriber.id)}
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriberCard;
