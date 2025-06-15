
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRateioGenerators, useRateioSubscribers } from '@/hooks/useRateio';
import { LoadingSpinner } from '../ui/loading-spinner';
import { AlertCircle, CheckCircle2, Zap, Users, Calculator, ArrowRight, Info, Sparkles } from 'lucide-react';
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

  const progressSteps = [
    { id: 1, title: 'Geradora', completed: !!selectedGeradoraId },
    { id: 2, title: 'Assinantes', completed: selecionados.length > 0 },
    { id: 3, title: 'Finalizar', completed: validSubmit }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Cadastrar Novo Rateio</h1>
              <p className="text-blue-100 text-lg">Configure a distribuição inteligente de créditos energéticos</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              {progressSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step.completed ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                  }`}>
                    {step.completed ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${step.completed ? 'text-white' : 'text-blue-200'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${step.completed ? 'bg-white' : 'bg-white/20'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {selectedGeradora && selecionados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Geradora</p>
                  <p className="font-bold">{selectedGeradora.apelido}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Assinantes</p>
                  <p className="font-bold">{selecionados.length} selecionados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calculator className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-bold">{tipoRateio === 'porcentagem' ? 'Porcentagem' : 'Prioridade'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuração principal */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
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
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Geradora
              </label>
              <Select onValueChange={setSelectedGeradoraId} disabled={isLoadingGenerators || isSubmitting} value={selectedGeradoraId}>
                <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder={isLoadingGenerators ? "Carregando..." : "Selecione uma geradora"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingGenerators && <div className="flex justify-center p-4"><LoadingSpinner /></div>}
                  {generators.map(g => (
                    <SelectItem key={g.id} value={g.id}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {g.apelido.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{g.apelido}</div>
                          <div className="text-xs text-gray-500">UC: {g.uc} • {g.geracao}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Tipo de Rateio
              </label>
              <Select value={tipoRateio} onValueChange={v => setTipoRateio(v as "porcentagem" | "prioridade")} disabled={isSubmitting}>
                <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentagem">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                      <div>
                        <div className="font-medium">Porcentagem</div>
                        <div className="text-xs text-gray-500">Distribui por % fixa</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="prioridade">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                      <div>
                        <div className="font-medium">Prioridade</div>
                        <div className="text-xs text-gray-500">Distribui por ordem</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info sobre tipo de rateio */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">
                  {tipoRateio === "porcentagem" ? "Rateio por Porcentagem" : "Rateio por Prioridade"}
                </p>
                <p className="text-sm text-blue-700">
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
        <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <Zap className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">{selectedGeradora.apelido}</CardTitle>
                  <CardDescription className="text-blue-700">Geradora selecionada para o rateio</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Ativa
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">UC da Geradora</p>
                <p className="text-2xl font-bold text-blue-900">{selectedGeradora.uc}</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Geração Estimada</p>
                <p className="text-2xl font-bold text-green-700">{selectedGeradora.geracao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de assinantes */}
      {selectedGeradora && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Selecionar Assinantes</CardTitle>
                  <CardDescription>
                    Escolha os assinantes e defina os valores para o rateio
                  </CardDescription>
                </div>
              </div>
              {selecionados.length > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  {selecionados.length} selecionados
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingSubscribers ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 font-medium">Carregando assinantes...</p>
              </div>
            ) : (
              <>
                {assinantes.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                      <Users className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700 mb-2">Nenhum assinante encontrado</p>
                      <p className="text-gray-500">Cadastre assinantes antes de criar um rateio</p>
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
        <Card className={`border-l-4 shadow-lg ${validSubmit ? 'border-green-500 bg-green-50/50' : 'border-yellow-500 bg-yellow-50/50'}`}>
          <CardContent className="pt-6">
            {!validSubmit && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="font-medium text-yellow-800">{statusMsg}</AlertDescription>
              </Alert>
            )}
            
            {validSubmit && tipoRateio === "porcentagem" && (
              <div className="flex items-center gap-4 text-green-700 bg-green-100 p-4 rounded-lg">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold text-lg">Configuração válida!</p>
                  <p className="text-green-600">Soma total: {somaPorcentagens}% ✅</p>
                </div>
              </div>
            )}
            
            {validSubmit && tipoRateio === "prioridade" && (
              <div className="flex items-center gap-4 text-green-700 bg-green-100 p-4 rounded-lg">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold text-lg">Prioridades configuradas corretamente!</p>
                  <p className="text-green-600">Todas as prioridades são únicas ✅</p>
                </div>
              </div>
            )}
            
            {hasPriorityDuplicate && (
              <div className="text-sm text-red-600 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                Prioridades devem ser únicas
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botão de ação */}
      {selectedGeradora && selecionados.length > 0 && (
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoadingSubscribers || !validSubmit}
            size="lg"
            className="h-14 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-3" />
                Cadastrando Rateio...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-5 w-5" />
                Cadastrar Rateio
                <ArrowRight className="ml-3 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Orientação inicial */}
      {!selectedGeradora && !isLoadingGenerators && (
        <Card className="border-dashed border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50">
          <CardContent className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Zap className="h-12 w-12 text-blue-500" />
            </div>
            <div className="text-center space-y-3">
              <p className="text-2xl font-bold text-gray-700">Começar novo rateio</p>
              <p className="text-gray-500 text-lg">Selecione uma geradora acima para continuar com a configuração</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadastrarRateio;
