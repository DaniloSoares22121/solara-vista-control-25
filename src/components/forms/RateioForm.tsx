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
import { RateioFormData, RateioConfiguracao, RateioItem, Geradora, Assinante } from '@/types/rateio';
import { useRateio } from '@/hooks/useRateio';

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

  // NOVO: seleção múltipla de assinantes na etapa 1
  const [assinantesSelecionados, setAssinantesSelecionados] = useState<string[]>([]);

  // Carregar assinantes vinculados quando geradora é selecionada
  useEffect(() => {
    if (configuracao.geradoraId) {
      const assinantesVinculados = getAssinantesVinculados(configuracao.geradoraId);
      setRateioItems(assinantesVinculados as RateioItem[]);
      
      const geradora = geradoras.find(g => g.id === configuracao.geradoraId);
      if (geradora) {
        setConfiguracao(prev => ({ 
          ...prev, 
          geracaoEsperada: geradora.geracaoNumero,
          geradora: geradora
        }));
      }
      setCurrentStep(2);
    }
  }, [configuracao.geradoraId]);

  // NOVO: lista de assinantes elegíveis baseados na concessionária da geradora
  const assinantesElegiveis = assinantes.filter(a =>
    (!selectedGeradora || a.concessionaria === selectedGeradora.concessionaria)
  );

  // Validar sempre que items mudarem
  useEffect(() => {
    if (rateioItems.length > 0) {
      const newValidation = validateRateio(rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada);
      setValidation(newValidation);
    }
  }, [rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada]);

  // NOVO: quando muda a lista de selecionados, monta os rateioItems
  useEffect(() => {
    if (assinantesSelecionados.length > 0 && currentStep === 1 && configuracao.geradoraId) {
      const novos = assinantes
        .filter(a =>
          assinantesSelecionados.includes(a.id) &&
          (!selectedGeradora || a.concessionaria === selectedGeradora.concessionaria)
        )
        .map((assinante) => ({
          assinanteId: assinante.id,
          nome: assinante.nome,
          uc: assinante.uc,
          consumoNumero: assinante.consumoNumero,
          porcentagem: configuracao.tipoRateio === 'porcentagem' ? 0 : undefined,
          prioridade: configuracao.tipoRateio === 'prioridade' ? undefined : undefined,
          isNew: true,
        }));
      setRateioItems(novos);
    }
    // Limpa caso des-selecione todos
    if (assinantesSelecionados.length === 0 && currentStep === 1) {
      setRateioItems([]);
    }
    // eslint-disable-next-line
  }, [assinantesSelecionados, currentStep, configuracao.geradoraId]);

  const handleAddAssinante = () => {
    if (!configuracao.novoAssinanteId) return;
    
    const assinante = assinantes.find(a => a.id === configuracao.novoAssinanteId);
    if (!assinante) return;

    const novoItem: RateioItem = {
      assinanteId: assinante.id,
      nome: assinante.nome,
      uc: assinante.uc,
      consumoNumero: assinante.consumoNumero,
      porcentagem: configuracao.tipoRateio === 'porcentagem' ? 0 : undefined,
      prioridade: configuracao.tipoRateio === 'prioridade' ? rateioItems.length + 1 : undefined,
      isNew: true
    };

    setRateioItems(prev => [...prev, novoItem]);
    setConfiguracao(prev => ({ ...prev, novoAssinanteId: '' }));
  };

  const handleRemoveAssinante = (assinanteId: string) => {
    setRateioItems(prev => prev.filter(item => item.assinanteId !== assinanteId));
  };

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

  const selectedGeradora = geradoras.find(g => g.id === configuracao.geradoraId);
  const assinantesDisponiveis = assinantes.filter(a => 
    !rateioItems.some(item => item.assinanteId === a.id) &&
    (!selectedGeradora || a.concessionaria === selectedGeradora.concessionaria)
  );

  const canProceed = currentStep === 1 ? configuracao.geradoraId : rateioItems.length > 0 && validation.isValid;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
          </div>
          <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
            Selecionar Geradora
          </span>
          
          <ArrowRight className="w-4 h-4 text-gray-400" />
          
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
            Configurar Distribuição
          </span>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Novo Rateio de Energia</h2>
              <p className="text-green-100 mt-1">Configure a distribuição inteligente entre assinantes</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Etapa 1: Seleção da Geradora */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <Zap className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Selecione a Geradora</h3>
                  <p className="text-gray-600">Escolha qual geradora solar será utilizada para este rateio</p>
                </div>
                
                <Select value={configuracao.geradoraId} onValueChange={value => setConfiguracao(prev => ({ ...prev, geradoraId: value }))}>
                  <SelectTrigger className="h-16 text-lg">
                    <SelectValue placeholder="🔍 Busque por nome ou UC da geradora..." />
                  </SelectTrigger>
                  <SelectContent>
                    {geradoras.map(geradora => (
                      <SelectItem key={geradora.id} value={geradora.id}>
                        <div className="flex items-center justify-between w-full py-2">
                          <div>
                            <div className="font-semibold text-lg">{geradora.apelido}</div>
                            <div className="text-sm text-gray-500">
                              UC: {geradora.uc} • {geradora.geracao} • {geradora.percentualAlocado}% alocado
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedGeradora && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-fade-in">
                    <div className="flex items-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-bold text-green-800 text-lg">Geradora Selecionada</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <span className="text-green-700 font-medium">Nome:</span>
                        <div className="font-bold text-gray-900">{selectedGeradora.apelido}</div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-green-700 font-medium">UC:</span>
                        <div className="font-bold text-gray-900">{selectedGeradora.uc}</div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-green-700 font-medium">Geração Mensal:</span>
                        <div className="font-bold text-gray-900">{selectedGeradora.geracao}</div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-green-700 font-medium">Já Alocado:</span>
                        <div className="font-bold text-gray-900">{selectedGeradora.percentualAlocado}%</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedGeradora && (
                  <>
                    <div className="mt-8 p-6 bg-gradient-to-l from-blue-50 via-gray-50 to-green-50 rounded-xl border">
                      <Label className="text-base font-semibold mb-2">Selecione os Assinantes vinculados</Label>
                      <div>
                        <select
                          multiple
                          value={assinantesSelecionados}
                          onChange={e => {
                            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                            setAssinantesSelecionados(selected);
                          }}
                          className="w-full h-40 border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400"
                        >
                          {assinantesElegiveis.map(assinante => (
                            <option key={assinante.id} value={assinante.id}>
                              {assinante.nome} • UC: {assinante.uc} • {assinante.consumoContratado}
                            </option>
                          ))}
                        </select>
                        <div className="text-xs text-gray-500 mt-2">
                          Segure Ctrl (Windows) ou Command (Mac) para selecionar vários.
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-600">
                          {assinantesSelecionados.length === 0
                            ? 'Nenhum assinante selecionado'
                            : `${assinantesSelecionados.length} assinante(s) selecionado(s)`}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Etapa 2: Configuração */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                {/* Configuração do Tipo */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Configuração do Rateio</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Tipo de Distribuição</Label>
                      <Select value={configuracao.tipoRateio} onValueChange={(value: 'porcentagem' | 'prioridade') => setConfiguracao(prev => ({ ...prev, tipoRateio: value }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="porcentagem">
                            <div className="flex items-center space-x-3 py-2">
                              <Percent className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="font-semibold">Por Porcentagem</div>
                                <div className="text-sm text-gray-500">Cada assinante recebe % fixo</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="prioridade">
                            <div className="flex items-center space-x-3 py-2">
                              <Target className="w-5 h-5 text-purple-600" />
                              <div>
                                <div className="font-semibold">Por Prioridade</div>
                                <div className="text-sm text-gray-500">Distribuição sequencial por ordem</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Geração Esperada (kWh)</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={configuracao.geracaoEsperada}
                        onChange={e => setConfiguracao(prev => ({ ...prev, geracaoEsperada: parseFloat(e.target.value) || 0 }))}
                        className="h-12 text-lg font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Adicionar Novo Assinante */}
                {assinantesDisponiveis.length > 0 && (
                  <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <Label className="text-lg font-semibold text-gray-900">Adicionar Novo Assinante</Label>
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Select value={configuracao.novoAssinanteId} onValueChange={value => setConfiguracao(prev => ({ ...prev, novoAssinanteId: value }))}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione um assinante para adicionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            {assinantesDisponiveis.map(assinante => (
                              <SelectItem key={assinante.id} value={assinante.id}>
                                <div className="py-1">
                                  <div className="font-semibold">{assinante.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    UC: {assinante.uc} • {assinante.consumoContratado}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="button" 
                        onClick={handleAddAssinante} 
                        disabled={!configuracao.novoAssinanteId}
                        className="h-12 px-6"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Tabela de Distribuição */}
                {rateioItems.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calculator className="w-6 h-6 text-orange-600" />
                        <h3 className="text-xl font-bold text-gray-900">Configurar Distribuição</h3>
                      </div>
                      
                      <div className="text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-lg border">
                        {configuracao.tipoRateio === 'porcentagem' 
                          ? `Total: ${validation.totalPercentual?.toFixed(1) || 0}%`
                          : `${rateioItems.length} assinante(s)`
                        }
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
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
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rateioItems.map((item) => (
                            <TableRow key={item.assinanteId} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{item.nome}</TableCell>
                              <TableCell className="font-mono">{item.uc}</TableCell>
                              <TableCell>{item.consumoNumero.toLocaleString()} kWh</TableCell>
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
                                <Badge variant={item.isNew ? "default" : "secondary"} className="font-medium">
                                  {item.isNew ? "Novo" : "Existente"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveAssinante(item.assinanteId)}
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

                    {/* Resumo da Distribuição */}
                    {validation.isValid && (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                        <h4 className="font-bold text-blue-800 mb-4 text-lg">📊 Resumo da Distribuição</h4>
                        <div className="grid grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{configuracao.geracaoEsperada.toLocaleString()}</div>
                            <div className="text-sm text-blue-700 font-medium">kWh Geração Esperada</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-900">
                              {rateioItems.reduce((sum, item) => sum + (item.valorAlocado || 0), 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-green-700 font-medium">kWh Distribuída</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-900">
                              {validation.energiaSobra?.toLocaleString() || 0}
                            </div>
                            <div className="text-sm text-orange-700 font-medium">kWh Disponível</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-between pt-8 border-t">
              <Button type="button" variant="outline" onClick={onCancel} className="px-8">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              <div className="flex space-x-4">
                {currentStep === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="px-6"
                  >
                    Voltar
                  </Button>
                )}
                
                <Button 
                  type={currentStep === 2 ? "submit" : "button"}
                  onClick={currentStep === 1 ? () => setCurrentStep(2) : undefined}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8" 
                  disabled={!canProceed}
                >
                  {currentStep === 1 ? (
                    <>
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Rateio
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateioForm;
