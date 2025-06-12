
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import SubscriberCard from './SubscriberCard';

interface SubscribersTableProps {
  subscribers: SubscriberRecord[];
  onEdit: (subscriber: SubscriberRecord) => void;
  onDelete: (id: string) => void;
  onView: (subscriber: SubscriberRecord) => void;
  isLoading?: boolean;
}

const SubscribersTable = ({ subscribers, onEdit, onDelete, onView, isLoading }: SubscribersTableProps) => {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <CardTitle className="text-2xl font-bold flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <LoadingSpinner 
            size="lg" 
            text="Carregando assinantes..."
            className="py-16" 
          />
        </CardContent>
      </Card>
    );
  }

  if (subscribers.length === 0) {
    return (
      <Card className="border-0 shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <CardTitle className="text-2xl font-bold flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-green-200">
                  <Users className="h-20 w-20 text-green-600" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">0</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  Nenhum assinante cadastrado
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
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
    <div className="space-y-8">
      <Card className="border-0 shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <span>Lista de Assinantes</span>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg px-3 py-1">
                  {subscribers.length}
                </Badge>
              </CardTitle>
              <p className="text-green-100 text-base">
                Gerencie todos os assinantes cadastrados no sistema
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg px-6 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              Exportar Lista
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cards Grid - Responsividade Consistente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscribers.map((subscriber) => (
          <SubscriberCard
            key={subscriber.id}
            subscriber={subscriber}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscribersTable;
