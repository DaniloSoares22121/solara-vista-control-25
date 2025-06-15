
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRateioGenerators, useHistoricoRateiosData, RateioHistoryItem } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle, Calendar, TrendingUp, Clock, Eye, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HistoricoRateios = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();
  const { data: generatorsData, isLoading: isLoadingGenerators, error: errorGenerators } = useRateioGenerators();
  const generators = generatorsData || [];

  const {
    historico,
    isLoading: isLoadingHistorico,
    error: errorHistorico,
  } = useHistoricoRateiosData(selectedGeradoraId);
  
  const [selectedRateio, setSelectedRateio] = useState<RateioHistoryItem | null>(null);

  const error = errorGenerators || errorHistorico;

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">Histórico de Rateios</CardTitle>
              <CardDescription className="text-blue-700/80">
                Consulte e gerencie os rateios realizados para suas geradoras
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Selecionar Geradora
              </label>
              <Select 
                onValueChange={(value) => { 
                  setSelectedGeradoraId(value); 
                  setSelectedRateio(null); 
                }} 
                disabled={isLoadingGenerators}
              >
                <SelectTrigger className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue 
                    placeholder={isLoadingGenerators ? "Carregando geradoras..." : "Escolha uma geradora..."} 
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
            {selectedGenerator && (
              <div className="flex items-end">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium">Geração</div>
                  <div className="text-sm font-semibold text-blue-900">{selectedGenerator.geracao}</div>
                </div>
              </div>
            )}
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
                    {isLoadingHistorico ? "Carregando histórico..." : `${historico.length} rateio${historico.length !== 1 ? 's' : ''} encontrado${historico.length !== 1 ? 's' : ''}`}
                  </CardDescription>
                </div>
              </div>
              {historico.length > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {historico.reduce((acc, curr) => acc + curr.total_distribuido, 0).toLocaleString('pt-BR')} kWh total
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingHistorico ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner text="Buscando histórico..." size="lg" />
              </div>
            ) : historico.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {historico.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      selectedRateio?.id === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedRateio(selectedRateio?.id === item.id ? null : item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">
                              {format(parseISO(item.data_rateio), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getTipoRateioColor(item.tipo_rateio)}>
                              {item.tipo_rateio === 'porcentagem' ? 'Por Porcentagem' : 'Por Prioridade'}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {item.total_distribuido.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500">kWh distribuídos</div>
                      </div>
                    </div>
                    
                    {selectedRateio?.id === item.id && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Detalhes do Rateio
                          </h4>
                          <p className="text-sm text-blue-700 mb-3">
                            A visualização completa dos assinantes e opções de relatório serão implementadas em breve.
                          </p>
                          <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                            Ver Detalhes Completos
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum rateio encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Esta geradora ainda não possui histórico de rateios realizados.
                </p>
                <Button variant="outline" size="sm">
                  Criar Primeiro Rateio
                </Button>
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
    </div>
  );
};

export default HistoricoRateios;
