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
      <Card className="border-0 shadow-xl lg:shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <CardTitle className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3">
            <div className="p-2 lg:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 lg:p-12">
          <LoadingSpinner 
            size="lg" 
            text="Carregando assinantes..."
            className="py-8 lg:py-16" 
          />
        </CardContent>
      </Card>
    );
  }

  if (subscribers.length === 0) {
    return (
      <Card className="border-0 shadow-xl lg:shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <CardTitle className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3">
            <div className="p-2 lg:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <span>Lista de Assinantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 lg:p-12">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4 lg:space-y-8">
              <div className="relative">
                <div className="w-24 h-24 lg:w-40 lg:h-40 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto shadow-xl lg:shadow-2xl border border-green-200">
                  <Users className="h-12 w-12 lg:h-20 lg:w-20 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm lg:text-lg font-bold">0</span>
                </div>
              </div>
              <div className="space-y-2 lg:space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Nenhum assinante cadastrado
                </h3>
                <p className="text-gray-600 max-w-sm lg:max-w-lg mx-auto text-base lg:text-lg leading-relaxed px-4">
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
    <div className="space-y-4 lg:space-y-8">
      <Card className="border-0 shadow-xl lg:shadow-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between lg:gap-6">
            <div>
              <CardTitle className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3 mb-2">
                <div className="p-2 lg:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <span>Lista de Assinantes</span>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm lg:text-lg px-2 lg:px-3 py-1">
                  {subscribers.length}
                </Badge>
              </CardTitle>
              <p className="text-green-100 text-sm lg:text-base">
                Gerencie todos os assinantes cadastrados no sistema
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg px-4 lg:px-6 py-2 lg:py-3 w-full lg:w-auto"
            >
              <FileText className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Exportar Lista
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cards Grid - Layout equilibrado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-5">
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
