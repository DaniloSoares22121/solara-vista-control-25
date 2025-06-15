
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Users, Zap, Search, Filter, Download, Eye, Edit, Trash2, Calendar, TrendingUp, Activity, BarChart3, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'processed': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  // Estatísticas dos rateios
  const stats = {
    total: rateios.length,
    pending: rateios.filter(r => r.status === 'pending').length,
    processed: rateios.filter(r => r.status === 'processed').length,
    completed: rateios.filter(r => r.status === 'completed').length,
    totalEnergy: rateios.reduce((acc, r) => acc + (r.expectedGeneration || 0), 0),
    averageSubscribers: rateios.length > 0 ? Math.round(rateios.reduce((acc, r) => acc + r.subscribers.length, 0) / rateios.length) : 0
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Rateio de Energia</h1>
            <p className="text-gray-600">Configure a distribuição de energia entre os assinantes</p>
          </div>
          <Button onClick={() => setShowForm(false)} variant="outline" className="px-6">
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
    <div className="space-y-8">
      {/* Header Aprimorado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rateio de Energia</h1>
          <p className="text-lg text-gray-600">Gerencie a distribuição inteligente de energia entre assinantes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 px-6">
            <Download className="w-4 h-4" />
            <span>Exportar Dados</span>
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Novo Rateio</span>
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas Melhoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Total de Rateios</CardTitle>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calculator className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-sm text-blue-600 mt-1">
              {stats.pending} pendentes • {stats.completed} concluídos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Energia Total</CardTitle>
            <div className="p-2 bg-green-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {stats.totalEnergy.toLocaleString('pt-BR')} kWh
            </div>
            <p className="text-sm text-green-600 mt-1">
              Energia distribuída total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-yellow-700">Média de Assinantes</CardTitle>
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{stats.averageSubscribers}</div>
            <p className="text-sm text-yellow-600 mt-1">
              Por rateio realizado
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Taxa de Sucesso</CardTitle>
            <div className="p-2 bg-purple-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <p className="text-sm text-purple-600 mt-1">
              Rateios concluídos com sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Aprimorados */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por período (MM/AAAA)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-52 h-12">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span>Pendente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="processed">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Processado</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Concluído</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-52 h-12">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data (Mais Recente)</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="energy">Energia Gerada</SelectItem>
                  <SelectItem value="subscribers">Nº de Assinantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      {isLoading ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Activity className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando Rateios</h3>
              <p className="text-gray-600">Aguarde enquanto buscamos os dados...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-lg border-0 border-red-200">
          <CardContent className="p-12">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">Erro ao Carregar</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredRateios.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Calculator className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {rateios.length === 0 ? 'Nenhum rateio cadastrado' : 'Nenhum rateio encontrado'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {rateios.length === 0 
                  ? 'Comece criando seu primeiro rateio de energia para distribuir energia entre os assinantes.'
                  : 'Tente ajustar os filtros para encontrar o que procura.'
                }
              </p>
              {rateios.length === 0 && (
                <Button 
                  onClick={() => setShowForm(true)} 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-lg shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Rateio
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-gray-600" />
                <span className="text-xl">Lista de Rateios ({filteredRateios.length})</span>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {filteredRateios.length} resultado(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {filteredRateios.map((rateio) => (
                <div key={rateio.id} className="border rounded-xl p-6 hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          Rateio {rateio.month}/{rateio.year}
                        </h4>
                        <p className="text-gray-600">
                          Tipo: {rateio.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(rateio.status)} flex items-center space-x-1 px-3 py-1`}>
                        {getStatusIcon(rateio.status)}
                        <span>{getStatusText(rateio.status)}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                        <span>Visualizar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-yellow-50">
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Energia Esperada</span>
                      </div>
                      <p className="text-xl font-bold text-green-900">
                        {(rateio.expectedGeneration || 0).toLocaleString('pt-BR')} kWh
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Assinantes</span>
                      </div>
                      <p className="text-xl font-bold text-blue-900">
                        {rateio.subscribers.length} participantes
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-800">Valor Total</span>
                      </div>
                      <p className="text-xl font-bold text-purple-900">
                        R$ {rateio.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-800">Status Atual</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {getStatusText(rateio.status)}
                      </p>
                    </div>
                  </div>

                  {rateio.notes && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="font-medium text-amber-800">Observações</span>
                      </div>
                      <p className="text-amber-700">{rateio.notes}</p>
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
