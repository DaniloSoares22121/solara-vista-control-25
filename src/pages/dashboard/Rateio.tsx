
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Users, Zap, Search, Filter, Download, Eye, Edit, Trash2, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useRateio } from '@/hooks/useRateio';
import RateioForm from '@/components/forms/RateioForm';
import { RateioFormData, RateioData } from '@/types/rateio';

const Rateio = () => {
  const { rateios, isLoading, error, createRateio } = useRateio();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const handleCreateRateio = async (formData: RateioFormData) => {
    const rateioData: Omit<RateioData, 'id'> = {
      month: formData.date.month.toString().padStart(2, '0'),
      year: formData.date.year.toString(),
      status: 'pending',
      totalAmount: 0,
      subscribers: [],
      generatorId: formData.generatorId,
      type: formData.type,
      date: formData.date,
      expectedGeneration: formData.expectedGeneration,
    };

    const result = await createRateio(rateioData);
    if (result.success) {
      setShowForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processed': return 'Processado';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const filteredRateios = rateios.filter(rateio => {
    const matchesSearch = `${rateio.month}/${rateio.year}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rateio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Rateio</h1>
            <p className="text-gray-600">Crie um novo rateio de energia</p>
          </div>
          <Button onClick={() => setShowForm(false)} variant="outline">
            Voltar para Lista
          </Button>
        </div>
        
        <RateioForm 
          onSubmit={handleCreateRateio}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rateio de Energia</h1>
          <p className="text-gray-600">Gerencie a distribuição de energia entre assinantes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            <span>Novo Rateio</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Rateios</CardTitle>
            <Calculator className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{rateios.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Energia Distribuída</CardTitle>
            <Zap className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">15.840 kWh</div>
            <p className="text-xs text-green-600 mt-1">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Assinantes Ativos</CardTitle>
            <Users className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-xs text-gray-500 mt-1">
              Participando do rateio
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Economia Total</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R$ 8.420</div>
            <p className="text-xs text-purple-600 mt-1">
              Economia este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por período..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processed">Processado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="amount">Valor</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <Card className="shadow-sm">
          <CardContent className="p-12">
            <div className="text-center">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-pulse" />
              <div className="text-gray-600">Carregando rateios...</div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      ) : filteredRateios.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-12">
            <div className="text-center">
              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {rateios.length === 0 ? 'Nenhum rateio cadastrado' : 'Nenhum rateio encontrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {rateios.length === 0 
                  ? 'Comece criando seu primeiro rateio de energia.'
                  : 'Tente ajustar os filtros para encontrar o que procura.'
                }
              </p>
              {rateios.length === 0 && (
                <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                  <span>Criar Primeiro Rateio</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Lista de Rateios ({filteredRateios.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRateios.map((rateio) => (
                <div key={rateio.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Rateio {rateio.month}/{rateio.year}
                        </h4>
                      </div>
                      <Badge className={getStatusColor(rateio.status)}>
                        {getStatusText(rateio.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Ver</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">
                        {rateio.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Valor Total:</span>
                      <p className="font-medium text-green-600">
                        R$ {rateio.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Assinantes:</span>
                      <p className="font-medium">{rateio.subscribers.length} participantes</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Geração Esperada:</span>
                      <p className="font-medium">{rateio.expectedGeneration || 0} kWh</p>
                    </div>
                  </div>

                  {rateio.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Observações:</span>
                      <p className="text-sm text-gray-700 mt-1">{rateio.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Rateio;
