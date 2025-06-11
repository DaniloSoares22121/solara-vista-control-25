
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRateio } from '@/hooks/useRateio';
import { RateioSubscriber } from '@/types/rateio';
import { 
  Search, Users, Calculator, History, Upload, FileText, CheckCircle, AlertCircle, 
  Percent, ArrowUpDown, TrendingUp, Zap, Download, Eye, Edit, Trash2, Save,
  AlertTriangle, Info, PieChart, BarChart3, RefreshCw, Settings, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const Rateio = () => {
  const {
    selectedGenerator,
    selectedSubscriber,
    subscribersByGenerator,
    generators,
    subscribers,
    rateios,
    selectGenerator,
    selectSubscriber,
    createRateio,
    getRateiosByGenerator,
    resetSelections,
    validateRateio,
    calculateAutoDistribution,
    loading
  } = useRateio();

  const [searchGeneratorConsulta, setSearchGeneratorConsulta] = useState('');
  const [searchGeneratorCadastro, setSearchGeneratorCadastro] = useState('');
  const [searchGeneratorHistorico, setSearchGeneratorHistorico] = useState('');
  const [searchSubscriber, setSearchSubscriber] = useState('');
  const [rateioType, setRateioType] = useState<'percentage' | 'priority'>('percentage');
  const [rateioDate, setRateioDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [expectedGeneration, setExpectedGeneration] = useState(0);
  const [editedSubscribers, setEditedSubscribers] = useState<RateioSubscriber[]>([]);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [showSubscriberConfirm, setShowSubscriberConfirm] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [selectedHistoryRateio, setSelectedHistoryRateio] = useState<string | null>(null);
  const [autoCalculateMode, setAutoCalculateMode] = useState(false);

  // Filtrar geradoras
  const filteredGeneratorsConsulta = generators.filter(g => 
    g.owner?.name?.toLowerCase().includes(searchGeneratorConsulta.toLowerCase()) ||
    g.plants?.[0]?.apelido?.toLowerCase().includes(searchGeneratorConsulta.toLowerCase())
  );

  const filteredGeneratorsCadastro = generators.filter(g => 
    g.owner?.name?.toLowerCase().includes(searchGeneratorCadastro.toLowerCase()) ||
    g.plants?.[0]?.apelido?.toLowerCase().includes(searchGeneratorCadastro.toLowerCase())
  );

  const filteredGeneratorsHistorico = generators.filter(g => 
    g.owner?.name?.toLowerCase().includes(searchGeneratorHistorico.toLowerCase()) ||
    g.plants?.[0]?.apelido?.toLowerCase().includes(searchGeneratorHistorico.toLowerCase())
  );

  // Filtrar assinantes
  const filteredSubscribers = subscribers.filter(s =>
    s.subscriber?.name?.toLowerCase().includes(searchSubscriber.toLowerCase()) ||
    s.energyAccount?.originalAccount?.uc?.includes(searchSubscriber)
  );

  const handleGeneratorSelect = (generatorId: string, tab: string) => {
    const generator = selectGenerator(generatorId);
    if (generator && tab === 'cadastro') {
      setExpectedGeneration(generator.generation);
      setEditedSubscribers([]);
    }
  };

  const handleSubscriberSelect = (subscriberId: string) => {
    selectSubscriber(subscriberId);
    setShowSubscriberConfirm(true);
  };

  const confirmSubscriber = () => {
    if (selectedSubscriber && selectedGenerator) {
      setShowSubscriberConfirm(false);
      setShowTypeDialog(true);
    }
  };

  const startRateio = () => {
    if (selectedGenerator) {
      const currentSubscribers = [...subscribersByGenerator];
      if (selectedSubscriber) {
        const newSubscriber = {
          ...selectedSubscriber,
          percentage: rateioType === 'percentage' ? 0 : undefined,
          priority: rateioType === 'priority' ? currentSubscribers.length + 1 : undefined
        };
        currentSubscribers.push(newSubscriber);
      }
      
      if (autoCalculateMode) {
        const calculated = calculateAutoDistribution(currentSubscribers, rateioType, expectedGeneration);
        setEditedSubscribers(calculated);
      } else {
        setEditedSubscribers(currentSubscribers);
      }
      setShowTypeDialog(false);
    }
  };

  const updateSubscriberValue = (index: number, field: 'percentage' | 'priority', value: number) => {
    const updated = [...editedSubscribers];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalcular energia alocada se for porcentagem
    if (field === 'percentage' && rateioType === 'percentage') {
      const allocatedEnergy = Math.round((value / 100) * expectedGeneration);
      const creditUsed = Math.min(updated[index].accumulatedCredit, allocatedEnergy);
      updated[index] = {
        ...updated[index],
        allocatedEnergy,
        creditUsed,
        remainingCredit: updated[index].accumulatedCredit - creditUsed
      };
    }
    
    setEditedSubscribers(updated);
  };

  const removeSubscriber = (index: number) => {
    const updated = editedSubscribers.filter((_, i) => i !== index);
    setEditedSubscribers(updated);
    toast.success('Assinante removido do rateio');
  };

  const handleAutoCalculate = () => {
    if (editedSubscribers.length > 0) {
      const calculated = calculateAutoDistribution(editedSubscribers, rateioType, expectedGeneration);
      setEditedSubscribers(calculated);
      toast.success('Distribuição calculada automaticamente');
    }
  };

  const saveRateio = async () => {
    if (!selectedGenerator || editedSubscribers.length === 0) {
      toast.error('Selecione uma geradora e adicione assinantes');
      return;
    }

    const validation = validateRateio(editedSubscribers, rateioType);
    if (!validation.isValid) {
      toast.error(validation.errors.join('; '));
      return;
    }

    try {
      const rateioData = {
        generatorId: selectedGenerator.id,
        generator: selectedGenerator,
        type: rateioType,
        date: rateioDate,
        expectedGeneration,
        subscribers: editedSubscribers,
        attachmentUrl,
        notes,
        status: 'completed' as const
      };

      await createRateio(rateioData);
      resetForm();
      toast.success('Rateio salvo com sucesso!');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const resetForm = () => {
    resetSelections();
    setEditedSubscribers([]);
    setAttachmentUrl('');
    setNotes('');
    setExpectedGeneration(0);
  };

  const validation = editedSubscribers.length > 0 ? validateRateio(editedSubscribers, rateioType) : { isValid: false, errors: [], warnings: [] };

  const totalGeneration = editedSubscribers.reduce((sum, sub) => sum + (sub.allocatedEnergy || 0), 0);
  const totalPercentage = editedSubscribers.reduce((sum, sub) => sum + (sub.percentage || 0), 0);

  const generatorRateios = selectedGenerator ? getRateiosByGenerator(selectedGenerator.id) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header Melhorado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rateio de Energia</h1>
              <p className="text-gray-600">Sistema completo de distribuição de energia entre assinantes</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Geradoras Ativas</p>
                  <p className="text-xl font-bold">{generators.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Assinantes</p>
                  <p className="text-xl font-bold">{subscribers.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Rateios Criados</p>
                  <p className="text-xl font-bold">{rateios.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="consulta" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consulta" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assinantes por Geradora
            </TabsTrigger>
            <TabsTrigger value="cadastro" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Cadastrar Rateio
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico de Rateios
            </TabsTrigger>
          </TabsList>

          {/* Aba Consulta Melhorada */}
          <TabsContent value="consulta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Consultar Assinantes por Geradora
                  <Badge variant="outline">{subscribersByGenerator.length} assinantes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Buscar Geradora</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Digite o nome ou apelido da geradora..."
                        value={searchGeneratorConsulta}
                        onChange={(e) => setSearchGeneratorConsulta(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de Geradoras para Consulta */}
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                  {filteredGeneratorsConsulta.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma geradora encontrada</p>
                  ) : (
                    filteredGeneratorsConsulta.map((generator) => (
                      <div
                        key={generator.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedGenerator?.id === generator.id 
                            ? 'bg-blue-50 border-blue-300 shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleGeneratorSelect(generator.id, 'consulta')}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-lg">
                              {generator.plants?.[0]?.apelido || generator.owner?.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              UC: {generator.plants?.[0]?.uc} | Geração: {generator.plants?.[0]?.geracaoProjetada?.toLocaleString()} kWh
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Proprietário: {generator.owner?.name}
                            </div>
                          </div>
                          <Badge variant={generator.status === 'active' ? 'default' : 'secondary'}>
                            {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Informações da Geradora Selecionada Melhoradas */}
                {selectedGenerator && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-blue-900 text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Geradora Selecionada
                      </h3>
                      <Badge variant="default" className="bg-blue-600">
                        {subscribersByGenerator.length} assinantes vinculados
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Apelido:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.nickname}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">UC:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.uc}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Geração:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.generation.toLocaleString()} kWh</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de Assinantes Melhorada */}
                {subscribersByGenerator.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Assinantes Cadastrados
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Exportar
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Relatório
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold">Nome</TableHead>
                            <TableHead className="font-semibold">UC</TableHead>
                            <TableHead className="font-semibold">Consumo Contratado</TableHead>
                            <TableHead className="font-semibold">Crédito Acumulado</TableHead>
                            <TableHead className="font-semibold">Participação</TableHead>
                            <TableHead className="font-semibold">Última Fatura</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribersByGenerator.map((subscriber) => (
                            <TableRow key={subscriber.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{subscriber.name}</TableCell>
                              <TableCell className="font-mono text-sm">{subscriber.uc}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  {subscriber.contractedConsumption.toLocaleString()} kWh/mês
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={subscriber.accumulatedCredit > 0 ? "default" : "secondary"}>
                                  {subscriber.accumulatedCredit.toLocaleString()} kWh
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {subscriber.percentage ? (
                                    <>
                                      <Percent className="w-3 h-3 text-blue-500" />
                                      {subscriber.percentage}%
                                    </>
                                  ) : (
                                    <>
                                      <ArrowUpDown className="w-3 h-3 text-purple-500" />
                                      Prioridade {subscriber.priority}
                                    </>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{subscriber.lastInvoice}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Ativo
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Cadastro Completamente Melhorada */}
          <TabsContent value="cadastro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Cadastrar Novo Rateio
                  {editedSubscribers.length > 0 && (
                    <Badge variant="outline">{editedSubscribers.length} assinantes</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seleção da Geradora Melhorada */}
                <div>
                  <Label className="text-base font-medium">Selecionar Geradora</Label>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Digite o nome ou apelido da geradora..."
                      value={searchGeneratorCadastro}
                      onChange={(e) => setSearchGeneratorCadastro(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                    {filteredGeneratorsCadastro.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Nenhuma geradora encontrada</p>
                    ) : (
                      filteredGeneratorsCadastro.map((generator) => (
                        <div
                          key={generator.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedGenerator?.id === generator.id 
                              ? 'bg-blue-50 border-blue-300 shadow-md' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleGeneratorSelect(generator.id, 'cadastro')}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-lg">
                                {generator.plants?.[0]?.apelido || generator.owner?.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                UC: {generator.plants?.[0]?.uc} | Geração: {generator.plants?.[0]?.geracaoProjetada?.toLocaleString()} kWh
                              </div>
                            </div>
                            <Badge variant={generator.status === 'active' ? 'default' : 'secondary'}>
                              {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Informações da Geradora Selecionada */}
                {selectedGenerator && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-blue-900 text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Geradora Selecionada
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => resetSelections()}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Trocar
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Apelido:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.nickname}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">UC:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.uc}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Geração:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.generation.toLocaleString()} kWh</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seleção do Assinante */}
                {selectedGenerator && (
                  <div>
                    <Label className="text-base font-medium">Adicionar Assinante</Label>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Digite o nome ou UC do assinante..."
                        value={searchSubscriber}
                        onChange={(e) => setSearchSubscriber(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                      {filteredSubscribers.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Nenhum assinante encontrado</p>
                      ) : (
                        filteredSubscribers.map((subscriber) => (
                          <div
                            key={subscriber.id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleSubscriberSelect(subscriber.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{subscriber.subscriber?.name}</div>
                                <div className="text-sm text-gray-500">
                                  UC: {subscriber.energyAccount?.originalAccount?.uc} | 
                                  Consumo: {subscriber.planContract?.kwhContratado?.toLocaleString()} kWh/mês
                                </div>
                              </div>
                              <Plus className="w-5 h-5 text-green-500" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Lista de Edição dos Assinantes Completamente Melhorada */}
                {editedSubscribers.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Configurar Rateio
                      </h3>
                      
                      <div className="flex items-center gap-4">
                        {/* Informações de Validação */}
                        <div className="flex items-center gap-2">
                          {rateioType === 'percentage' ? (
                            <Badge variant={validation.isValid ? "default" : "destructive"} className="flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              {validation.isValid ? `${totalPercentage.toFixed(1)}%` : "Ajustar %"}
                            </Badge>
                          ) : (
                            <Badge variant={validation.isValid ? "default" : "destructive"} className="flex items-center gap-1">
                              <ArrowUpDown className="w-3 h-3" />
                              {validation.isValid ? "Sequencial" : "Ajustar prioridades"}
                            </Badge>
                          )}
                          
                          {validation.warnings.length > 0 && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {validation.warnings.length} avisos
                            </Badge>
                          )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleAutoCalculate}>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Auto Calcular
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowValidationDetails(true)}
                            className={validation.warnings.length > 0 ? "border-yellow-500 text-yellow-600" : ""}
                          >
                            <Info className="w-4 h-4 mr-1" />
                            Validações
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Resumo do Rateio */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-600">Assinantes</p>
                            <p className="text-xl font-bold">{editedSubscribers.length}</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-sm text-gray-600">Geração Esperada</p>
                            <p className="text-xl font-bold">{expectedGeneration.toLocaleString()}</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-600">Total Alocado</p>
                            <p className="text-xl font-bold">{totalGeneration.toLocaleString()}</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Percent className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-600">Eficiência</p>
                            <p className="text-xl font-bold">
                              {expectedGeneration > 0 ? ((totalGeneration / expectedGeneration) * 100).toFixed(1) : 0}%
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Tabela de Edição Melhorada */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold">Nome</TableHead>
                            <TableHead className="font-semibold">UC</TableHead>
                            <TableHead className="font-semibold">Consumo</TableHead>
                            <TableHead className="font-semibold">Crédito</TableHead>
                            <TableHead className="bg-yellow-100 font-semibold">
                              {rateioType === 'percentage' ? 'Percentual (%)' : 'Prioridade'}
                            </TableHead>
                            <TableHead className="font-semibold">Energia Alocada</TableHead>
                            <TableHead className="font-semibold">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {editedSubscribers.map((subscriber, index) => (
                            <TableRow key={subscriber.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{subscriber.name}</TableCell>
                              <TableCell className="font-mono text-sm">{subscriber.uc}</TableCell>
                              <TableCell>{subscriber.contractedConsumption.toLocaleString()} kWh</TableCell>
                              <TableCell>
                                <Badge variant={subscriber.accumulatedCredit > 0 ? "default" : "secondary"}>
                                  {subscriber.accumulatedCredit.toLocaleString()} kWh
                                </Badge>
                              </TableCell>
                              <TableCell className="bg-yellow-50">
                                <Input
                                  type="number"
                                  value={rateioType === 'percentage' ? subscriber.percentage || 0 : subscriber.priority || 1}
                                  onChange={(e) => updateSubscriberValue(
                                    index, 
                                    rateioType === 'percentage' ? 'percentage' : 'priority', 
                                    Number(e.target.value)
                                  )}
                                  className="w-24"
                                  min={rateioType === 'percentage' ? 0 : 1}
                                  max={rateioType === 'percentage' ? 100 : editedSubscribers.length}
                                  step={rateioType === 'percentage' ? 0.01 : 1}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {(subscriber.allocatedEnergy || 0).toLocaleString()} kWh
                                  </div>
                                  {subscriber.creditUsed > 0 && (
                                    <div className="text-gray-500">
                                      Crédito: {subscriber.creditUsed.toLocaleString()} kWh
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSubscriber(index)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Observações e Anexos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Observações</Label>
                        <Textarea
                          placeholder="Adicione observações sobre este rateio..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-base font-medium">Anexo (URL)</Label>
                        <Input
                          placeholder="URL do documento ou formulário..."
                          value={attachmentUrl}
                          onChange={(e) => setAttachmentUrl(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Botões de Ação Finais */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                      <Button variant="outline" onClick={resetForm}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Limpar Tudo
                      </Button>
                      
                      <Button 
                        onClick={saveRateio} 
                        disabled={!validation.isValid || loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Rateio
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Histórico Melhorada */}
          <TabsContent value="historico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico de Rateios
                  <Badge variant="outline">{rateios.length} rateios</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seleção da Geradora para Histórico */}
                <div>
                  <Label className="text-base font-medium">Selecionar Geradora</Label>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Digite o nome ou apelido da geradora..."
                      value={searchGeneratorHistorico}
                      onChange={(e) => setSearchGeneratorHistorico(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                    {filteredGeneratorsHistorico.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhuma geradora encontrada</p>
                    ) : (
                      filteredGeneratorsHistorico.map((generator) => (
                        <div
                          key={generator.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedGenerator?.id === generator.id 
                              ? 'bg-blue-100 border-blue-300' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleGeneratorSelect(generator.id, 'historico')}
                        >
                          <div className="font-medium">
                            {generator.plants?.[0]?.apelido || generator.owner?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            UC: {generator.plants?.[0]?.uc} | 
                            {getRateiosByGenerator(generator.id).length} rateios
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Informações da Geradora Selecionada */}
                {selectedGenerator && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 text-lg flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5" />
                      Geradora Selecionada
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Apelido:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.nickname}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">UC:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.uc}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Total Rateios:</span>
                        <p className="font-semibold text-lg">{generatorRateios.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de Rateios */}
                {generatorRateios.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Rateios Realizados
                    </h3>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold">Data</TableHead>
                            <TableHead className="font-semibold">Tipo</TableHead>
                            <TableHead className="font-semibold">Assinantes</TableHead>
                            <TableHead className="font-semibold">Geração Esperada</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generatorRateios.map((rateio) => (
                            <TableRow key={rateio.id} className="hover:bg-gray-50">
                              <TableCell>
                                {String(rateio.date.day).padStart(2, '0')}/
                                {String(rateio.date.month).padStart(2, '0')}/
                                {rateio.date.year}
                              </TableCell>
                              <TableCell>
                                <Badge variant={rateio.type === 'percentage' ? 'default' : 'secondary'}>
                                  {rateio.type === 'percentage' ? 'Porcentagem' : 'Prioridade'}
                                </Badge>
                              </TableCell>
                              <TableCell>{rateio.subscribers.length} assinantes</TableCell>
                              <TableCell>{rateio.expectedGeneration.toLocaleString()} kWh</TableCell>
                              <TableCell>
                                <Badge variant={
                                  rateio.status === 'completed' ? 'default' :
                                  rateio.status === 'pending' ? 'outline' : 'secondary'
                                }>
                                  {rateio.status === 'completed' ? 'Concluído' :
                                   rateio.status === 'pending' ? 'Pendente' : 'Rascunho'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedHistoryRateio(rateio.id!)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {rateio.attachmentUrl && (
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : selectedGenerator ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum rateio encontrado</h3>
                    <p className="text-gray-500">Esta geradora ainda não possui rateios cadastrados.</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma geradora</h3>
                    <p className="text-gray-500">Escolha uma geradora para visualizar o histórico de rateios.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de Confirmação do Assinante */}
        <Dialog open={showSubscriberConfirm} onOpenChange={setShowSubscriberConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Confirmar Assinante
              </DialogTitle>
            </DialogHeader>
            {selectedSubscriber && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Dados do Assinante
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Nome:</span>
                      <p className="font-medium">{selectedSubscriber.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">UC:</span>
                      <p className="font-medium font-mono">{selectedSubscriber.uc}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Consumo Contratado:</span>
                      <p className="font-medium">{selectedSubscriber.contractedConsumption.toLocaleString()} kWh/mês</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Crédito Acumulado:</span>
                      <p className="font-medium">{selectedSubscriber.accumulatedCredit.toLocaleString()} kWh</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setShowSubscriberConfirm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={confirmSubscriber} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Tipo de Rateio Melhorado */}
        <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Configurar Novo Rateio
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4" />
                  Tipo de Rateio
                </Label>
                <Select value={rateioType} onValueChange={(value: 'percentage' | 'priority') => setRateioType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        Por Porcentagem
                      </div>
                    </SelectItem>
                    <SelectItem value="priority">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4" />
                        Por Prioridade
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  {rateioType === 'percentage' 
                    ? 'Distribuição baseada em porcentagens fixas (deve somar 100%)'
                    : 'Distribuição baseada em ordem de prioridade (1, 2, 3...)'
                  }
                </p>
              </div>

              <div>
                <Label className="text-base font-medium flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  Data do Rateio
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm">Dia</Label>
                    <Input
                      type="number"
                      value={rateioDate.day}
                      onChange={(e) => setRateioDate(prev => ({...prev, day: Number(e.target.value)}))}
                      min={1}
                      max={31}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Mês</Label>
                    <Input
                      type="number"
                      value={rateioDate.month}
                      onChange={(e) => setRateioDate(prev => ({...prev, month: Number(e.target.value)}))}
                      min={1}
                      max={12}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Ano</Label>
                    <Input
                      type="number"
                      value={rateioDate.year}
                      onChange={(e) => setRateioDate(prev => ({...prev, year: Number(e.target.value)}))}
                      min={2020}
                      max={2030}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" />
                  Geração Esperada (kWh)
                </Label>
                <Input
                  type="number"
                  value={expectedGeneration}
                  onChange={(e) => setExpectedGeneration(Number(e.target.value))}
                  min={0}
                  step={1}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Valor padrão baseado na capacidade da geradora
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="autoCalculate"
                  checked={autoCalculateMode}
                  onChange={(e) => setAutoCalculateMode(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="autoCalculate" className="text-sm">
                  Calcular distribuição automaticamente baseada no consumo contratado
                </Label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowTypeDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={startRateio} className="bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Iniciar Rateio
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de Validações */}
        <Dialog open={showValidationDetails} onOpenChange={setShowValidationDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                Validações do Rateio
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {validation.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Erros ({validation.errors.length})
                  </h4>
                  <ul className="space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Avisos ({validation.warnings.length})
                  </h4>
                  <ul className="space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.isValid && validation.warnings.length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Rateio válido!</p>
                  <p className="text-sm text-gray-600">Todas as validações passaram com sucesso.</p>
                </div>
              )}

              <Button onClick={() => setShowValidationDetails(false)} className="w-full">
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Rateio;
