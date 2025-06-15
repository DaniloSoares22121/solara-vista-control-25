
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Users, Zap, Search, Filter, Download, Eye, Edit, Trash2, Calendar, TrendingUp, Activity, BarChart3, Clock, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': 
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Concluído',
          bgGradient: 'from-emerald-50 to-green-50'
        };
      case 'processed': 
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="w-4 h-4" />,
          text: 'Processado',
          bgGradient: 'from-blue-50 to-indigo-50'
        };
      case 'pending': 
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          text: 'Pendente',
          bgGradient: 'from-amber-50 to-yellow-50'
        };
      default: 
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-4 h-4" />,
          text: status,
          bgGradient: 'from-gray-50 to-slate-50'
        };
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
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-green-600" />
              Novo Rateio de Energia
            </h1>
            <p className="text-gray-600 mt-1">Configure a distribuição inteligente de energia entre os assinantes</p>
          </div>
          <Button 
            onClick={() => setShowForm(false)} 
            variant="outline" 
            className="px-6 hover:bg-gray-50 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Melhorado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl mr-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            Rateio de Energia
          </h1>
          <p className="text-lg text-gray-600">Distribua energia de forma inteligente e otimizada</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 px-6 hover:bg-gray-50 transition-all duration-300">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button 
            onClick={() => setShowForm(true)} 
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Rateio</span>
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas com Animações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">Total de Rateios</CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Calculator className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900 mb-1">{stats.total}</div>
            <div className="flex items-center text-sm text-blue-600">
              <div className="flex items-center mr-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                {stats.pending} pendentes
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                {stats.completed} concluídos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">Energia Total</CardTitle>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900 mb-1">
              {(stats.totalEnergy / 1000).toFixed(1)}k kWh
            </div>
            <p className="text-sm text-green-600">
              Energia distribuída total
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">Média de Assinantes</CardTitle>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-yellow-900 mb-1">{stats.averageSubscribers}</div>
            <p className="text-sm text-yellow-600">
              Por rateio realizado
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">Taxa de Sucesso</CardTitle>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <p className="text-sm text-purple-600">
              Rateios concluídos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Redesenhados */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por período (MM/AAAA)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-52 h-12 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
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
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Concluído</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-52 h-12 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="z-50">
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
        <Card className="border-0 shadow-lg">
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
        <Card className="border-0 shadow-lg border-red-200">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">Erro ao Carregar</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredRateios.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-6">
                <Calculator className="w-10 h-10 text-green-600" />
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
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Rateio
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl">Lista de Rateios</span>
              </div>
              <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
                {filteredRateios.length} resultado(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {filteredRateios.map((rateio, index) => {
                const statusConfig = getStatusConfig(rateio.status);
                return (
                  <div 
                    key={rateio.id} 
                    className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 bg-gradient-to-br ${statusConfig.bgGradient} rounded-xl group-hover:scale-105 transition-transform duration-300`}>
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            Rateio {rateio.month}/{rateio.year}
                          </h4>
                          <p className="text-gray-600">
                            Tipo: <span className="font-medium">{rateio.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'}</span>
                          </p>
                        </div>
                        <Badge className={`${statusConfig.color} flex items-center space-x-2 px-4 py-2 shadow-sm`}>
                          {statusConfig.icon}
                          <span className="font-medium">{statusConfig.text}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>Visualizar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                        <div className="flex items-center space-x-2 mb-3">
                          <Zap className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">Energia Esperada</span>
                        </div>
                        <p className="text-xl font-bold text-green-900">
                          {(rateio.expectedGeneration || 0).toLocaleString('pt-BR')} kWh
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-2 mb-3">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Assinantes</span>
                        </div>
                        <p className="text-xl font-bold text-blue-900">
                          {rateio.subscribers.length} participantes
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center space-x-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Valor Total</span>
                        </div>
                        <p className="text-xl font-bold text-purple-900">
                          R$ {rateio.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center space-x-2 mb-3">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-800">Status Atual</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 flex items-center">
                          {statusConfig.icon}
                          <span className="ml-2">{statusConfig.text}</span>
                        </p>
                      </div>
                    </div>

                    {rateio.notes && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="font-medium text-amber-800">Observações</span>
                        </div>
                        <p className="text-amber-700">{rateio.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Rateio;
