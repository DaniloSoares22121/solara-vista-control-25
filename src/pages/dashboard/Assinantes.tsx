
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Search, Filter } from 'lucide-react';
import SubscriberForm from '@/components/forms/subscriber/SubscriberForm';
import SubscribersList from '@/components/forms/subscriber/SubscribersList';
import { useSubscribers } from '@/hooks/useSubscribers';

const Assinantes = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { subscribers, isLoading } = useSubscribers();

  const filteredSubscribers = subscribers.filter(subscriber => {
    const name = subscriber.subscriber?.fullName || subscriber.subscriber?.companyName || '';
    const email = subscriber.subscriber?.email || '';
    const uc = subscriber.energy_account?.uc || '';
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           uc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Assinante</h1>
              <p className="text-gray-600">Cadastre um novo assinante no sistema</p>
            </div>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
            >
              Voltar para Lista
            </Button>
          </div>
          
          <SubscriberForm onSuccess={handleFormSuccess} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assinantes</h1>
            <p className="text-gray-600">Gerencie os assinantes do sistema</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Assinante</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : subscribers.length}
                  </p>
                  <p className="text-sm text-gray-600">Total de Assinantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : subscribers.filter(s => s.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : subscribers.filter(s => s.subscriber?.fullName).length}
                  </p>
                  <p className="text-sm text-gray-600">Pessoa Física</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : subscribers.filter(s => s.subscriber?.companyName).length}
                  </p>
                  <p className="text-sm text-gray-600">Pessoa Jurídica</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou UC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Lista de Assinantes</span>
              </span>
              {searchTerm && (
                <Badge variant="secondary">
                  {filteredSubscribers.length} resultado(s) encontrado(s)
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubscribersList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Assinantes;
