
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Calculator, History, Zap, Check, X, Plus, Eye, FileText, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useRateio } from '@/hooks/useRateio';
import { RateioData, RateioSubscriber } from '@/types/rateio';
import { toast } from 'sonner';

const Rateio = () => {
  const {
    selectedGenerator,
    selectedSubscriber,
    subscribersByGenerator,
    generators,
    subscribers,
    selectGenerator,
    selectSubscriber,
    createRateio,
    getRateiosByGenerator,
    resetSelections,
    loading
  } = useRateio();

  const [searchGenerator, setSearchGenerator] = useState('');
  const [searchSubscriber, setSearchSubscriber] = useState('');
  const [searchHistoryGenerator, setSearchHistoryGenerator] = useState('');
  const [confirmSubscriber, setConfirmSubscriber] = useState(false);
  const [rateioType, setRateioType] = useState<'percentage' | 'priority'>('percentage');
  const [rateioDate, setRateioDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [expectedGeneration, setExpectedGeneration] = useState(0);
  const [editableSubscribers, setEditableSubscribers] = useState<RateioSubscriber[]>([]);
  const [showCreateRateio, setShowCreateRateio] = useState(false);
  const [historyGenerator, setHistoryGenerator] = useState<any>(null);
  const [selectedRateioHistory, setSelectedRateioHistory] = useState<RateioData | null>(null);

  // Filtrar geradoras para busca
  const filteredGenerators = generators.filter(g => 
    g.owner?.name?.toLowerCase().includes(searchGenerator.toLowerCase()) ||
    g.plants?.some((p: any) => p.uc?.includes(searchGenerator))
  );

  // Filtrar assinantes para busca
  const filteredSubscribers = subscribers.filter(s =>
    s.subscriber?.name?.toLowerCase().includes(searchSubscriber.toLowerCase()) ||
    s.energyAccount?.originalAccount?.uc?.includes(searchSubscriber)
  );

  // Filtrar geradoras para histórico
  const filteredHistoryGenerators = generators.filter(g => 
    g.owner?.name?.toLowerCase().includes(searchHistoryGenerator.toLowerCase()) ||
    g.plants?.some((p: any) => p.uc?.includes(searchHistoryGenerator))
  );

  // Função para confirmar assinante
  const handleConfirmSubscriber = (confirm: boolean) => {
    setConfirmSubscriber(confirm);
    if (confirm && selectedSubscriber) {
      // Adicionar assinante à lista editável se não existir
      const existingSubscriber = editableSubscribers.find(s => s.id === selectedSubscriber.id);
      if (!existingSubscriber) {
        const newSubscriber = {
          ...selectedSubscriber,
          percentage: rateioType === 'percentage' ? 0 : undefined,
          priority: rateioType === 'priority' ? editableSubscribers.length + 1 : undefined
        };
        setEditableSubscribers(prev => [...prev, newSubscriber]);
      }
    }
  };

  // Função para atualizar porcentagem/prioridade
  const updateSubscriberValue = (subscriberId: string, field: 'percentage' | 'priority', value: number) => {
    setEditableSubscribers(prev => prev.map(sub => 
      sub.id === subscriberId 
        ? { ...sub, [field]: value }
        : sub
    ));
  };

  // Função para salvar rateio
  const handleSaveRateio = async () => {
    if (!selectedGenerator || editableSubscribers.length === 0) {
      toast.error('Selecione uma geradora e adicione pelo menos um assinante');
      return;
    }

    try {
      const rateioData: RateioData = {
        generatorId: selectedGenerator.id,
        generator: selectedGenerator,
        type: rateioType,
        date: rateioDate,
        expectedGeneration,
        subscribers: editableSubscribers
      };

      await createRateio(rateioData);
      
      // Reset form
      resetSelections();
      setEditableSubscribers([]);
      setConfirmSubscriber(false);
      setShowCreateRateio(false);
      
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Calcular total de porcentagem
  const totalPercentage = editableSubscribers.reduce((sum, sub) => sum + (sub.percentage || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de Rateio</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Gerencie a distribuição de energia entre geradoras e assinantes.</p>
          </div>
          
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assinantes" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-white rounded-xl border border-gray-200 p-1 gap-1 sm:gap-0">
            <TabsTrigger 
              value="assinantes" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm p-2 sm:p-3"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Assinantes por Geradora</span>
              <span className="sm:hidden">Assinantes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cadastrar" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm p-2 sm:p-3"
            >
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cadastrar Rateio</span>
              <span className="sm:hidden">Cadastrar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historico" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm p-2 sm:p-3"
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Histórico de Rateios</span>
              <span className="sm:hidden">Histórico</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Assinantes por Geradora */}
          <TabsContent value="assinantes" className="mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Consultar Assinantes por Geradora</CardTitle>
                <CardDescription className="text-sm">
                  Selecione uma geradora para visualizar os assinantes vinculados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Buscar geradora por nome ou UC..."
                    className="pl-10 bg-gray-50 border-gray-200 h-10 sm:h-12 text-sm"
                    value={searchGenerator}
                    onChange={(e) => setSearchGenerator(e.target.value)}
                  />
                </div>

                {/* Lista de Geradoras */}
                {searchGenerator && (
                  <div className="space-y-3">
                    {filteredGenerators.map((generator) => (
                      <Card 
                        key={generator.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
                        onClick={() => selectGenerator(generator.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {generator.plants?.[0]?.apelido || generator.owner?.name || 'Geradora'}
                              </h3>
                              <p className="text-sm text-gray-600">UC: {generator.plants?.[0]?.uc || 'N/A'}</p>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              {generator.plants?.[0]?.geracaoProjetada || 0} kWh
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Informações da Geradora Selecionada */}
                {selectedGenerator && (
                  <div className="space-y-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="w-5 h-5 text-green-600" />
                          <h3 className="font-medium text-gray-900">Geradora Selecionada</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Apelido:</span>
                            <p className="font-medium">{selectedGenerator.nickname}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">UC:</span>
                            <p className="font-medium">{selectedGenerator.uc}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Geração:</span>
                            <p className="font-medium">{selectedGenerator.generation} kWh</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lista de Assinantes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Assinantes Vinculados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {subscribersByGenerator.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Nenhum assinante vinculado a esta geradora</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-2 text-gray-600">Nome</th>
                                  <th className="text-left py-2 text-gray-600">UC</th>
                                  <th className="text-left py-2 text-gray-600">Consumo Contratado</th>
                                  <th className="text-left py-2 text-gray-600">Crédito Acumulado</th>
                                  <th className="text-left py-2 text-gray-600">Percentual</th>
                                  <th className="text-left py-2 text-gray-600">Última Fatura</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subscribersByGenerator.map((subscriber) => (
                                  <tr key={subscriber.id} className="border-b border-gray-100">
                                    <td className="py-3 font-medium">{subscriber.name}</td>
                                    <td className="py-3">{subscriber.uc}</td>
                                    <td className="py-3">{subscriber.contractedConsumption} kWh</td>
                                    <td className="py-3">{subscriber.accumulatedCredit} kWh</td>
                                    <td className="py-3">{subscriber.percentage}%</td>
                                    <td className="py-3">{subscriber.lastInvoice}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Cadastrar Rateio */}
          <TabsContent value="cadastrar" className="mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Cadastrar Novo Rateio</CardTitle>
                <CardDescription className="text-sm">
                  Configure a distribuição de energia entre assinantes
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Seleção de Geradora */}
                {!selectedGenerator && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. Selecionar Geradora</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Buscar geradora por nome ou UC..."
                        className="pl-10 bg-white border-gray-300 h-12 text-sm"
                        value={searchGenerator}
                        onChange={(e) => setSearchGenerator(e.target.value)}
                      />
                    </div>

                    {searchGenerator && (
                      <div className="space-y-3">
                        {filteredGenerators.map((generator) => (
                          <Card 
                            key={generator.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              selectGenerator(generator.id);
                              setExpectedGeneration(generator.plants?.[0]?.geracaoProjetada || 0);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">
                                    {generator.plants?.[0]?.apelido || generator.owner?.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">UC: {generator.plants?.[0]?.uc}</p>
                                </div>
                                <Badge variant="outline" className="text-green-600">
                                  {generator.plants?.[0]?.geracaoProjetada} kWh
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Informações da Geradora e Seleção de Assinante */}
                {selectedGenerator && !showCreateRateio && (
                  <div className="space-y-6">
                    {/* Informações da Geradora */}
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="w-5 h-5 text-green-600" />
                          <h3 className="font-medium">Geradora Selecionada</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Apelido:</span>
                            <p className="font-medium">{selectedGenerator.nickname}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">UC:</span>
                            <p className="font-medium">{selectedGenerator.uc}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Geração:</span>
                            <p className="font-medium">{selectedGenerator.generation} kWh</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Seleção de Assinante */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">2. Selecionar Assinante</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input 
                          placeholder="Buscar assinante por nome ou UC..."
                          className="pl-10 bg-white border-gray-300 h-12 text-sm"
                          value={searchSubscriber}
                          onChange={(e) => setSearchSubscriber(e.target.value)}
                        />
                      </div>

                      {searchSubscriber && (
                        <div className="space-y-3">
                          {filteredSubscribers.map((subscriber) => (
                            <Card 
                              key={subscriber.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => selectSubscriber(subscriber.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium">{subscriber.subscriber?.name}</h3>
                                    <p className="text-sm text-gray-600">
                                      UC: {subscriber.energyAccount?.originalAccount?.uc}
                                    </p>
                                  </div>
                                  <Badge variant="outline">
                                    {subscriber.planContract?.kwhContratado} kWh/mês
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Confirmação do Assinante */}
                    {selectedSubscriber && !confirmSubscriber && (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="font-medium">Confirmar Assinante</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-600">Nome:</span>
                              <p className="font-medium">{selectedSubscriber.name}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">UC:</span>
                              <p className="font-medium">{selectedSubscriber.uc}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Consumo Contratado:</span>
                              <p className="font-medium">{selectedSubscriber.contractedConsumption} kWh</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleConfirmSubscriber(true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Sim, confirmar
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleConfirmSubscriber(false)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Não, escolher outro
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Botão para prosseguir */}
                    {confirmSubscriber && (
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => setShowCreateRateio(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Prosseguir para Configuração
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Configuração do Rateio */}
                {showCreateRateio && selectedGenerator && (
                  <div className="space-y-6">
                    {/* Configurações do Rateio */}
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-4">Configurações do Rateio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Tipo de Rateio</label>
                            <Select value={rateioType} onValueChange={(value: 'percentage' | 'priority') => setRateioType(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Porcentagem</SelectItem>
                                <SelectItem value="priority">Prioridade</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Dia</label>
                            <Input 
                              type="number" 
                              min="1" 
                              max="31"
                              value={rateioDate.day}
                              onChange={(e) => setRateioDate(prev => ({...prev, day: Number(e.target.value)}))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Mês</label>
                            <Input 
                              type="number" 
                              min="1" 
                              max="12"
                              value={rateioDate.month}
                              onChange={(e) => setRateioDate(prev => ({...prev, month: Number(e.target.value)}))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Ano</label>
                            <Input 
                              type="number" 
                              min="2024"
                              value={rateioDate.year}
                              onChange={(e) => setRateioDate(prev => ({...prev, year: Number(e.target.value)}))}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Geração Esperada (kWh)</label>
                          <Input 
                            type="number"
                            value={expectedGeneration}
                            onChange={(e) => setExpectedGeneration(Number(e.target.value))}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lista de Assinantes para Edição */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Assinantes do Rateio</span>
                          {rateioType === 'percentage' && (
                            <Badge 
                              variant={Math.abs(totalPercentage - 100) < 0.01 ? "default" : "destructive"}
                              className="ml-2"
                            >
                              Total: {totalPercentage.toFixed(1)}%
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {editableSubscribers.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Nenhum assinante adicionado ao rateio</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-2">Nome</th>
                                  <th className="text-left py-2">UC</th>
                                  <th className="text-left py-2">Consumo</th>
                                  <th className="text-left py-2">Crédito</th>
                                  <th className="text-left py-2">
                                    {rateioType === 'percentage' ? 'Percentual' : 'Prioridade'}
                                  </th>
                                  <th className="text-left py-2">Última Fatura</th>
                                </tr>
                              </thead>
                              <tbody>
                                {editableSubscribers.map((subscriber) => (
                                  <tr key={subscriber.id} className="border-b border-gray-100">
                                    <td className="py-3 font-medium">{subscriber.name}</td>
                                    <td className="py-3">{subscriber.uc}</td>
                                    <td className="py-3">{subscriber.contractedConsumption} kWh</td>
                                    <td className="py-3">{subscriber.accumulatedCredit} kWh</td>
                                    <td className="py-3">
                                      <Input
                                        type="number"
                                        className="w-20 bg-yellow-50 border-yellow-300"
                                        value={rateioType === 'percentage' ? subscriber.percentage : subscriber.priority}
                                        onChange={(e) => updateSubscriberValue(
                                          subscriber.id, 
                                          rateioType, 
                                          Number(e.target.value)
                                        )}
                                        min={rateioType === 'percentage' ? 0 : 1}
                                        max={rateioType === 'percentage' ? 100 : editableSubscribers.length}
                                      />
                                    </td>
                                    <td className="py-3">{subscriber.lastInvoice || 'N/A'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Validações */}
                        {editableSubscribers.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {rateioType === 'percentage' && Math.abs(totalPercentage - 100) > 0.01 && (
                              <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                <span>A soma das porcentagens deve ser igual a 100%</span>
                              </div>
                            )}
                            {rateioType === 'priority' && (() => {
                              const priorities = editableSubscribers.map(s => s.priority).filter(p => p !== undefined);
                              const uniquePriorities = new Set(priorities);
                              const sortedPriorities = [...priorities].sort((a, b) => a! - b!);
                              const hasSequentialPriorities = sortedPriorities.every((p, i) => p === i + 1);
                              
                              return priorities.length !== uniquePriorities.size || !hasSequentialPriorities;
                            })() && (
                              <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                <span>As prioridades devem ser únicas e em sequência (1, 2, 3, ...)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Ações */}
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowCreateRateio(false);
                          setEditableSubscribers([]);
                          setConfirmSubscriber(false);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSaveRateio}
                        disabled={loading || editableSubscribers.length === 0}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? 'Salvando...' : 'Salvar Rateio'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Histórico de Rateios */}
          <TabsContent value="historico" className="mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <CardTitle className="text-lg sm:text-xl">Histórico de Rateios</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Consulte os rateios realizados anteriormente para uma geradora.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Selecionar Geradora</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      placeholder="Buscar geradora por nome ou UC..."
                      className="pl-10 bg-gray-50 border-gray-200 h-10 sm:h-12 text-sm"
                      value={searchHistoryGenerator}
                      onChange={(e) => setSearchHistoryGenerator(e.target.value)}
                    />
                  </div>
                </div>

                {/* Lista de Geradoras para Histórico */}
                {searchHistoryGenerator && (
                  <div className="space-y-3">
                    {filteredHistoryGenerators.map((generator) => (
                      <Card 
                        key={generator.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setHistoryGenerator(generator)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">
                                {generator.plants?.[0]?.apelido || generator.owner?.name}
                              </h3>
                              <p className="text-sm text-gray-600">UC: {generator.plants?.[0]?.uc}</p>
                            </div>
                            <Badge variant="outline" className="text-green-600">
                              {generator.plants?.[0]?.geracaoProjetada} kWh
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Histórico da Geradora Selecionada */}
                {historyGenerator && (
                  <div className="space-y-4">
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <h3 className="font-medium">Geradora Selecionada</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Apelido:</span>
                            <p className="font-medium">{historyGenerator.plants?.[0]?.apelido || historyGenerator.owner?.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">UC:</span>
                            <p className="font-medium">{historyGenerator.plants?.[0]?.uc}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Geração:</span>
                            <p className="font-medium">{historyGenerator.plants?.[0]?.geracaoProjetada} kWh</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lista de Rateios */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Rateios Realizados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getRateiosByGenerator(historyGenerator.id).length === 0 ? (
                          <div className="text-center py-8">
                            <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Nenhum rateio encontrado para esta geradora</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {getRateiosByGenerator(historyGenerator.id).map((rateio) => (
                              <Card 
                                key={rateio.id} 
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => setSelectedRateioHistory(rateio)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="font-medium">
                                        {String(rateio.date.day).padStart(2, '0')}/{String(rateio.date.month).padStart(2, '0')}/{rateio.date.year}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        {rateio.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'} • {rateio.subscribers.length} assinantes
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{rateio.expectedGeneration} kWh</Badge>
                                      <Eye className="w-4 h-4 text-gray-400" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Detalhes do Rateio Selecionado */}
                    {selectedRateioHistory && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Rateio de {String(selectedRateioHistory.date.day).padStart(2, '0')}/{String(selectedRateioHistory.date.month).padStart(2, '0')}/{selectedRateioHistory.date.year}
                            </CardTitle>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Anexar Formulário
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-2">Nome</th>
                                  <th className="text-left py-2">UC</th>
                                  <th className="text-left py-2">Consumo</th>
                                  <th className="text-left py-2">Crédito</th>
                                  <th className="text-left py-2">
                                    {selectedRateioHistory.type === 'percentage' ? 'Percentual' : 'Prioridade'}
                                  </th>
                                  <th className="text-left py-2">Última Fatura</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRateioHistory.subscribers.map((subscriber) => (
                                  <tr key={subscriber.id} className="border-b border-gray-100">
                                    <td className="py-3 font-medium">{subscriber.name}</td>
                                    <td className="py-3">{subscriber.uc}</td>
                                    <td className="py-3">{subscriber.contractedConsumption} kWh</td>
                                    <td className="py-3">{subscriber.accumulatedCredit} kWh</td>
                                    <td className="py-3">
                                      {selectedRateioHistory.type === 'percentage' ? `${subscriber.percentage}%` : subscriber.priority}
                                    </td>
                                    <td className="py-3">{subscriber.lastInvoice || 'N/A'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Rateio;
