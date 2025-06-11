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
  AlertTriangle, Info, PieChart, BarChart3, RefreshCw, Settings, Plus, Calendar,
  ChevronRight, ArrowLeft, ArrowRight, Clock, Target, CheckSquare
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

  // Novo estado para controlar o fluxo de cadastro
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    generatorId: '',
    type: 'percentage' as 'percentage' | 'priority',
    date: {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    expectedGeneration: 0,
    notes: '',
    attachmentUrl: ''
  });

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

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratorSelectStep = (generatorId: string) => {
    const generator = selectGenerator(generatorId);
    if (generator) {
      setFormData(prev => ({
        ...prev,
        generatorId,
        expectedGeneration: generator.generation
      }));
      setEditedSubscribers([]);
      nextStep();
    }
  };

  const handleRateioTypeSelect = (type: 'percentage' | 'priority') => {
    setFormData(prev => ({ ...prev, type }));
    nextStep();
  };

  const addSubscriberToRateio = (subscriberId: string) => {
    const subscriber = selectSubscriber(subscriberId);
    if (subscriber && !editedSubscribers.find(s => s.id === subscriberId)) {
      const newSubscriber = {
        ...subscriber,
        percentage: formData.type === 'percentage' ? 0 : undefined,
        priority: formData.type === 'priority' ? editedSubscribers.length + 1 : undefined,
        allocatedEnergy: 0,
        creditUsed: 0,
        remainingCredit: subscriber.accumulatedCredit
      };
      setEditedSubscribers(prev => [...prev, newSubscriber]);
      toast.success(`${subscriber.name} adicionado ao rateio`);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setFormData({
      generatorId: '',
      type: 'percentage',
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      expectedGeneration: 0,
      notes: '',
      attachmentUrl: ''
    });
    setEditedSubscribers([]);
    resetSelections();
  };

  const saveRateioWizard = async () => {
    if (!selectedGenerator || editedSubscribers.length === 0) {
      toast.error('Complete todos os passos antes de salvar');
      return;
    }

    const validation = validateRateio(editedSubscribers, formData.type);
    if (!validation.isValid) {
      toast.error(validation.errors.join('; '));
      return;
    }

    try {
      const rateioData = {
        generatorId: selectedGenerator.id,
        generator: selectedGenerator,
        type: formData.type,
        date: formData.date,
        expectedGeneration: formData.expectedGeneration,
        subscribers: editedSubscribers,
        attachmentUrl: formData.attachmentUrl,
        notes: formData.notes,
        status: 'completed' as const
      };

      await createRateio(rateioData);
      resetWizard();
      toast.success('Rateio criado com sucesso!');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  // Função para obter assinantes vinculados através de rateios
  const getSubscribersFromRateios = (generatorId: string): RateioSubscriber[] => {
    const generatorRateios = rateios.filter(r => r.generatorId === generatorId);
    const subscribersMap = new Map<string, RateioSubscriber>();
    
    generatorRateios.forEach(rateio => {
      rateio.subscribers.forEach(subscriber => {
        if (!subscribersMap.has(subscriber.id)) {
          subscribersMap.set(subscriber.id, subscriber);
        }
      });
    });
    
    return Array.from(subscribersMap.values());
  };

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

          {/* Aba Consulta Atualizada */}
          <TabsContent value="consulta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assinantes por Geradora
                  {selectedGenerator && (
                    <Badge variant="outline">
                      {getSubscribersFromRateios(selectedGenerator.id).length} assinantes vinculados
                    </Badge>
                  )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGeneratorsConsulta.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma geradora encontrada</p>
                    </div>
                  ) : (
                    filteredGeneratorsConsulta.map((generator) => {
                      const subscribersVinculados = getSubscribersFromRateios(generator.id);
                      const totalRateios = getRateiosByGenerator(generator.id).length;
                      
                      return (
                        <Card
                          key={generator.id}
                          className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                            selectedGenerator?.id === generator.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleGeneratorSelect(generator.id, 'consulta')}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                  <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {generator.plants?.[0]?.apelido || generator.owner?.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {generator.owner?.name}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={generator.status === 'active' ? 'default' : 'secondary'}>
                                {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">UC:</span>
                                <span className="font-mono">{generator.plants?.[0]?.uc}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Geração:</span>
                                <span className="font-semibold">{generator.plants?.[0]?.geracaoProjetada?.toLocaleString()} kWh</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Assinantes:</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  {subscribersVinculados.length} vinculados
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Rateios:</span>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {totalRateios} realizados
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>

                {/* Informações da Geradora Selecionada */}
                {selectedGenerator && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-blue-900 text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {selectedGenerator.nickname}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant="default" className="bg-blue-600">
                          {getSubscribersFromRateios(selectedGenerator.id).length} assinantes vinculados
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => resetSelections()}>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Limpar Seleção
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">UC:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.uc}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Geração:</span>
                        <p className="font-semibold text-lg">{selectedGenerator.generation.toLocaleString()} kWh</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm text-blue-600 font-medium">Rateios:</span>
                        <p className="font-semibold text-lg">{getRateiosByGenerator(selectedGenerator.id).length}</p>
                      </div>
                    </div>

                    {/* Lista de Assinantes Vinculados */}
                    {(() => {
                      const subscribersVinculados = getSubscribersFromRateios(selectedGenerator.id);
                      
                      if (subscribersVinculados.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum assinante vinculado</h4>
                            <p className="text-gray-500">Esta geradora ainda não possui assinantes em rateios.</p>
                          </div>
                        );
                      }

                      return (
                        <div>
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Assinantes Vinculados
                          </h4>
                          
                          <div className="border rounded-lg overflow-hidden bg-white">
                            <Table>
                              <TableHeader className="bg-gray-50">
                                <TableRow>
                                  <TableHead className="font-semibold">Nome</TableHead>
                                  <TableHead className="font-semibold">UC</TableHead>
                                  <TableHead className="font-semibold">Consumo Contratado</TableHead>
                                  <TableHead className="font-semibold">Crédito Acumulado</TableHead>
                                  <TableHead className="font-semibold">Última Participação</TableHead>
                                  <TableHead className="font-semibold">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subscribersVinculados.map((subscriber) => (
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
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Cadastro Completamente Redesenhada */}
          <TabsContent value="cadastro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Novo Rateio - Assistente Guiado
                  </div>
                  {currentStep > 1 && (
                    <Button variant="outline" size="sm" onClick={resetWizard}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Recomeçar
                    </Button>
                  )}
                </CardTitle>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mt-4 px-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-medium ${
                        currentStep >= step 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : currentStep === step 
                            ? 'border-blue-500 text-blue-500 bg-blue-50'
                            : 'border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step ? <CheckSquare className="w-5 h-5" /> : step}
                      </div>
                      {step < 4 && (
                        <div className={`w-16 h-1 mx-2 ${
                          currentStep > step ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mt-2 px-2">
                  <span>Geradora</span>
                  <span>Tipo</span>
                  <span>Assinantes</span>
                  <span>Revisar</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Passo 1: Selecionar Geradora */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <Zap className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold mb-2">Selecione a Geradora</h3>
                      <p className="text-gray-600">Escolha a geradora que será utilizada neste rateio</p>
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium mb-3 block">Buscar Geradora</Label>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Digite o nome ou apelido da geradora..."
                          value={searchGeneratorCadastro}
                          onChange={(e) => setSearchGeneratorCadastro(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {filteredGeneratorsCadastro.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma geradora encontrada</p>
                        </div>
                      ) : (
                        filteredGeneratorsCadastro.map((generator) => (
                          <Card
                            key={generator.id}
                            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                              formData.generatorId === generator.id
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => handleGeneratorSelectStep(generator.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      {generator.plants?.[0]?.apelido || generator.owner?.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {generator.owner?.name}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">UC:</span>
                                  <span className="font-mono">{generator.plants?.[0]?.uc}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Geração:</span>
                                  <span className="font-semibold">{generator.plants?.[0]?.geracaoProjetada?.toLocaleString()} kWh</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Passo 2: Selecionar Tipo de Rateio */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <Settings className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold mb-2">Tipo de Rateio</h3>
                      <p className="text-gray-600">Como deseja distribuir a energia entre os assinantes?</p>
                    </div>

                    {selectedGenerator && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-blue-900 mb-2">Geradora Selecionada:</h4>
                        <p className="text-blue-800">{selectedGenerator.nickname}</p>
                        <p className="text-sm text-blue-600">Geração: {selectedGenerator.generation.toLocaleString()} kWh</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                          formData.type === 'percentage'
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleRateioTypeSelect('percentage')}
                      >
                        <CardContent className="p-6 text-center">
                          <Percent className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold mb-2">Por Porcentagem</h4>
                          <p className="text-gray-600 text-sm mb-4">
                            Distribua a energia usando porcentagens fixas que devem somar 100%
                          </p>
                          <div className="bg-white p-3 rounded border text-xs">
                            <strong>Exemplo:</strong> Assinante A (40%), B (35%), C (25%)
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                          formData.type === 'priority'
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleRateioTypeSelect('priority')}
                      >
                        <CardContent className="p-6 text-center">
                          <ArrowUpDown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold mb-2">Por Prioridade</h4>
                          <p className="text-gray-600 text-sm mb-4">
                            Distribua por ordem de prioridade (1º, 2º, 3º...) baseado no consumo
                          </p>
                          <div className="bg-white p-3 rounded border text-xs">
                            <strong>Exemplo:</strong> 1º Assinante A, 2º Assinante B, 3º Assinante C
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Dia</Label>
                        <Input
                          type="number"
                          value={formData.date.day}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: {...prev.date, day: Number(e.target.value)}
                          }))}
                          min={1}
                          max={31}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Mês</Label>
                        <Input
                          type="number"
                          value={formData.date.month}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: {...prev.date, month: Number(e.target.value)}
                          }))}
                          min={1}
                          max={12}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Ano</Label>
                        <Input
                          type="number"
                          value={formData.date.year}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: {...prev.date, year: Number(e.target.value)}
                          }))}
                          min={2020}
                          max={2030}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Geração Esperada (kWh)</Label>
                      <Input
                        type="number"
                        value={formData.expectedGeneration}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          expectedGeneration: Number(e.target.value)
                        }))}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Passo 3: Adicionar Assinantes */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold mb-2">Adicionar Assinantes</h3>
                      <p className="text-gray-600">Selecione os assinantes que participarão do rateio</p>
                    </div>

                    {/* Resumo dos passos anteriores */}
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Geradora:</span>
                        <p className="font-semibold">{selectedGenerator?.nickname}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Tipo:</span>
                        <p className="font-semibold">
                          {formData.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'}
                        </p>
                      </div>
                    </div>

                    {/* Busca de assinantes */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Buscar Assinantes</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Digite o nome ou UC do assinante..."
                          value={searchSubscriber}
                          onChange={(e) => setSearchSubscriber(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Lista de assinantes para adicionar */}
                    <div>
                      <h4 className="font-medium mb-3">Assinantes Disponíveis</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                        {filteredSubscribers.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Nenhum assinante encontrado</p>
                        ) : (
                          filteredSubscribers.map((subscriber) => {
                            const isAdded = editedSubscribers.some(s => s.id === subscriber.id);
                            return (
                              <div
                                key={subscriber.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                  isAdded 
                                    ? 'bg-green-50 border-green-300' 
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => !isAdded && addSubscriberToRateio(subscriber.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{subscriber.subscriber?.name}</div>
                                    <div className="text-sm text-gray-500">
                                      UC: {subscriber.energyAccount?.originalAccount?.uc} | 
                                      Consumo: {subscriber.planContract?.kwhContratado?.toLocaleString()} kWh/mês
                                    </div>
                                  </div>
                                  {isAdded ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Plus className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Assinantes adicionados */}
                    {editedSubscribers.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Assinantes Adicionados ({editedSubscribers.length})</h4>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const calculated = calculateAutoDistribution(editedSubscribers, formData.type, formData.expectedGeneration);
                              setEditedSubscribers(calculated);
                              toast.success('Distribuição calculada automaticamente');
                            }}
                          >
                            <Calculator className="w-4 h-4 mr-1" />
                            Auto Calcular
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader className="bg-gray-50">
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>UC</TableHead>
                                <TableHead>Consumo</TableHead>
                                <TableHead className="bg-yellow-100">
                                  {formData.type === 'percentage' ? 'Percentual (%)' : 'Prioridade'}
                                </TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {editedSubscribers.map((subscriber, index) => (
                                <TableRow key={subscriber.id}>
                                  <TableCell className="font-medium">{subscriber.name}</TableCell>
                                  <TableCell className="font-mono text-sm">{subscriber.uc}</TableCell>
                                  <TableCell>{subscriber.contractedConsumption.toLocaleString()} kWh</TableCell>
                                  <TableCell className="bg-yellow-50">
                                    <Input
                                      type="number"
                                      value={formData.type === 'percentage' ? subscriber.percentage || 0 : subscriber.priority || 1}
                                      onChange={(e) => updateSubscriberValue(
                                        index, 
                                        formData.type === 'percentage' ? 'percentage' : 'priority', 
                                        Number(e.target.value)
                                      )}
                                      className="w-20"
                                      min={formData.type === 'percentage' ? 0 : 1}
                                      max={formData.type === 'percentage' ? 100 : editedSubscribers.length}
                                      step={formData.type === 'percentage' ? 0.01 : 1}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeSubscriber(index)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                      <Button 
                        onClick={nextStep} 
                        disabled={editedSubscribers.length === 0}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Passo 4: Revisar e Salvar */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <Target className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold mb-2">Revisar Rateio</h3>
                      <p className="text-gray-600">Confira os dados antes de finalizar</p>
                    </div>

                    {/* Resumo completo */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-4">Resumo do Rateio</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-600">Geradora:</span>
                            <p className="font-semibold">{selectedGenerator?.nickname}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">UC:</span>
                            <p className="font-semibold font-mono">{selectedGenerator?.uc}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Tipo de Rateio:</span>
                            <p className="font-semibold">
                              {formData.type === 'percentage' ? 'Por Porcentagem' : 'Por Prioridade'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-600">Data:</span>
                            <p className="font-semibold">
                              {String(formData.date.day).padStart(2, '0')}/
                              {String(formData.date.month).padStart(2, '0')}/
                              {formData.date.year}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Geração Esperada:</span>
                            <p className="font-semibold">{formData.expectedGeneration.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total de Assinantes:</span>
                            <p className="font-semibold">{editedSubscribers.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* Validação */}
                      {(() => {
                        const validation = validateRateio(editedSubscribers, formData.type);
                        return (
                          <div className="mb-6">
                            {validation.isValid ? (
                              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Rateio válido e pronto para ser salvo!</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {validation.errors.map((error, index) => (
                                  <div key={index} className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {validation.warnings.length > 0 && (
                              <div className="mt-2">
                                {validation.warnings.map((warning, index) => (
                                  <div key={index} className="flex items-center gap-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>{warning}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Tabela de assinantes */}
                      <div>
                        <h5 className="font-medium mb-3">Distribuição Final</h5>
                        <div className="border rounded-lg overflow-hidden bg-white">
                          <Table>
                            <TableHeader className="bg-gray-50">
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>UC</TableHead>
                                <TableHead>
                                  {formData.type === 'percentage' ? 'Percentual' : 'Prioridade'}
                                </TableHead>
                                <TableHead>Energia Alocada</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {editedSubscribers.map((subscriber) => (
                                <TableRow key={subscriber.id}>
                                  <TableCell className="font-medium">{subscriber.name}</TableCell>
                                  <TableCell className="font-mono text-sm">{subscriber.uc}</TableCell>
                                  <TableCell>
                                    {formData.type === 'percentage' 
                                      ? `${subscriber.percentage}%` 
                                      : `${subscriber.priority}º`
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {(subscriber.allocatedEnergy || 0).toLocaleString()} kWh
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Observações</Label>
                        <Textarea
                          placeholder="Adicione observações sobre este rateio..."
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-base font-medium">Anexo (URL)</Label>
                        <Input
                          placeholder="URL do documento ou formulário..."
                          value={formData.attachmentUrl}
                          onChange={(e) => setFormData(prev => ({...prev, attachmentUrl: e.target.value}))}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t">
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={resetWizard}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Recomeçar
                        </Button>
                        
                        <Button 
                          onClick={saveRateioWizard} 
                          disabled={!validateRateio(editedSubscribers, formData.type).isValid || loading}
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
                              Finalizar Rateio
                            </>
                          )}
                        </Button>
                      </div>
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
