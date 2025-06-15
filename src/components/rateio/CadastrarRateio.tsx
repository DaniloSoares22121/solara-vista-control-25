
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRateioGenerators } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CadastrarRateio = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();
  const { data: generatorsData, isLoading: isLoadingGenerators, error } = useRateioGenerators();
  const generators = generatorsData || [];

  const selectedGeradora = generators.find(g => g.id === selectedGeradoraId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Rateio</CardTitle>
        <CardDescription>Selecione uma geradora para iniciar o cadastro de um novo rateio.</CardDescription>
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
          <>
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

            <div className="mt-6 text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
                 <p>A funcionalidade de cadastro de rateio está em desenvolvimento.</p>
                 <p className="text-sm">Em breve você poderá adicionar assinantes e definir o rateio aqui.</p>
            </div>
          </>
        )}

        {!selectedGeradora && !isLoadingGenerators && (
            <div className="text-center text-muted-foreground py-8">
                <p>Por favor, selecione uma geradora para continuar.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CadastrarRateio;
