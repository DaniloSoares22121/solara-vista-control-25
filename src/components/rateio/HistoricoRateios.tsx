
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRateioGenerators, useHistoricoRateiosData, RateioHistoryItem } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Rateios</CardTitle>
        <CardDescription>Consulte os rateios já realizados para cada geradora.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select onValueChange={(value) => { setSelectedGeradoraId(value); setSelectedRateio(null); }} disabled={isLoadingGenerators}>
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

        {selectedGeradoraId && (
            <div>
                <h3 className="text-lg font-semibold mb-4">Rateios Realizados</h3>
                 <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Total Distribuído</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingHistorico ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center"><LoadingSpinner text="Buscando histórico..." size="sm" /></TableCell>
                                </TableRow>
                            ) : historico.length > 0 ? (
                                historico.map(item => (
                                    <TableRow key={item.id} onClick={() => setSelectedRateio(item)} className="cursor-pointer">
                                        <TableCell>{format(new Date(item.data_rateio), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="capitalize">{item.tipo_rateio}</TableCell>
                                        <TableCell>{item.total_distribuido.toLocaleString('pt-BR')} kWh</TableCell>
                                        <TableCell className="capitalize">{item.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Nenhum histórico de rateio encontrado para esta geradora.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )}

        {selectedRateio && (
             <div className="mt-6 border-dashed border-2 rounded-lg p-4 text-center text-muted-foreground">
                <h4 className="font-semibold text-foreground">Detalhes do Rateio de {format(new Date(selectedRateio.data_rateio), 'dd/MM/yyyy')}</h4>
                <p className="text-sm mt-2">A visualização detalhada dos assinantes deste rateio e a opção de anexar o formulário da concessionária serão implementadas em breve.</p>
             </div>
        )}

      </CardContent>
    </Card>
  );
};

export default HistoricoRateios;
