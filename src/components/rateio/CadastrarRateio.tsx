
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { useRateioGenerators, useRateioSubscribers } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdicionarAssinantesRateio } from "./AdicionarAssinantesRateio";
import { rateioService } from "@/services/rateioService";
import { toast } from "@/hooks/use-toast";

const CadastrarRateio = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();
  const [tipoRateio, setTipoRateio] = useState<"porcentagem" | "prioridade">("porcentagem");
  const [assinantes, setAssinantes] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtém geradoras
  const { data: generatorsData, isLoading: isLoadingGenerators, error: errorGenerators } = useRateioGenerators();
  const generators = generatorsData || [];
  const selectedGeradora = generators.find(g => g.id === selectedGeradoraId);

  // Obtém TODOS os assinantes disponíveis
  const { data: subscribersData, isLoading: isLoadingSubscribers, error: errorSubscribers } = useRateioSubscribers();

  // Prepara lista de assinantes sempre que carregar da API ou trocar de geradora
  React.useEffect(() => {
    if (subscribersData) {
      setAssinantes(
        (subscribersData || []).map(a => ({
          ...a,
          selecionado: false,
          valor: "",
        }))
      );
    } else {
      setAssinantes([]);
    }
  }, [subscribersData]);

  const error = errorGenerators || errorSubscribers;

  // Assinantes selecionados (via checkbox)
  const selecionados = assinantes.filter(a => a.selecionado);

  // Soma da porcentagem (quando tipo porcentagem)
  const somaPorcentagens = selecionados.reduce(
    (acc, curr) => acc + (tipoRateio === "porcentagem" ? Number(curr.valor || 0) : 0),
    0
  );

  // Lista de prioridades passadas
  const prioridades = tipoRateio === "prioridade"
    ? selecionados.map(a => Number(a.valor)).filter(Boolean)
    : [];

  // Validação
  const validSubmit =
    selectedGeradoraId &&
    selecionados.length > 0 &&
    selecionados.every(a => !!a.valor && (!isNaN(Number(a.valor)))) &&
    (
      tipoRateio === "porcentagem"
        ? somaPorcentagens === 100
        : (new Set(prioridades)).size === prioridades.length && prioridades.every(n => Number.isInteger(n) && n > 0)
    );

  // Mensagens
  const statusMsg =
    tipoRateio === "porcentagem"
      ? `A soma das porcentagens deve ser exatamente 100%. Atualmente: ${somaPorcentagens}%`
      : "Cada prioridade deve ser única e inteira (começando em 1). 1 é a maior prioridade.";

  const hasPriorityDuplicate =
    tipoRateio === "prioridade" && (new Set(prioridades)).size !== prioridades.length;

  // ----------- SUBMIT HANDLER ----------------------
  const handleSubmit = async () => {
    if (!selectedGeradoraId || !selectedGeradora) {
      toast({
        title: "Selecione uma geradora!",
        description: "Você precisa selecionar uma geradora para cadastrar o rateio.",
        variant: "destructive"
      });
      return;
    }
    
    if (!validSubmit) {
      toast({
        title: "Preencha os valores corretamente!",
        description: tipoRateio === "porcentagem"
          ? "A soma das porcentagens deve ser 100%."
          : "Prioridades devem ser únicas e inteiras (1, 2, 3 ...).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Dados para cadastro:', {
        geradora: selectedGeradora,
        tipoRateio,
        assinantes: selecionados
      });

      await rateioService.cadastrarRateio({
        geradora: selectedGeradora,
        tipoRateio,
        dataRateio: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        assinantes: selecionados,
      });
      
      toast({
        title: "Sucesso!",
        description: `Rateio cadastrado com sucesso! ${selecionados.length} assinantes vinculados.`,
      });
      
      // Limpa os valores dos assinantes mas mantém a geradora selecionada
      setAssinantes(assinantes.map(a => ({ ...a, selecionado: false, valor: "" })));
      
    } catch (err: any) {
      console.error('Erro ao cadastrar rateio:', err);
      toast({
        title: "Erro ao cadastrar",
        description: err?.message || "Erro inesperado ao cadastrar rateio.",
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
        <CardDescription>Vincule vários assinantes a uma geradora e defina regras de rateio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Seleção da Geradora e Tipo de Rateio */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Select onValueChange={setSelectedGeradoraId} disabled={isLoadingGenerators || isSubmitting} value={selectedGeradoraId}>
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

          <Select value={tipoRateio} onValueChange={v => setTipoRateio(v as "porcentagem" | "prioridade")} disabled={isSubmitting}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tipo de Rateio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="porcentagem">% Porcentagem</SelectItem>
              <SelectItem value="prioridade">Prioridade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Exibe info da Geradora Selecionada */}
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

        {/* Lista de assinantes aparece sempre que houver uma geradora selecionada */}
        {selectedGeradora && (
          <div className="mt-6 rounded-md border p-4 bg-muted/10">
            <h3 className="text-lg font-semibold mb-4">Selecionar Assinantes para Vincular à Geradora</h3>
            {isLoadingSubscribers ? (
              <div className="text-center mt-4"><LoadingSpinner size="sm" text="Carregando assinantes..." /></div>
            ) : (
              <>
                {assinantes.length === 0 ? (
                  <div className="text-center text-muted-foreground py-6">
                    Nenhum assinante cadastrado no sistema.
                  </div>
                ) : (
                  <AdicionarAssinantesRateio
                    assinantes={assinantes}
                    onSelect={setAssinantes}
                    tipoRateio={tipoRateio}
                    disabled={isSubmitting}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Mensagem de validação */}
        {selectedGeradora && selecionados.length > 0 && (
          <div className="my-4">
            {!validSubmit && (
              <Alert variant="destructive" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 opacity-70 mr-2" />
                <AlertDescription>{statusMsg}</AlertDescription>
              </Alert>
            )}
            {validSubmit && tipoRateio === "porcentagem" && (
              <div className="flex items-center text-green-700 text-sm gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Pronto para cadastrar! Soma: <b>{somaPorcentagens}%</b>
              </div>
            )}
            {validSubmit && tipoRateio === "prioridade" && (
              <div className="flex items-center text-green-700 text-sm gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Prioridades configuradas corretamente!
              </div>
            )}
            {hasPriorityDuplicate && (
              <div className="text-xs text-red-600 mt-1">
                Prioridades devem ser únicas.
              </div>
            )}
          </div>
        )}

        {/* Botão de cadastrar */}
        {selectedGeradora && selecionados.length > 0 && (
          <div className="flex items-center justify-end gap-4 mt-6">
            <Button onClick={handleSubmit} disabled={isSubmitting || isLoadingSubscribers || !validSubmit}>
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Cadastrar Rateio"}
            </Button>
          </div>
        )}

        {/* Orientação inicial */}
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
