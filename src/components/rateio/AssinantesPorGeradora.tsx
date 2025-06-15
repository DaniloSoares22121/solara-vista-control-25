
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Zap, User, Search, TrendingUp, Calendar } from 'lucide-react';
import { useRateioGenerators, useRateioSubscribers } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';

const AssinantesPorGeradora = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();
  
  const { data: generatorsData, isLoading: isLoadingGenerators, error: errorGenerators } = useRateioGenerators();
  const generators = generatorsData || [];
  
  const { data: subscribersData, isLoading: isLoadingSubscribers, error: errorSubscribers } = useRateioSubscribers();
  const subscribers = subscribersData || [];

  const selectedGeradora = generators.find(g => g.id === selectedGeradoraId);
  const error = errorGenerators || errorSubscribers;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Consulta de Assinantes
        </h1>
        <p className="text-muted-foreground">
          Visualize todos os assinantes vinculados a uma geradora específica
        </p>
      </div>

      {/* Seleção da Geradora */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Selecionar Geradora</CardTitle>
              <CardDescription>Escolha uma geradora para visualizar seus assinantes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select onValueChange={setSelectedGeradoraId} disabled={isLoadingGenerators}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={isLoadingGenerators ? "Carregando..." : "Selecione uma geradora"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingGenerators && <div className="flex justify-center p-4"><LoadingSpinner /></div>}
                {generators.map(g => (
                  <SelectItem key={g.id} value={g.id}>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      {g.apelido}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {(error as Error).message || "Ocorreu um erro inesperado ao buscar os dados."}
          </AlertDescription>
        </Alert>
      )}

      {/* Detalhes da Geradora */}
      {selectedGeradora && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">{selectedGeradora.apelido}</CardTitle>
                  <CardDescription>Geradora selecionada</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {subscribers.length} Assinante{subscribers.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UC da Geradora</p>
                  <p className="text-lg font-bold">{selectedGeradora.uc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Geração Estimada</p>
                  <p className="text-lg font-bold text-green-600">{selectedGeradora.geracao}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assinantes</p>
                  <p className="text-lg font-bold text-blue-600">{subscribers.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Assinantes */}
      {(selectedGeradora || isLoadingSubscribers) && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Assinantes Vinculados</CardTitle>
                <CardDescription>
                  Lista completa de assinantes desta geradora
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nome
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        UC
                      </div>
                    </TableHead>
                    <TableHead>Consumo Contratado</TableHead>
                    <TableHead>Crédito Acumulado</TableHead>
                    <TableHead>Rateio Atual</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Última Fatura
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingSubscribers ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : subscribers.length > 0 ? (
                    subscribers.map(sub => (
                      <TableRow key={sub.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{sub.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              ID: {sub.id.slice(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {sub.uc}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">{sub.consumo}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{sub.credito}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sub.rateio}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{sub.ultimaFatura}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <User className="h-12 w-12 text-muted-foreground opacity-50" />
                          <div>
                            <p className="font-medium text-muted-foreground">Nenhum assinante encontrado</p>
                            <p className="text-sm text-muted-foreground">Esta geradora ainda não possui assinantes vinculados</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado inicial */}
      {!selectedGeradora && !isLoadingGenerators && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Selecione uma geradora</p>
              <p className="text-muted-foreground">Escolha uma geradora acima para visualizar seus assinantes</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssinantesPorGeradora;
