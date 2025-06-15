
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, Save, X, Zap, Users, AlertCircle, Info, Calculator, 
  Plus, Trash2, Settings, Target, Percent 
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

  const currentDate = new Date();
  const [configuracao, setConfiguracao] = useState<RateioConfiguracao>({
    geradoraId: '',
    novoAssinanteId: '',
    tipoRateio: 'porcentagem',
    dia: currentDate.getDate(),
    mes: currentDate.getMonth() + 1,
    ano: currentDate.getFullYear(),
    geracaoEsperada: 0
  });

  const [rateioItems, setRateioItems] = useState<RateioItem[]>([]);
  const [validation, setValidation] = useState<any>({ isValid: true, errors: [], warnings: [] });

  // Carregar assinantes vinculados quando geradora é selecionada
  useEffect(() => {
    if (configuracao.geradoraId) {
      const assinantesVinculados = getAssinantesVinculados(configuracao.geradoraId);
      setRateioItems(assinantesVinculados as RateioItem[]);
      
      const geradora = geradoras.find(g => g.id === configuracao.geradoraId);
      if (geradora) {
        setConfiguracao(prev => ({ ...prev, geracaoEsperada: geradora.geracaoNumero }));
      }
    }
  }, [configuracao.geradoraId]);

  // Validar sempre que items mudarem
  useEffect(() => {
    if (rateioItems.length > 0) {
      const newValidation = validateRateio(rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada);
      setValidation(newValidation);
    }
  }, [rateioItems, configuracao.tipoRateio, configuracao.geracaoEsperada]);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configuração de Rateio</h2>
              <p className="text-gray-600 mt-1">Configure a distribuição de energia entre assinantes</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção 1: Seleção da Geradora */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <Label className="text-lg font-semibold text-gray-900">1. Selecione a Geradora</Label>
              </div>
              
              <Select value={configuracao.geradoraId} onValueChange={value => setConfiguracao(prev => ({ ...prev, geradoraId: value }))}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Busque por nome ou UC da geradora..." />
                </SelectTrigger>
                <SelectContent>
                  {geradoras.map(geradora => (
                    <SelectItem key={geradora.id} value={geradora.id}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{geradora.apelido}</div>
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
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Geradora Selecionada</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-green-700">Nome:</span> <span className="font-medium">{selectedGeradora.apelido}</span></div>
                    <div><span className="text-green-700">UC:</span> <span className="font-medium">{selectedGeradora.uc}</span></div>
                    <div><span className="text-green-700">Geração:</span> <span className="font-medium">{selectedGeradora.geracao}</span></div>
                    <div><span className="text-green-700">Já Alocado:</span> <span className="font-medium">{selectedGeradora.percentualAlocado}%</span></div>
                  </div>
                </div>
              )}
            </div>

            {configuracao.geradoraId && (
              <>
                {/* Seção 2: Configuração do Rateio */}
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold text-gray-900">2. Configuração do Rateio</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label>Tipo de Rateio</Label>
                      <Select value={configuracao.tipoRateio} onValueChange={(value: 'porcentagem' | 'prioridade') => setConfiguracao(prev => ({ ...prev, tipoRateio: value }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="porcentagem">
                            <div className="flex items-center space-x-2">
                              <Percent className="w-4 h-4" />
                              <span>Por Porcentagem</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="prioridade">
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4" />
                              <span>Por Prioridade</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Data do Rateio</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input 
                          type="number" 
                          min="1" 
                          max="31" 
                          value={configuracao.dia}
                          onChange={e => setConfiguracao(prev => ({ ...prev, dia: parseInt(e.target.value) }))}
                          className="w-20"
                        />
                        <Select value={configuracao.mes.toString()} onValueChange={value => setConfiguracao(prev => ({ ...prev, mes: parseInt(value) }))}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {(i + 1).toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          type="number" 
                          min="2020" 
                          value={configuracao.ano}
                          onChange={e => setConfiguracao(prev => ({ ...prev, ano: parseInt(e.target.value) }))}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Geração Esperada (kWh)</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={configuracao.geracaoEsperada}
                        onChange={e => setConfiguracao(prev => ({ ...prev, geracaoEsperada: parseFloat(e.target.value) || 0 }))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 3: Adicionar Novo Assinante */}
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold text-gray-900">3. Adicionar Novo Assinante (Opcional)</Label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Select value={configuracao.novoAssinanteId} onValueChange={value => setConfiguracao(prev => ({ ...prev, novoAssinanteId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um assinante para adicionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {assinantesDisponiveis.map(assinante => (
                            <SelectItem key={assinante.id} value={assinante.id}>
                              <div>
                                <div className="font-medium">{assinante.nome}</div>
                                <div className="text-sm text-gray-500">
                                  UC: {assinante.uc} • {assinante.consumoContratado}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={handleAddAssinante} disabled={!configuracao.novoAssinanteId}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {/* Seção 4: Distribuição */}
                {rateioItems.length > 0 && (
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-orange-600" />
                        <Label className="text-lg font-semibold text-gray-900">4. Configurar Distribuição</Label>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {configuracao.tipoRateio === 'porcentagem' 
                          ? `Total: ${validation.totalPercentual?.toFixed(1) || 0}%`
                          : `${rateioItems.length} assinante(s) por prioridade`
                        }
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assinante</TableHead>
                          <TableHead>UC</TableHead>
                          <TableHead>Consumo</TableHead>
                          <TableHead>
                            {configuracao.tipoRateio === 'porcentagem' ? 'Porcentagem (%)' : 'Prioridade'}
                          </TableHead>
                          <TableHead>Energia Alocada</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead width="80">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rateioItems.map((item) => (
                          <TableRow key={item.assinanteId}>
                            <TableCell className="font-medium">{item.nome}</TableCell>
                            <TableCell>{item.uc}</TableCell>
                            <TableCell>{item.consumoNumero} kWh</TableCell>
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
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              {item.valorAlocado ? `${item.valorAlocado.toLocaleString()} kWh` : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={item.isNew ? "default" : "secondary"}>
                                {item.isNew ? "Novo" : "Existente"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveAssinante(item.assinanteId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Validação */}
                    {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                      <div className="space-y-2">
                        {validation.errors.map((error, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">{error}</span>
                          </div>
                        ))}
                        
                        {validation.warnings.map((warning, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Info className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800">{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resumo da Distribuição */}
                    {validation.isValid && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Resumo da Distribuição</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Geração Esperada:</span>
                            <div className="font-medium">{configuracao.geracaoEsperada.toLocaleString()} kWh</div>
                          </div>
                          <div>
                            <span className="text-blue-700">Energia Distribuída:</span>
                            <div className="font-medium">
                              {rateioItems.reduce((sum, item) => sum + (item.valorAlocado || 0), 0).toLocaleString()} kWh
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700">Energia Sobrando:</span>
                            <div className="font-medium">
                              {validation.energiaSobra?.toLocaleString() || 0} kWh
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700" 
                    disabled={!validation.isValid || rateioItems.length === 0}
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
