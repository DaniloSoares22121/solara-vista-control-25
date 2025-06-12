
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaskedInput } from '@/components/ui/masked-input';
import { FileText, Search, Download, Zap, Clock, Check, Timer, Users, Edit, User, Building2, Calendar, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSubscribers } from '@/hooks/useSubscribers';

interface FaturaResponse {
  fatura_url: string;
  message: string;
  pdf_path: string;
}

const FaturaUnica = () => {
  const { subscribers, isLoading: isLoadingSubscribers } = useSubscribers();
  
  // Estado para controlar o modo de entrada
  const [entryMode, setEntryMode] = useState<'select' | 'manual'>('select');
  
  // Estados para seleção de assinante
  const [selectedSubscriberId, setSelectedSubscriberId] = useState('');
  
  // Estados para modo manual
  const [manualData, setManualData] = useState({
    uc: '',
    documento: '',
    dataNascimento: '',
    tipo: 'fisica' as 'fisica' | 'juridica'
  });

  // Estados para consulta de fatura
  const [isConsultingFatura, setIsConsultingFatura] = useState(false);
  const [consultaProgress, setConsultaProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [faturaResult, setFaturaResult] = useState<FaturaResponse | null>(null);

  // Preencher dados quando selecionar assinante
  useEffect(() => {
    if (selectedSubscriberId && entryMode === 'select') {
      const subscriber = subscribers.find(s => s.id === selectedSubscriberId);
      if (subscriber) {
        const energyAccount = subscriber.energy_account as any;
        const subscriberData = subscriber.subscriber as any;
        
        console.log('Dados do assinante:', subscriberData);
        console.log('Conta de energia:', energyAccount);
        
        // Determinar tipo baseado nos dados disponíveis
        const isPessoaFisica = subscriberData?.cpf ? true : false;
        const documento = subscriberData?.cpf || subscriberData?.cnpj || '';
        
        // Para pessoa física, pegar data de nascimento
        let dataNascimento = '';
        if (isPessoaFisica && subscriberData?.birthDate) {
          // Se a data vem no formato DD/MM/YYYY, manter assim
          // Se vem no formato YYYY-MM-DD, converter
          const birthDate = subscriberData.birthDate;
          if (birthDate.includes('-')) {
            const [year, month, day] = birthDate.split('-');
            dataNascimento = `${day}/${month}/${year}`;
          } else {
            dataNascimento = birthDate;
          }
        }
        
        setManualData({
          uc: energyAccount?.uc || '',
          documento: documento,
          dataNascimento: dataNascimento,
          tipo: isPessoaFisica ? 'fisica' : 'juridica'
        });
      }
    }
  }, [selectedSubscriberId, subscribers, entryMode]);

  const consultarFatura = async (dados: {
    uc: string;
    documento: string;
    dataNascimento?: string;
    tipo: 'fisica' | 'juridica';
  }) => {
    setIsConsultingFatura(true);
    setConsultaProgress(0);
    setTimeRemaining(60);
    setFaturaResult(null);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setConsultaProgress(prev => {
          const next = prev + 1.67;
          return next >= 100 ? 100 : next;
        });
      }, 1000);

      const timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Preparar dados para API
      const apiData: any = {
        uc: dados.uc,
        documento: dados.documento
      };

      if (dados.tipo === 'fisica' && dados.dataNascimento) {
        apiData.data_nascimento = dados.dataNascimento;
      }

      console.log('Consultando fatura com dados:', apiData);

      // Chamar a edge function do Supabase
      const { data: result, error } = await supabase.functions.invoke('baixar-fatura', {
        body: apiData
      });

      if (error) {
        console.error('Erro na edge function:', error);
        throw new Error(error.message || 'Erro ao consultar fatura');
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setFaturaResult(result);
      toast.success('Fatura consultada com sucesso!');

      clearInterval(progressInterval);
      clearInterval(timerInterval);
    } catch (error: any) {
      console.error('Erro ao consultar fatura:', error);
      toast.error(error.message || 'Erro ao consultar fatura');
    } finally {
      setIsConsultingFatura(false);
      setConsultaProgress(100);
      setTimeRemaining(0);
    }
  };

  const handleConsultar = () => {
    if (!manualData.uc || !manualData.documento) {
      toast.error('Preencha UC e documento');
      return;
    }

    if (manualData.tipo === 'fisica' && !manualData.dataNascimento) {
      toast.error('Data de nascimento é obrigatória para pessoa física');
      return;
    }

    consultarFatura(manualData);
  };

  const resetForm = () => {
    setSelectedSubscriberId('');
    setManualData({
      uc: '',
      documento: '',
      dataNascimento: '',
      tipo: 'fisica'
    });
    setFaturaResult(null);
    setConsultaProgress(0);
    setTimeRemaining(0);
    setEntryMode('select');
  };

  const getSelectedSubscriberName = () => {
    if (!selectedSubscriberId) return '';
    const subscriber = subscribers.find(s => s.id === selectedSubscriberId);
    if (!subscriber) return '';
    const subscriberData = subscriber.subscriber as any;
    
    // Verificar diferentes campos possíveis para o nome
    const name = subscriberData?.fullName || 
                 subscriberData?.nome || 
                 subscriberData?.companyName || 
                 subscriberData?.razaoSocial || 
                 subscriberData?.fantasyName || 
                 'Nome não encontrado';
    
    console.log('Nome do assinante encontrado:', name);
    return name;
  };

  const getSelectedSubscriberType = () => {
    if (!selectedSubscriberId) return '';
    const subscriber = subscribers.find(s => s.id === selectedSubscriberId);
    if (!subscriber) return '';
    const subscriberData = subscriber.subscriber as any;
    return subscriberData?.cpf ? 'Pessoa Física' : 'Pessoa Jurídica';
  };

  const isFormValid = () => {
    if (!manualData.uc || !manualData.documento) return false;
    if (manualData.tipo === 'fisica' && !manualData.dataNascimento) return false;
    return true;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl transform rotate-3">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Consulta de Fatura
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Obtenha suas faturas diretamente da distribuidora de energia de forma rápida e segura
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Instantâneo
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Seguro
              </Badge>
              {faturaResult && (
                <Button variant="outline" size="sm" onClick={resetForm} className="ml-4">
                  Nova Consulta
                </Button>
              )}
            </div>
          </div>

          {!isConsultingFatura && !faturaResult && (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Mode Selection - Enhanced Design */}
              <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Como deseja consultar a fatura?
                  </CardTitle>
                  <CardDescription className="text-emerald-100 mt-2">
                    Escolha entre selecionar um assinante cadastrado ou inserir os dados manualmente
                  </CardDescription>
                </div>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button
                      variant={entryMode === 'select' ? 'default' : 'outline'}
                      className={`h-24 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                        entryMode === 'select' 
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg scale-105' 
                          : 'hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105'
                      }`}
                      onClick={() => setEntryMode('select')}
                    >
                      <Users className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold">Selecionar Assinante</div>
                        <div className="text-xs opacity-80">Dados automáticos</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant={entryMode === 'manual' ? 'default' : 'outline'}
                      className={`h-24 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                        entryMode === 'manual' 
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg scale-105' 
                          : 'hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105'
                      }`}
                      onClick={() => setEntryMode('manual')}
                    >
                      <Edit className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold">Inserir Dados</div>
                        <div className="text-xs opacity-80">Digitação manual</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Entry Form - Enhanced Design */}
              <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    {entryMode === 'select' ? (
                      <>
                        <User className="w-5 h-5" />
                        Selecionar Assinante
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Informações da Conta
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-2">
                    {entryMode === 'select' 
                      ? 'Escolha um assinante cadastrado para carregar os dados automaticamente'
                      : 'Preencha as informações necessárias para consultar a fatura'
                    }
                  </CardDescription>
                </div>
                
                <CardContent className="p-6 space-y-6">
                  {entryMode === 'select' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Assinante Cadastrado
                        </label>
                        <Select
                          value={selectedSubscriberId}
                          onValueChange={setSelectedSubscriberId}
                          disabled={isLoadingSubscribers}
                        >
                          <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 transition-colors">
                            <SelectValue placeholder={isLoadingSubscribers ? "Carregando assinantes..." : "Selecione um assinante"} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                            {subscribers.map((subscriber) => {
                              const subscriberData = subscriber.subscriber as any;
                              const energyAccount = subscriber.energy_account as any;
                              
                              const name = subscriberData?.fullName || 
                                          subscriberData?.nome || 
                                          subscriberData?.companyName || 
                                          subscriberData?.razaoSocial || 
                                          subscriberData?.fantasyName || 
                                          'Nome não encontrado';
                              
                              const uc = energyAccount?.uc || 'UC não informada';
                              const tipo = subscriberData?.cpf ? 'CPF' : 'CNPJ';
                              const documento = subscriberData?.cpf || subscriberData?.cnpj || '';
                              
                              return (
                                <SelectItem key={subscriber.id} value={subscriber.id} className="p-4 hover:bg-emerald-50">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                                      {subscriberData?.cpf ? (
                                        <User className="w-5 h-5 text-white" />
                                      ) : (
                                        <Building2 className="w-5 h-5 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">{name}</div>
                                      <div className="text-sm text-gray-500">UC: {uc}</div>
                                      <div className="text-xs text-gray-400">{tipo}: {documento}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        
                        {selectedSubscriberId && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-emerald-800">
                                  {getSelectedSubscriberName()}
                                </div>
                                <div className="text-sm text-emerald-600">
                                  {getSelectedSubscriberType()} • Dados carregados automaticamente
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {entryMode === 'manual' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Tipo de Pessoa
                        </label>
                        <Select
                          value={manualData.tipo}
                          onValueChange={(value: 'fisica' | 'juridica') => 
                            setManualData(prev => ({ ...prev, tipo: value, dataNascimento: value === 'juridica' ? '' : prev.dataNascimento }))
                          }
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                            <SelectItem value="fisica" className="p-3 hover:bg-emerald-50">
                              <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-emerald-600" />
                                <span>Pessoa Física</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="juridica" className="p-3 hover:bg-emerald-50">
                              <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                <span>Pessoa Jurídica</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Unidade Consumidora (UC)
                      </label>
                      <Input
                        placeholder="Ex: 10038684096"
                        className="h-12 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 transition-colors"
                        value={manualData.uc}
                        onChange={(e) => setManualData(prev => ({ ...prev, uc: e.target.value }))}
                        disabled={entryMode === 'select' && selectedSubscriberId !== ''}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {manualData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
                      </label>
                      <MaskedInput
                        mask={manualData.tipo === 'fisica' ? "999.999.999-99" : "99.999.999/9999-99"}
                        placeholder={manualData.tipo === 'fisica' ? "000.000.000-00" : "00.000.000/0000-00"}
                        className="h-12 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 transition-colors"
                        value={manualData.documento}
                        onChange={(e) => setManualData(prev => ({ ...prev, documento: e.target.value }))}
                        disabled={entryMode === 'select' && selectedSubscriberId !== ''}
                      />
                    </div>
                  </div>

                  {manualData.tipo === 'fisica' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Data de Nascimento
                        <Badge variant="secondary" className="ml-2 text-xs">Obrigatório</Badge>
                      </label>
                      <MaskedInput
                        mask="99/99/9999"
                        placeholder="DD/MM/AAAA"
                        className="h-12 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 transition-colors"
                        value={manualData.dataNascimento}
                        onChange={(e) => setManualData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                        disabled={entryMode === 'select' && selectedSubscriberId !== ''}
                      />
                    </div>
                  )}

                  {/* Validation Messages */}
                  {!isFormValid() && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Campos obrigatórios em falta:</span>
                      </div>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        {!manualData.uc && <li>• Unidade Consumidora (UC)</li>}
                        {!manualData.documento && <li>• {manualData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}</li>}
                        {manualData.tipo === 'fisica' && !manualData.dataNascimento && <li>• Data de Nascimento</li>}
                      </ul>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg h-14 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    onClick={handleConsultar}
                    disabled={(entryMode === 'select' && !selectedSubscriberId) || !isFormValid()}
                  >
                    <Search className="w-5 h-5 mr-3" />
                    Consultar Fatura na Distribuidora
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Progress Bar - Enhanced */}
          {isConsultingFatura && (
            <Card className="border-0 shadow-xl bg-white max-w-2xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
                <div className="text-center text-white">
                  <Timer className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">Processando Consulta</h3>
                  <p className="opacity-90">Conectando com a distribuidora...</p>
                </div>
              </div>
              
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Progresso da Consulta</span>
                    <span className="text-lg font-bold text-blue-600">{Math.round(consultaProgress)}%</span>
                  </div>
                  <Progress value={consultaProgress} className="h-4 bg-gray-200" />
                  
                  <div className="flex justify-center items-center gap-3 text-emerald-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium text-lg">
                      {timeRemaining > 0 ? `${timeRemaining}s restantes` : 'Finalizando consulta...'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result - Enhanced */}
          {faturaResult && (
            <Card className="border-0 shadow-xl bg-white max-w-2xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Fatura Encontrada!</CardTitle>
                    <CardDescription className="text-emerald-100 text-lg">{faturaResult.message}</CardDescription>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-800 mb-2">
                      <FileText className="w-5 h-5" />
                      <span className="font-semibold">Documento Gerado</span>
                    </div>
                    <p className="text-emerald-700 text-sm">
                      Sua fatura foi localizada e está pronta para download. O arquivo será aberto em uma nova aba.
                    </p>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg h-14 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(faturaResult.fatura_url, '_blank')}
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Baixar Fatura em PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FaturaUnica;
