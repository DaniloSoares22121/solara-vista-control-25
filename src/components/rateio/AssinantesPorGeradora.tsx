import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Assinantes por Geradora</CardTitle>
        <CardDescription>Selecione uma geradora para visualizar os assinantes vinculados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select onValueChange={setSelectedGeradoraId} disabled={isLoadingGenerators}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder={isLoadingGenerators ? "Carregando geradoras..." : "Selecione uma geradora..."} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingGenerators && <div className="flex justify-center p-4"><LoadingSpinner /></div>}
              {generators.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.apelido}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                    {(error as Error).message || "Ocorreu um erro ao buscar os dados."}
                </AlertDescription>
            </Alert>
        )}

        {selectedGeradora && (
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-lg">{selectedGeradora.apelido}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">UC da Geradora</p>
                <p>{selectedGeradora.uc}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Geração Estimada</p>
                <p>{selectedGeradora.geracao}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {(selectedGeradora || isLoadingSubscribers) && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Assinantes Vinculados</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>UC</TableHead>
                    <TableHead>Consumo Contratado</TableHead>
                    <TableHead>Crédito Acumulado</TableHead>
                    <TableHead>Rateio (Pct/Prio)</TableHead>
                    <TableHead>Última Fatura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingSubscribers ? (
                    Array.from({ length: 3 }).map((_, index) => (
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
                      <TableRow key={sub.id}>
                        <TableCell>{sub.nome}</TableCell>
                        <TableCell>{sub.uc}</TableCell>
                        <TableCell>{sub.consumo}</TableCell>
                        <TableCell>{sub.credito}</TableCell>
                        <TableCell>{sub.rateio}</TableCell>
                        <TableCell>{sub.ultimaFatura}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhum assinante encontrado para esta geradora.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssinantesPorGeradora;
