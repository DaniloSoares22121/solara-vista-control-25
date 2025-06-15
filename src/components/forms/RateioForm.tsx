
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Save, X, Zap, Users, AlertCircle, Info, Calculator, 
  Plus, Trash2, Settings, Target, Percent, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { RateioFormData, RateioConfiguracao, RateioItem } from '@/types/rateio';
import { useRateio } from '@/hooks/useRateio';
import { useSubscribers } from '@/hooks/useSubscribers';

interface RateioFormProps {
  onSubmit: (data: RateioFormData) => void;
  onCancel: () => void;
}

const RateioForm: React.FC<RateioFormProps> = ({ onSubmit, onCancel }) => {
  const { 
    getGeradoras, 
    getAssinantes,
    getAssinantesVinculados,
    validateRateio,
    calculateDistribuicao
  } = useRateio();
  const { subscribers, isLoading: assinantesLoading } = useSubscribers();

  const geradoras = getGeradoras();
  const assinantes = getAssinantes();

  const [configuracao, setConfiguracao] = useState<RateioConfiguracao>({
    geradoraId: '',
    novoAssinanteId: '',
    tipoRateio: 'porcentagem',
    geracaoEsperada: 0
  });

  const [rateioItems, setRateioItems] = useState<RateioItem[]>([]);
  const [validation, setValidation] = useState<any>({ isValid: true, errors: [], warnings: [] });
  const [currentStep, setCurrentStep] = useState(1);
  const [assinantesSelecionados, setAssinantesSelecionados] = useState<string[]>([]);

  // Define a geradora que o usuário selecionou
  const selectedGeradora = geradoras.find(g => g.id === configuracao.geradoraId);

  // Etapa 1: Seleção da Geradora
  useEffect(() => {
    // Ao selecionar a geradora, configura a geração esperada e avança para etapa 2
    if (configuracao.geradoraId) {
      const geradora = geradoras.find(g => g.id === configuracao.geradoraId);
      if (geradora) {
        setConfiguracao(prev => ({ 
          ...prev, 
          geracaoEsperada: geradora.geracaoNumero,
          geradora: geradora
        }));
      }
    }
  }, [configuracao.geradoraId, geradoras]);

  // Só exibe assinantes vinculados após seleção da geradora
  const assinantesVinculados = React.useMemo(() => {
    if (!selectedGeradora) return [];
    // Pega assinantes vinculados a esta geradora
    return getAssinantesVinculados(selectedGeradora.id);
  }, [selectedGeradora, getAssinantesVinculados]);

  // Quando marcar/desmarcar, atualiza os rateioItems (de acordo com checkboxes)
  useEffect(() => {
    if (assinantesSelecionados.length > 0) {
      const novos = assinantesVinculados
        .filter(a => assinantesSelecionados.includes(a.assinanteId))
        .map((assinante) => ({
          ...assinante,
          porcentagem: configuracao.tipoRateio === 'porcentagem' ? 0 : undefined,
          prioridade: configuracao.tipoRateio === 'prioridade' ? undefined : undefined,
          isNew: true,
        }));
      setRateioItems(novos);
    } else {
      setRateioItems([]);
    }
    // eslint-disable-next-line
  }, [assinantesSelecionados, configuracao.tipoRateio, assinantesVinculados]);

  // Validação ao modificar items
  useEffect(() => {
    if (rateioItems.length > 0) {
      const newValidation = validateRateio(rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada);
      setValidation(newValidation);
    }
  }, [rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada, validateRateio]);

  // Atualização ao avançar etapa
  const handleContinue = () => {
    if (selectedGeradora) {
      setCurrentStep(2);
    }
  };

  // Etapa 2: campos editáveis de rateio
  const handleItemChange = (assinanteId: string, field: 'porcentagem' | 'prioridade', value: number) => {
    setRateioItems(prev => prev.map(item => 
      item.assinanteId === assinanteId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;
    const rateioCalculado = calculateDistribuicao(rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada);
    onSubmit({
      configuracao,
      rateioItems: rateioCalculado
    });
  };

  // UI/UX melhorado: stepper + simples
  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-xl">
          <CardTitle className="text-white flex items-center space-x-3">
            <Calculator className="w-7 h-7 mr-1" />
            <span>Novo Rateio de Energia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Stepper/Progress */}
          <div className="flex items-center justify-center space-x-8 mb-7">
            <div className={`flex flex-col items-center transition-all`}>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${currentStep === 1 ? "bg-green-700" : "bg-green-400"}`}>
                1
              </div>
              <span className={`mt-2 text-sm font-semibold ${currentStep === 1 ? "text-green-700" : "text-gray-500"}`}>Geradora</span>
            </div>
            <div className="h-1 w-12 bg-gray-300 rounded" />
            <div className={`flex flex-col items-center transition-all`}>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${currentStep === 2 ? "bg-blue-700" : "bg-blue-400"}`}>
                2
              </div>
              <span className={`mt-2 text-sm font-semibold ${currentStep === 2 ? "text-blue-700" : "text-gray-500"}`}>Assinantes</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Etapa 1: Geradora */}
            {currentStep === 1 && (
              <>
                <Label className="font-semibold text-lg">Selecione a Geradora</Label>
                <Select value={configuracao.geradoraId} onValueChange={value => setConfiguracao(prev => ({ ...prev, geradoraId: value }))}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Escolha a geradora..." />
                  </SelectTrigger>
                  <SelectContent>
                    {geradoras.map(geradora => (
                      <SelectItem key={geradora.id} value={geradora.id}>
                        <div>
                          <div className="font-semibold text-base">{geradora.apelido}</div>
                          <div className="text-xs text-gray-600">UC: {geradora.uc} | Geração: {geradora.geracao}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  disabled={!selectedGeradora}
                  className="mt-7 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={handleContinue}
                >
                  Selecionar e Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}

            {/* Etapa 2: Assinantes vinculados */}
            {currentStep === 2 && (
              <>
                <div className="mb-3 flex items-center gap-2">
                  <Button type="button" variant="outline" className="px-4 py-2" onClick={() => setCurrentStep(1)}>
                    <ArrowRight className="w-4 h-4 rotate-180 mr-2" /> Voltar
                  </Button>
                  <h3 className="font-bold text-lg">Assinantes vinculados</h3>
                </div>
                <Label className="mb-2">Selecione os assinantes que vão receber energia desta geradora:</Label>
                {assinantesVinculados.length === 0 && (
                  <div className="border border-dashed border-orange-300 bg-orange-50 rounded-xl px-4 py-4 text-center text-orange-700 font-semibold">
                    Nenhum assinante está vinculado a esta geradora ainda.
                  </div>
                )}
                {assinantesVinculados.length > 0 && (
                  <div className="space-y-2">
                    {assinantesVinculados.map(a => (
                      <label key={a.assinanteId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition">
                        <input
                          type="checkbox"
                          checked={assinantesSelecionados.includes(a.assinanteId)}
                          onChange={e => {
                            setAssinantesSelecionados(prev =>
                              e.target.checked
                                ? [...prev, a.assinanteId]
                                : prev.filter(id => id !== a.assinanteId)
                            );
                          }}
                          className="accent-blue-600 w-5 h-5"
                        />
                        <span className="font-bold">{a.nome}</span>
                        <span className="text-xs text-gray-500 ml-2">UC: {a.uc}</span>
                        <span className="text-xs text-gray-400 ml-2">{a.consumoNumero} kWh</span>
                      </label>
                    ))}
                  </div>
                )}
                {rateioItems.length > 0 && (
                  <>
                    <div className="mt-6 px-2">
                      <Label className="font-semibold block mb-1">Tipo de distribuição</Label>
                      <Select value={configuracao.tipoRateio} onValueChange={(value: 'porcentagem' | 'prioridade') => setConfiguracao(prev => ({ ...prev, tipoRateio: value }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="porcentagem">
                            <div className="flex items-center space-x-3 py-2">
                              <Percent className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold">Por Porcentagem</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="prioridade">
                            <div className="flex items-center space-x-3 py-2">
                              <Target className="w-5 h-5 text-purple-600" />
                              <span className="font-semibold">Por Prioridade</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-6 mb-4">
                      <Label className="font-semibold block mb-1">Geração Esperada (kWh)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={configuracao.geracaoEsperada}
                        onChange={e => setConfiguracao(prev => ({ ...prev, geracaoEsperada: parseFloat(e.target.value) || 0 }))}
                        className="h-12 text-lg font-semibold"
                      />
                    </div>
                    <div className="rounded-xl bg-white border shadow p-2 overflow-x-auto mb-4">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-bold">Assinante</TableHead>
                            <TableHead className="font-bold">UC</TableHead>
                            <TableHead className="font-bold">Consumo</TableHead>
                            <TableHead className="font-bold">
                              {configuracao.tipoRateio === 'porcentagem' ? 'Porcentagem (%)' : 'Prioridade'}
                            </TableHead>
                            <TableHead className="font-bold">Energia Alocada</TableHead>
                            <TableHead className="font-bold">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rateioItems.map(item => (
                            <TableRow key={item.assinanteId} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900 text-base">{item.nome}</span>
                                  <span className="text-xs text-gray-500">UC: {item.uc}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">{item.uc}</TableCell>
                              <TableCell>
                                <span className="font-medium text-gray-800">{item.consumoNumero.toLocaleString()} kWh</span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max={configuracao.tipoRateio === 'porcentagem' ? "100" : undefined}
                                  step={configuracao.tipoRateio === 'porcentagem' ? "0.1" : "1"}
                                  value={configuracao.tipoRateio === 'porcentagem' ? item.porcentagem || 0 : item.prioridade || 0}
                                  onChange={e => handleItemChange(
                                    item.assinanteId,
                                    configuracao.tipoRateio === 'porcentagem' ? 'porcentagem' : 'prioridade',
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="w-24 text-center font-semibold"
                                />
                              </TableCell>
                              <TableCell className="font-semibold">
                                {item.valorAlocado ? `${item.valorAlocado.toLocaleString()} kWh` : '-'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setRateioItems(prev => prev.filter(r => r.assinanteId !== item.assinanteId))}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Validação */}
                    {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                      <div className="space-y-3">
                        {validation.errors.map((error, index) => (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <span className="text-red-800 font-medium">{error}</span>
                          </div>
                        ))}
                        {validation.warnings.map((warning, index) => (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                            <span className="text-yellow-800 font-medium">{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Resumo */}
                    {validation.isValid && (
                      <div className="p-3 mt-3 bg-blue-50 border-2 border-blue-100 rounded-xl text-center text-base">
                        <span className="mr-4">Geração Esperada: <b>{configuracao.geracaoEsperada.toLocaleString()} kWh</b></span>
                        <span className="mr-4">Distribuída: <b>{rateioItems.reduce((sum, item) => sum + (item.valorAlocado || 0), 0).toLocaleString()} kWh</b></span>
                        <span className="mr-2">Disponível: <b>{validation.energiaSobra?.toLocaleString() || 0} kWh</b></span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex gap-4 justify-end mt-6">
                  <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancelar</Button>
                  <Button
                    type="submit"
                    className="px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={rateioItems.length === 0 || !validation.isValid}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Criar Rateio
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateioForm;
