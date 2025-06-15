
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { useRateioGenerators, useRateioSubscribers } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AdicionarAssinantesRateio } from "./AdicionarAssinantesRateio";
import { rateioService } from "@/services/rateioService";
import { toast } from "@/hooks/use-toast";

const CadastrarRateio = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();
  const [tipoRateio, setTipoRateio] = useState<"porcentagem" | "prioridade">("porcentagem");
  const [assinantesSelecionados, setAssinantesSelecionados] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: generatorsData, isLoading: isLoadingGenerators, error: errorGenerators } = useRateioGenerators();
  const generators = generatorsData || [];
  const selectedGeradora = generators.find(g => g.id === selectedGeradoraId);

  const { data: subscribersData, isLoading: isLoadingSubscribers, error: errorSubscribers } = useRateioSubscribers(selectedGeradoraId);

  // Prepara os assinantes para seleção rateio
  const assinantesParaRateio = useMemo(() =>
    (subscribersData || []).map(a => ({
      ...a,
      selecionado: false,
      valor: "",
    })), [subscribersData]
  );

  const [assinantes, setAssinantes] = useState(assinantesParaRateio);

  React.useEffect(() => {
    setAssinantes(assinantesParaRateio);
  }, [assinantesParaRateio]);

  const error = errorGenerators || errorSubscribers;

  const handleSubmit = async () => {
    if (!selectedGeradoraId) {
      toast({
        title: "Selecione uma geradora!",
        description: "Você precisa selecionar uma geradora para cadastrar o rateio.",
        variant: "destructive"
      });
      return;
    }
    const escolhidos = assinantes
      .filter(a => a.selecionado && a.valor)
      .map(a => ({ subscriber_id: a.id, valor: a.valor }));

    if (escolhidos.length === 0) {
      toast({
        title: "Assinantes inválidos",
        description: "Selecione pelo menos um assinante com valor de rateio válido!",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await rateioService.cadastrarRateio({
        geradoraId: selectedGeradoraId,
        tipoRateio,
        dataRateio: new Date().toISOString(),
        assinantes: escolhidos,
      });
      toast({
        title: "Sucesso",
        description: "Rateio cadastrado com sucesso!",
        // Pode omitir variant para sucesso (default)
      });
      setAssinantes(assinantesParaRateio);
    } catch (err: any) {
      toast({
        title: "Erro ao cadastrar",
        description: err?.message || "Erro ao cadastrar rateio.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Rateio</CardTitle>
        <CardDescription>Selecione uma geradora e configure os assinantes para este rateio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Select onValueChange={value => setSelectedGeradoraId(value)} disabled={isLoadingGenerators || isSubmitting} value={selectedGeradoraId}>
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

          <Select value={tipoRateio} onValueChange={v => setTipoRateio(v as "porcentagem" | "prioridade")} disabled={isSubmitting} >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tipo de Rateio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="porcentagem">% Porcentagem</SelectItem>
              <SelectItem value="prioridade">Prioridade</SelectItem>
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

            <div className="mt-6">
              <AdicionarAssinantesRateio
                assinantes={assinantes}
                onSelect={setAssinantes}
                tipoRateio={tipoRateio}
              />
              {isLoadingSubscribers && <div className="text-center mt-4"><LoadingSpinner size="sm" text="Carregando assinantes..." /></div>}
            </div>
            <div className="flex items-center justify-end gap-4 mt-6">
              <Button onClick={handleSubmit} disabled={isSubmitting || isLoadingSubscribers}>
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Cadastrar Rateio"}
              </Button>
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
