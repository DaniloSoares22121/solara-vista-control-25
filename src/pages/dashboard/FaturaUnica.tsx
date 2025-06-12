import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MaskedInput } from '@/components/ui/masked-input';
import { FileText, Search, Download, Zap, Clock, Check, Timer, Users, Edit, User, Building2, Calendar, CreditCard, AlertCircle, CheckCircle2, Save, Sparkles, Star, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSubscribers } from '@/hooks/useSubscribers';
import { faturaValidacaoService } from '@/services/faturaValidacaoService';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
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
  const [isSavingValidacao, setIsSavingValidacao] = useState(false);

  // Preencher dados quando selecionar assinante
  useEffect(() => {
    if (selectedSubscriberId && entryMode === 'select') {
      const subscriber = subscribers.find(s => s.id === selectedSubscriberId);
      if (subscriber) {
        const energyAccount = subscriber.energy_account as any;
        const subscriberData = subscriber.subscriber as any;
        
        console.log('Dados do assinante:', subscriberData);
        console.log('Conta de energia:', energyAccount);
        
        // Determinar tipo baseado nos dados disponíveis - melhorar lógica
        const isPessoaFisica = subscriberData?.cpf || energyAccount?.holderType === 'person';
        const isPessoaJuridica = subscriberData?.cnpj || energyAccount?.holderType === 'company' || energyAccount?.cpfCnpj?.includes('/');
        
        // Priorizar dados do energy_account se disponível, depois subscriber
        const documento = energyAccount?.cpfCnpj || subscriberData?.cpf || subscriberData?.cnpj || '';
        
        // Para pessoa física, pegar data de nascimento
        let dataNascimento = '';
        if (isPessoaFisica && !isPessoaJuridica) {
          const birthDate = subscriberData?.birthDate || energyAccount?.birthDate;
          if (birthDate) {
            if (birthDate.includes('-')) {
              const [year, month, day] = birthDate.split('-');
              dataNascimento = `${day}/${month}/${year}`;
            } else {
              dataNascimento = birthDate;
            }
          }
        }
        
        setManualData({
          uc: energyAccount?.uc || '',
          documento: documento,
          dataNascimento: dataNascimento,
          tipo: isPessoaJuridica ? 'juridica' : 'fisica'
        });
        
        console.log('📋 Dados preenchidos:', {
          uc: energyAccount?.uc || '',
          documento: documento,
          dataNascimento: dataNascimento,
          tipo: isPessoaJuridica ? 'juridica' : 'fisica',
          isPessoaFisica,
          isPessoaJuridica
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
        // Se for erro de status code não-2xx, mostrar mensagem específica
        if (error.message?.includes('non-2xx status code')) {
          throw new Error('Nenhuma fatura encontrada');
        }
        throw new Error(error.message || 'Erro ao consultar fatura');
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setFaturaResult(result);
      
      // Se for de assinante cadastrado, salvar em validação
      if (entryMode === 'select' && selectedSubscriberId) {
        try {
          setIsSavingValidacao(true);
          await faturaValidacaoService.createFaturaValidacao({
            subscriber_id: selectedSubscriberId,
            uc: dados.uc,
            documento: dados.documento,
            data_nascimento: dados.dataNascimento,
            tipo_pessoa: dados.tipo,
            fatura_url: result.fatura_url,
            pdf_path: result.pdf_path,
            message: result.message
          });
          toast.success('Fatura consultada e salva para validação!');
        } catch (error) {
          console.error('Erro ao salvar fatura para validação:', error);
          toast.error('Fatura consultada, mas erro ao salvar para validação');
        } finally {
          setIsSavingValidacao(false);
        }
      } else {
        toast.success('Fatura consultada com sucesso!');
      }

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
    setSearchValue('');
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
    const energyAccount = subscriber.energy_account as any;
    
    // Verificar diferentes campos possíveis para o nome, incluindo energy_account
    const name = subscriberData?.fullName || 
                 subscriberData?.nome || 
                 subscriberData?.companyName || 
                 subscriberData?.razaoSocial || 
                 subscriberData?.fantasyName ||
                 energyAccount?.holderName ||
                 'Nome não encontrado';
    
    console.log('Nome do assinante encontrado:', name);
    return name;
  };

  const getSelectedSubscriberType = () => {
    if (!selectedSubscriberId) return '';
    const subscriber = subscribers.find(s => s.id === selectedSubscriberId);
    if (!subscriber) return '';
    const subscriberData = subscriber.subscriber as any;
    const energyAccount = subscriber.energy_account as any;
    
    // Melhorar detecção do tipo
    const isPessoaJuridica = subscriberData?.cnpj || energyAccount?.holderType === 'company' || energyAccount?.cpfCnpj?.includes('/');
    return isPessoaJuridica ? 'Pessoa Jurídica' : 'Pessoa Física';
  };

  const isFormValid = () => {
    if (!manualData.uc || !manualData.documento) return false;
    if (manualData.tipo === 'fisica' && !manualData.dataNascimento) return false;
    return true;
  };

  // Filtrar assinantes baseado na busca
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const subscriberData = subscriber.subscriber as any;
    const energyAccount = subscriber.energy_account as any;
    
    const name = subscriberData?.fullName || 
                 subscriberData?.nome || 
                 subscriberData?.companyName || 
                 subscriberData?.razaoSocial || 
                 subscriberData?.fantasyName ||
                 energyAccount?.holderName || '';
    
    const uc = energyAccount?.uc || '';
    const documento = energyAccount?.cpfCnpj || subscriberData?.cpf || subscriberData?.cnpj || '';
    
    const searchLower = searchValue.toLowerCase();
    return name.toLowerCase().includes(searchLower) || 
           uc.includes(searchValue) || 
           documento.includes(searchValue);
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Enhanced Header with animated elements */}
          <div className="text-center space-y-6 relative">
            {/* Floating decoration elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-1/4 w-20 h-20 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-16 right-1/3 w-16 h-16 bg-emerald-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute top-6 right-1/4 w-12 h-12 bg-teal-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
            </div>
            
            <div className="flex justify-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Consulta de Fatura
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Obtenha suas faturas diretamente da distribuidora de energia de forma rápida, segura e inteligente
              </p>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-6 py-3 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Instantâneo
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 px-6 py-3 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Seguro
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 border-teal-200 px-6 py-3 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Inteligente
              </Badge>
              {faturaResult && (
                <Button variant="outline" size="sm" onClick={resetForm} className="ml-4 hover:scale-105 transition-transform">
                  Nova Consulta
                </Button>
              )}
            </div>
          </div>

          {!isConsultingFatura && !faturaResult && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Mode Selection - Ultra Enhanced Design */}
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-3xl transition-all duration-500">
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <CardTitle className="text-2xl text-white flex items-center gap-3 mb-2">
                      <Search className="w-6 h-6" />
                      Como deseja consultar a fatura?
                    </CardTitle>
                    <CardDescription className="text-green-100 text-lg">
                      Escolha entre selecionar um assinante cadastrado ou inserir os dados manualmente
                    </CardDescription>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                </div>
                
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Button
                      variant={entryMode === 'select' ? 'default' : 'outline'}
                      className={`h-32 flex flex-col items-center justify-center gap-4 transition-all duration-300 text-lg ${
                        entryMode === 'select' 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl scale-105 border-2 border-green-300' 
                          : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:scale-105 border-2 border-gray-200'
                      }`}
                      onClick={() => setEntryMode('select')}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        entryMode === 'select' ? 'bg-white/20' : 'bg-green-100'
                      }`}>
                        <Users className={`w-6 h-6 ${entryMode === 'select' ? 'text-white' : 'text-green-600'}`} />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">Selecionar Assinante</div>
                        <div className="text-sm opacity-80">Dados automáticos</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant={entryMode === 'manual' ? 'default' : 'outline'}
                      className={`h-32 flex flex-col items-center justify-center gap-4 transition-all duration-300 text-lg ${
                        entryMode === 'manual' 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl scale-105 border-2 border-emerald-300' 
                          : 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 hover:scale-105 border-2 border-gray-200'
                      }`}
                      onClick={() => setEntryMode('manual')}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        entryMode === 'manual' ? 'bg-white/20' : 'bg-emerald-100'
                      }`}>
                        <Edit className={`w-6 h-6 ${entryMode === 'manual' ? 'text-white' : 'text-emerald-600'}`} />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">Inserir Dados</div>
                        <div className="text-sm opacity-80">Digitação manual</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Entry Form - Ultra Enhanced Design */}
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-3xl transition-all duration-500">
                <div className={`p-8 relative overflow-hidden ${
                  entryMode === 'select' 
                    ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600' 
                    : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600'
                }`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <CardTitle className="text-2xl text-white flex items-center gap-3 mb-2">
                      {entryMode === 'select' ? (
                        <>
                          <User className="w-6 h-6" />
                          Selecionar Assinante
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6" />
                          Informações da Conta
                        </>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/90 text-lg">
                      {entryMode === 'select' 
                        ? 'Escolha um assinante cadastrado para carregar os dados automaticamente e salvar para validação'
                        : 'Preencha as informações necessárias para consultar a fatura (apenas visualização)'
                      }
                    </CardDescription>
                  </div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                </div>
                
                <CardContent className="p-8 space-y-8">
                  {entryMode === 'select' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3">
                          <Users className="w-5 h-5" />
                          Assinante Cadastrado
                        </label>
                        
                        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={searchOpen}
                              className="h-16 w-full justify-between border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 transition-colors bg-white/70 backdrop-blur-sm text-lg"
                              disabled={isLoadingSubscribers}
                            >
                              {selectedSubscriberId ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                                    {(() => {
                                      const subscriber = subscribers.find(s => s.id === selectedSubscriberId);
                                      const subscriberData = subscriber?.subscriber as any;
                                      return subscriberData?.cpf ? (
                                        <User className="w-4 h-4 text-white" />
                                      ) : (
                                        <Building2 className="w-4 h-4 text-white" />
                                      );
                                    })()}
                                  </div>
                                  <span className="font-medium">{getSelectedSubscriberName()}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  {isLoadingSubscribers ? "Carregando assinantes..." : "Buscar assinante..."}
                                </span>
                              )}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-white/95 backdrop-blur-sm border-2 border-gray-200 shadow-2xl" align="start">
                            <Command>
                              <CommandInput 
                                placeholder="Buscar por nome, UC ou documento..." 
                                value={searchValue}
                                onValueChange={setSearchValue}
                                className="h-12"
                              />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>Nenhum assinante encontrado.</CommandEmpty>
                                <CommandGroup>
                                  {filteredSubscribers.map((subscriber) => {
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
                                      <CommandItem
                                        key={subscriber.id}
                                        value={`${name} ${uc} ${documento}`}
                                        onSelect={() => {
                                          setSelectedSubscriberId(subscriber.id);
                                          setSearchOpen(false);
                                        }}
                                        className="p-4 hover:bg-emerald-50 cursor-pointer"
                                      >
                                        <div className="flex items-center gap-4 w-full">
                                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                            {subscriberData?.cpf ? (
                                              <User className="w-5 h-5 text-white" />
                                            ) : (
                                              <Building2 className="w-5 h-5 text-white" />
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{name}</div>
                                            <div className="text-sm text-gray-500 font-medium">UC: {uc}</div>
                                            <div className="text-xs text-gray-400">{tipo}: {documento}</div>
                                          </div>
                                          <Check
                                            className={`ml-auto h-4 w-4 ${
                                              selectedSubscriberId === subscriber.id ? "opacity-100" : "opacity-0"
                                            }`}
                                          />
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        
                        {selectedSubscriberId && (
                          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-emerald-800 text-lg">
                                  {getSelectedSubscriberName()}
                                </div>
                                <div className="text-emerald-600 font-medium">
                                  {getSelectedSubscriberType()} • Dados carregados automaticamente
                                </div>
                                <div className="text-emerald-500 text-sm flex items-center gap-2 mt-1">
                                  <Save className="w-4 h-4" />
                                  Será salvo em "Faturas em Validação"
                                </div>
                              </div>
                            </div>
                            
                            {/* Mostrar os dados que serão utilizados */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-emerald-200">
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">UC</div>
                                <div className="text-emerald-800 font-semibold">{manualData.uc || 'Não informado'}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                                  {manualData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
                                </div>
                                <div className="text-emerald-800 font-semibold">{manualData.documento || 'Não informado'}</div>
                              </div>
                              {manualData.tipo === 'fisica' && (
                                <div className="space-y-1">
                                  <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Data Nascimento</div>
                                  <div className="text-emerald-800 font-semibold">{manualData.dataNascimento || 'Não informado'}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {entryMode === 'manual' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3">
                          <Building2 className="w-5 h-5" />
                          Tipo de Pessoa
                        </label>
                        <Select
                          value={manualData.tipo}
                          onValueChange={(value: 'fisica' | 'juridica') => 
                            setManualData(prev => ({ ...prev, tipo: value, dataNascimento: value === 'juridica' ? '' : prev.dataNascimento }))
                          }
                        >
                          <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors bg-white/70 backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 shadow-2xl">
                            <SelectItem value="fisica" className="p-4 hover:bg-green-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-green-600" />
                                <span className="font-medium">Pessoa Física</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="juridica" className="p-4 hover:bg-green-50 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium">Pessoa Jurídica</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3">
                            <Zap className="w-5 h-5" />
                            Unidade Consumidora (UC)
                          </label>
                          <Input
                            placeholder="Ex: 10038684096"
                            className="h-14 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors bg-white/70 backdrop-blur-sm text-lg"
                            value={manualData.uc}
                            onChange={(e) => setManualData(prev => ({ ...prev, uc: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3">
                            <CreditCard className="w-5 h-5" />
                            {manualData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
                          </label>
                          <MaskedInput
                            mask={manualData.tipo === 'fisica' ? "999.999.999-99" : "99.999.999/9999-99"}
                            placeholder={manualData.tipo === 'fisica' ? "000.000.000-00" : "00.000.000/0000-00"}
                            className="h-14 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors bg-white/70 backdrop-blur-sm text-lg"
                            value={manualData.documento}
                            onChange={(e) => setManualData(prev => ({ ...prev, documento: e.target.value }))}
                          />
                        </div>
                      </div>

                      {manualData.tipo === 'fisica' && (
                        <div className="space-y-3">
                          <label className="block text-lg font-semibold text-gray-700 flex items-center gap-3">
                            <Calendar className="w-5 h-5" />
                            Data de Nascimento
                            <Badge variant="secondary" className="ml-3 text-sm bg-red-100 text-red-700 border-red-200">Obrigatório</Badge>
                          </label>
                          <MaskedInput
                            mask="99/99/9999"
                            placeholder="DD/MM/AAAA"
                            className="h-14 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors bg-white/70 backdrop-blur-sm text-lg"
                            value={manualData.dataNascimento}
                            onChange={(e) => setManualData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                          />
                        </div>
                      )}

                      {/* Validation Messages */}
                      {!isFormValid() && (
                        <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl shadow-lg">
                          <div className="flex items-center gap-3 text-amber-800 mb-3">
                            <AlertCircle className="w-6 h-6" />
                            <span className="font-semibold text-lg">Campos obrigatórios em falta:</span>
                          </div>
                          <ul className="text-amber-700 space-y-2 font-medium">
                            {!manualData.uc && <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Unidade Consumidora (UC)</li>}
                            {!manualData.documento && <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> {manualData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}</li>}
                            {manualData.tipo === 'fisica' && !manualData.dataNascimento && <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Data de Nascimento</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-2xl h-16 text-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 border-0"
                    onClick={handleConsultar}
                    disabled={(entryMode === 'select' && !selectedSubscriberId) || !isFormValid()}
                  >
                    <Search className="w-6 h-6 mr-3" />
                    Consultar Fatura na Distribuidora
                    {entryMode === 'select' && selectedSubscriberId && (
                      <Badge className="ml-3 bg-white/20 text-white border-white/30">
                        + Salvar
                      </Badge>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Progress Bar - Ultra Enhanced */}
          {isConsultingFatura && (
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg max-w-3xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="text-center text-white relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center animate-pulse">
                    <Timer className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Processando Consulta</h3>
                  <p className="opacity-90 text-lg">Conectando com a distribuidora...</p>
                  {isSavingValidacao && (
                    <p className="text-yellow-200 text-sm mt-2 flex items-center justify-center gap-2">
                      <Save className="w-4 h-4 animate-pulse" />
                      Preparando para salvar na validação...
                    </p>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              </div>
              
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 text-lg">Progresso da Consulta</span>
                    <span className="text-2xl font-bold text-emerald-600">{Math.round(consultaProgress)}%</span>
                  </div>
                  <Progress value={consultaProgress} className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 ease-out"></div>
                  </Progress>
                  
                  <div className="flex justify-center items-center gap-4 text-emerald-600">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span className="font-medium text-xl">
                      {timeRemaining > 0 ? `${timeRemaining}s restantes` : 'Finalizando consulta...'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result - Ultra Enhanced */}
          {faturaResult && (
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg max-w-3xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="flex items-center gap-6 text-white relative z-10">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl text-white mb-2">Fatura Encontrada!</CardTitle>
                    <CardDescription className="text-emerald-100 text-xl font-medium">{faturaResult.message}</CardDescription>
                    {entryMode === 'select' && selectedSubscriberId && (
                      <div className="mt-3 flex items-center gap-2 text-emerald-100">
                        <Save className="w-5 h-5" />
                        <span className="font-medium">Salva em Faturas em Validação</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3 text-emerald-800 mb-3">
                      <FileText className="w-6 h-6" />
                      <span className="font-semibold text-lg">Documento Gerado</span>
                    </div>
                    <p className="text-emerald-700 font-medium">
                      Sua fatura foi localizada e está pronta para download. O arquivo será aberto em uma nova aba.
                    </p>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-2xl h-16 text-xl font-semibold transition-all duration-300 hover:scale-105 border-0"
                    onClick={() => window.open(faturaResult.fatura_url, '_blank')}
                  >
                    <Download className="w-6 h-6 mr-3" />
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
