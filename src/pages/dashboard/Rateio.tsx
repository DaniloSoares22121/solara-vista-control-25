
import { useState } from 'react';
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
import { useRateio } from '@/hooks/useRateio';
import { RateioSubscriber } from '@/types/rateio';
import { Search, Users, Calculator, History, Upload, FileText, CheckCircle, AlertCircle, Percent, ArrowUpDown } from 'lucide-react';
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
      setEditedSubscribers(currentSubscribers);
      setShowTypeDialog(false);
    }
  };

  const updateSubscriberValue = (index: number, field: 'percentage' | 'priority', value: number) => {
    const updated = [...editedSubscribers];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSubscribers(updated);
  };

  const saveRateio = async () => {
    if (!selectedGenerator || editedSubscribers.length === 0) {
      toast.error('Selecione uma geradora e adicione assinantes');
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
        attachmentUrl
      };

      await createRateio(rateioData);
      resetSelections();
      setEditedSubscribers([]);
      setAttachmentUrl('');
      toast.success('Rateio salvo com sucesso!');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const validatePercentages = () => {
    const total = editedSubscribers.reduce((sum, sub) => sum + (sub.percentage || 0), 0);
    return Math.abs(total - 100) < 0.01;
  };

  const validatePriorities = () => {
    const priorities = editedSubscribers.map(sub => sub.priority).filter(p => p !== undefined);
    const uniquePriorities = new Set(priorities);
    if (priorities.length !== uniquePriorities.size) return false;
    
    const sortedPriorities = [...priorities].sort((a, b) => a! - b!);
    for (let i = 0; i < sortedPriorities.length; i++) {
      if (sortedPriorities[i] !== i + 1) return false;
    }
    return true;
  };

  const isValidRateio = rateioType === 'percentage' ? validatePercentages() : validatePriorities();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rateio de Energia</h1>
            <p className="text-gray-600">Gerencie a distribuição de energia entre assinantes</p>
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

          {/* Aba Consulta */}
          <TabsContent value="consulta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Consultar Assinantes por Geradora
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
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filteredGeneratorsConsulta.map((generator) => (
                    <div
                      key={generator.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleGeneratorSelect(generator.id, 'consulta')}
                    >
                      <div className="font-medium">
                        {generator.plants?.[0]?.apelido || generator.owner?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        UC: {generator.plants?.[0]?.uc} | Geração: {generator.plants?.[0]?.geracaoProjetada} kWh
                      </div>
                    </div>
                  ))}
                </div>

                {/* Informações da Geradora Selecionada */}
                {selectedGenerator && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Geradora Selecionada</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <span className="text-sm text-blue-600">Apelido:</span>
                        <p className="font-medium">{selectedGenerator.nickname}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">UC:</span>
                        <p className="font-medium">{selectedGenerator.uc}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Geração:</span>
                        <p className="font-medium">{selectedGenerator.generation} kWh</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de Assinantes */}
                {subscribersByGenerator.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Assinantes Cadastrados</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>UC</TableHead>
                          <TableHead>Consumo Contratado</TableHead>
                          <TableHead>Crédito Acumulado</TableHead>
                          <TableHead>Percentual/Prioridade</TableHead>
                          <TableHead>Última Fatura</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribersByGenerator.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.name}</TableCell>
                            <TableCell>{subscriber.uc}</TableCell>
                            <TableCell>{subscriber.contractedConsumption.toLocaleString()} kWh/mês</TableCell>
                            <TableCell>{subscriber.accumulatedCredit} kWh</TableCell>
                            <TableCell>
                              {subscriber.percentage ? `${subscriber.percentage}%` : `Prioridade ${subscriber.priority}`}
                            </TableCell>
                            <TableCell>{subscriber.lastInvoice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Cadastro */}
          <TabsContent value="cadastro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Cadastrar Novo Rateio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seleção da Geradora */}
                <div>
                  <Label>Selecionar Geradora</Label>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Digite o nome ou apelido da geradora..."
                      value={searchGeneratorCadastro}
                      onChange={(e) => setSearchGeneratorCadastro(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Lista de Geradoras - SEMPRE VISÍVEL */}
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {filteredGeneratorsCadastro.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhuma geradora encontrada</p>
                    ) : (
                      filteredGeneratorsCadastro.map((generator) => (
                        <div
                          key={generator.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedGenerator?.id === generator.id 
                              ? 'bg-blue-100 border-blue-300' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleGeneratorSelect(generator.id, 'cadastro')}
                        >
                          <div className="font-medium">
                            {generator.plants?.[0]?.apelido || generator.owner?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            UC: {generator.plants?.[0]?.uc} | Geração: {generator.plants?.[0]?.geracaoProjetada} kWh
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Informações da Geradora Selecionada */}
                {selectedGenerator && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Geradora Selecionada</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <span className="text-sm text-blue-600">Apelido:</span>
                        <p className="font-medium">{selectedGenerator.nickname}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">UC:</span>
                        <p className="font-medium">{selectedGenerator.uc}</p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600">Geração:</span>
                        <p className="font-medium">{selectedGenerator.generation} kWh</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seleção do Assinante */}
                {selectedGenerator && (
                  <div>
                    <Label>Selecionar Assinante</Label>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Digite o nome ou UC do assinante..."
                        value={searchSubscriber}
                        onChange={(e) => setSearchSubscriber(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filteredSubscribers.map((subscriber) => (
                        <div
                          key={subscriber.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSubscriberSelect(subscriber.id)}
                        >
                          <div className="font-medium">{subscriber.subscriber?.name}</div>
                          <div className="text-sm text-gray-500">
                            UC: {subscriber.energyAccount?.originalAccount?.uc} | 
                            Consumo: {subscriber.planContract?.kwhContratado} kWh/mês
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lista de Edição dos Assinantes */}
                {editedSubscribers.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Configurar Rateio</h3>
                      <div className="flex items-center gap-2">
                        {rateioType === 'percentage' ? (
                          <Badge variant={isValidRateio ? "default" : "destructive"}>
                            <Percent className="w-3 h-3 mr-1" />
                            {isValidRateio ? "100%" : "Ajustar %"}
                          </Badge>
                        ) : (
                          <Badge variant={isValidRateio ? "default" : "destructive"}>
                            <ArrowUpDown className="w-3 h-3 mr-1" />
                            {isValidRateio ? "Sequencial" : "Ajustar prioridades"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>UC</TableHead>
                          <TableHead>Consumo</TableHead>
                          <TableHead>Crédito</TableHead>
                          <TableHead className="bg-yellow-100">
                            {rateioType === 'percentage' ? 'Percentual' : 'Prioridade'}
                          </TableHead>
                          <TableHead>Última Fatura</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editedSubscribers.map((subscriber, index) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.name}</TableCell>
                            <TableCell>{subscriber.uc}</TableCell>
                            <TableCell>{subscriber.contractedConsumption.toLocaleString()} kWh</TableCell>
                            <TableCell>{subscriber.accumulatedCredit} kWh</TableCell>
                            <TableCell className="bg-yellow-50">
                              <Input
                                type="number"
                                value={rateioType === 'percentage' ? subscriber.percentage || 0 : subscriber.priority || 1}
                                onChange={(e) => updateSubscriberValue(
                                  index, 
                                  rateioType === 'percentage' ? 'percentage' : 'priority', 
                                  Number(e.target.value)
                                )}
                                className="w-20"
                                min={rateioType === 'percentage' ? 0 : 1}
                                max={rateioType === 'percentage' ? 100 : editedSubscribers.length}
                                step={rateioType === 'percentage' ? 0.01 : 1}
                              />
                            </TableCell>
                            <TableCell>{subscriber.lastInvoice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-end gap-4 mt-6">
                      <Button 
                        onClick={saveRateio} 
                        disabled={!isValidRateio || loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          "Salvando..."
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
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

          {/* Aba Histórico */}
          <TabsContent value="historico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico de Rateios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de Confirmação do Assinante */}
        <Dialog open={showSubscriberConfirm} onOpenChange={setShowSubscriberConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Assinante</DialogTitle>
            </DialogHeader>
            {selectedSubscriber && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Dados do Assinante:</h3>
                  <div className="space-y-1">
                    <p><strong>Nome:</strong> {selectedSubscriber.name}</p>
                    <p><strong>UC:</strong> {selectedSubscriber.uc}</p>
                    <p><strong>Consumo Contratado:</strong> {selectedSubscriber.contractedConsumption} kWh/mês</p>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setShowSubscriberConfirm(false)}>
                    Não
                  </Button>
                  <Button onClick={confirmSubscriber}>
                    Sim, Confirmar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Tipo de Rateio */}
        <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configurar Novo Rateio</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Tipo de Rateio</Label>
                <Select value={rateioType} onValueChange={(value: 'percentage' | 'priority') => setRateioType(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Por Porcentagem</SelectItem>
                    <SelectItem value="priority">Por Prioridade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Data do Rateio</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
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
                <Label className="text-base font-medium">Geração Esperada (kWh)</Label>
                <Input
                  type="number"
                  value={expectedGeneration}
                  onChange={(e) => setExpectedGeneration(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowTypeDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={startRateio}>
                  Iniciar Rateio
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Rateio;
