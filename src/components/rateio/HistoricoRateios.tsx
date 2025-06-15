import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRateioGenerators, useHistoricoRateiosData, useRateioSubscribers, RateioHistoryItem } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle, Calendar, TrendingUp, Clock, Eye, FileText, Search, Filter, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RateioReportModal } from './RateioReportModal';
import { RateioStats } from './RateioStats';

const HistoricoRateios = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedRateio, setSelectedRateio] = useState<RateioHistoryItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: generatorsData, isLoading: isLoadingGenerators, error: errorGenerators } = useRateioGenerators();
  const generators = generatorsData || [];

  const { data: subscribersData } = useRateioSubscribers();

  const {
    historico,
    isLoading: isLoadingHistorico,
    error: errorHistorico,
  } = useHistoricoRateiosData(selectedGeradoraId);

  const error = errorGenerators || errorHistorico;

  // Filtros aplicados
  const historicoFiltrado = historico.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         format(parseISO(item.data_rateio), 'dd/MM/yyyy').includes(searchTerm);
    const matchesStatus = filterStatus === 'todos' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoRateioColor = (tipo: string) => {
    return tipo === 'porcentagem' 
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const selectedGenerator = generators.find(g => g.id === selectedGeradoraId);

  const handleViewReport = (rateio: RateioHistoryItem) => {
    setSelectedRateio(rateio);
    setIsReportModalOpen(true);
  };

  // Stats calculadas com dados reais
  const totalDistribuido = historico.reduce((acc, curr) => acc + curr.total_distribuido, 0);
  const geradorasAtivas = generators.length;

  // Contar assinantes vinculados à geradora selecionada (se houver)
  const assinantesVinculados = subscribersData?.length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <RateioStats 
        totalRateios={historico.length}
        totalDistribuido={totalDistribuido}
        geradorasAtivas={geradorasAtivas}
      />

      {/* Header Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">Histórico de Rateios</CardTitle>
                <CardDescription className="text-blue-700/80">
                  Consulte e gerencie os rateios realizados para suas geradoras
                </CardDescription>
              </div>
            </div>
            {selectedGenerator && (
              <div className="text-right">
                <div className="text-sm text-blue-600 font-medium">Geradora Selecionada</div>
                <div className="text-lg font-bold text-blue-900">{selectedGenerator.apelido}</div>
                <div className="text-sm text-blue-700">{selectedGenerator.geracao}</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Selecionar Geradora
              </label>
              <Select 
                onValueChange={(value) => { 
                  setSelectedGeradoraId(value); 
                  setSelectedRateio(null); 
                }} 
                disabled={isLoadingGenerators}
                value={selectedGeradoraId}
              >
                <SelectTrigger className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue 
                    placeholder={isLoadingGenerators ? "Carregando..." : "Escolha uma geradora..."} 
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200">
                  {isLoadingGenerators && (
                    <div className="flex justify-center p-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                  {generators.map(g => (
                    <SelectItem key={g.id} value={g.id} className="focus:bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                          {g.apelido.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{g.apelido}</div>
                          <div className="text-xs text-muted-foreground">UC: {g.uc}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Filtrar por Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processed">Processado</SelectItem>
                  <SelectItem value="completed">Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {(error as Error).message || "Ocorreu um erro ao buscar os dados."}
          </AlertDescription>
        </Alert>
      )}

      {/* History Section */}
      {selectedGeradoraId && (
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Rateios Realizados</CardTitle>
                  <CardDescription>
                    {isLoadingHistorico ? "Carregando histórico..." : `${historicoFiltrado.length} de ${historico.length} rateio${historico.length !== 1 ? 's' : ''} realizado${historico.length !== 1 ? 's' : ''}`}
                    {assinantesVinculados > 0 && historico.length === 0 && (
                      <span className="text-blue-600 ml-2">
                        • {assinantesVinculados} assinante{assinantesVinculados !== 1 ? 's' : ''} cadastrado{assinantesVinculados !== 1 ? 's' : ''}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
              {historicoFiltrado.length > 0 && (
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {historicoFiltrado.reduce((acc, curr) => acc + curr.total_distribuido, 0).toLocaleString('pt-BR')} kWh
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Exportar Lista
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingHistorico ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner text="Buscando histórico..." size="lg" />
              </div>
            ) : historicoFiltrado.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {historicoFiltrado.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="p-6 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">
                              {format(parseISO(item.data_rateio), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                            </span>
                            <Badge className={getTipoRateioColor(item.tipo_rateio)}>
                              {item.tipo_rateio === 'porcentagem' ? 'Por Porcentagem' : 'Por Prioridade'}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>ID: {item.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {item.total_distribuido.toLocaleString('pt-BR')}
                          </div>
                          <div className="text-sm text-gray-500">kWh distribuídos</div>
                        </div>
                        <Button
                          onClick={() => handleViewReport(item)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Relatório
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'todos' ? 'Nenhum resultado encontrado' : 'Nenhum rateio realizado'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStatus !== 'todos' 
                    ? 'Tente ajustar os filtros de busca.'
                    : assinantesVinculados > 0 
                    ? `Esta geradora possui ${assinantesVinculados} assinante${assinantesVinculados !== 1 ? 's' : ''} cadastrado${assinantesVinculados !== 1 ? 's' : ''}, mas ainda não possui rateios realizados.`
                    : 'Esta geradora ainda não possui assinantes cadastrados nem rateios realizados.'
                  }
                </p>
                {(!searchTerm && filterStatus === 'todos') && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {assinantesVinculados > 0 ? 'Criar Primeiro Rateio' : 'Cadastrar Assinantes'}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedGeradoraId && (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione uma geradora
            </h3>
            <p className="text-gray-500">
              Escolha uma geradora acima para visualizar o histórico de rateios realizados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Modal */}
      <RateioReportModal
        rateio={selectedRateio}
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedRateio(null);
        }}
      />
    </div>
  );
};

export default HistoricoRateios;
