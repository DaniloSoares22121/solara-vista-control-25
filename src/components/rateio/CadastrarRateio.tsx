
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRateioGenerators, useRateioSubscribers } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle, CheckCircle2, Zap, Users, Calculator, ArrowRight, Info } from 'lucide-react';
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
        dataRateio: new Date().toISOString().split('T')[0],
        assinantes: selecionados,
      });
      
      toast({
        title: "🎉 Rateio cadastrado com sucesso!",
        description: `${selecionados.length} assinantes foram vinculados à geradora.`,
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
    <div className="space-y-8">
      {/* Header com progresso */}
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cadastrar Novo Rateio
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure a distribuição de créditos entre geradora e assinantes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={selectedGeradora ? "default" : "secondary"} className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {selectedGeradora ? "Geradora Selecionada" : "Selecione Geradora"}
            </Badge>
            {selecionados.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {selecionados.length} Assinante{selecionados.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Barra de progresso visual */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedGeradoraId ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`h-0.5 w-16 ${selectedGeradoraId ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selecionados.length > 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <div className={`h-0.5 w-16 ${validSubmit ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${validSubmit ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
          </div>
        </div>
      </div>

      {/* Configuração principal */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Configuração do Rateio</CardTitle>
              <CardDescription>Selecione a geradora e defina o tipo de distribuição</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Geradora</label>
              <Select onValueChange={setSelectedGeradoraId} disabled={isLoadingGenerators || isSubmitting} value={selectedGeradoraId}>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Rateio</label>
              <Select value={tipoRateio} onValueChange={v => setTipoRateio(v as "porcentagem" | "prioridade")} disabled={isSubmitting}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentagem">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Porcentagem
                    </div>
                  </SelectItem>
                  <SelectItem value="prioridade">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Prioridade
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info sobre tipo de rateio */}
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {tipoRateio === "porcentagem" ? "Rateio por Porcentagem" : "Rateio por Prioridade"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {tipoRateio === "porcentagem" 
                    ? "Distribua a energia definindo a porcentagem exata para cada assinante. A soma deve ser 100%."
                    : "Defina prioridades únicas (1, 2, 3...) onde 1 é a maior prioridade. A energia será distribuída sequencialmente."
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes da Geradora Selecionada */}
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
                  <CardDescription>Geradora selecionada para o rateio</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">Ativa</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">UC da Geradora</p>
                <p className="text-lg font-semibold">{selectedGeradora.uc}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Geração Estimada</p>
                <p className="text-lg font-semibold text-primary">{selectedGeradora.geracao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de assinantes */}
      {selectedGeradora && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Selecionar Assinantes</CardTitle>
                <CardDescription>
                  Escolha os assinantes e defina os valores para o rateio
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSubscribers ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground">Carregando assinantes...</p>
              </div>
            ) : (
              <>
                {assinantes.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-muted-foreground">Nenhum assinante encontrado</p>
                      <p className="text-sm text-muted-foreground">Cadastre assinantes antes de criar um rateio</p>
                    </div>
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
          </CardContent>
        </Card>
      )}

      {/* Validação e Status */}
      {selectedGeradora && selecionados.length > 0 && (
        <Card className={`border-l-4 ${validSubmit ? 'border-green-500 bg-green-50/50' : 'border-yellow-500 bg-yellow-50/50'}`}>
          <CardContent className="pt-6">
            {!validSubmit && (
              <Alert variant="destructive" className="border-0 bg-transparent">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-medium">{statusMsg}</AlertDescription>
              </Alert>
            )}
            
            {validSubmit && tipoRateio === "porcentagem" && (
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-medium">Configuração válida!</p>
                  <p className="text-sm">Soma total: {somaPorcentagens}% ✅</p>
                </div>
              </div>
            )}
            
            {validSubmit && tipoRateio === "prioridade" && (
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-medium">Prioridades configuradas corretamente!</p>
                  <p className="text-sm">Todas as prioridades são únicas ✅</p>
                </div>
              </div>
            )}
            
            {hasPriorityDuplicate && (
              <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Prioridades devem ser únicas
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botão de ação */}
      {selectedGeradora && selecionados.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoadingSubscribers || !validSubmit}
            size="lg"
            className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Cadastrando...
              </>
            ) : (
              <>
                Cadastrar Rateio
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Orientação inicial */}
      {!selectedGeradora && !isLoadingGenerators && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Começar novo rateio</p>
              <p className="text-muted-foreground">Selecione uma geradora acima para continuar</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadastrarRateio;
