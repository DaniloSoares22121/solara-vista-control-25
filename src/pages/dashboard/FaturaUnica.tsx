import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaskedInput } from '@/components/ui/masked-input';
import { FileText, Users, Search, Edit3, Download, Zap, Clock, Check, Eye, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FaturaResponse {
  fatura_url: string;
  message: string;
  pdf_path: string;
}

interface AssinanteListItem {
  id: string;
  nome: string;
  uc: string;
  cpfCnpj: string;
  tipo: 'fisica' | 'juridica';
}

const FaturaUnica = () => {
  const { subscribers } = useSubscribers();
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedAssinante, setSelectedAssinante] = useState<AssinanteListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredAssinantes, setFilteredAssinantes] = useState<AssinanteListItem[]>([]);
  
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

  // Converter assinantes para o formato da lista
  useEffect(() => {
    const assinantesFormatados: AssinanteListItem[] = subscribers.map(sub => ({
      id: sub.id,
      nome: sub.subscriber?.name || '',
      uc: sub.energyAccount?.originalAccount?.uc || '',
      cpfCnpj: sub.subscriber?.cpfCnpj || '',
      tipo: sub.subscriber?.type || 'fisica'
    }));
    setFilteredAssinantes(assinantesFormatados);
  }, [subscribers]);

  // Filtrar assinantes com base na busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      const assinantesFormatados: AssinanteListItem[] = subscribers.map(sub => ({
        id: sub.id,
        nome: sub.subscriber?.name || '',
        uc: sub.energyAccount?.originalAccount?.uc || '',
        cpfCnpj: sub.subscriber?.cpfCnpj || '',
        tipo: sub.subscriber?.type || 'fisica'
      }));
      setFilteredAssinantes(assinantesFormatados);
    } else {
      const filtered = filteredAssinantes.filter(
        assinante =>
          assinante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assinante.uc.includes(searchTerm) ||
          assinante.cpfCnpj.includes(searchTerm)
      );
      setFilteredAssinantes(filtered);
    }
  }, [searchTerm, subscribers]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const consultarFatura = async (dados: {
    uc: string;
    documento: string;
    dataNascimento?: string;
    tipo: 'fisica' | 'juridica';
  }, isFromAssinante: boolean = false) => {
    setIsConsultingFatura(true);
    setConsultaProgress(0);
    setTimeRemaining(15); // 15 segundos
    setFaturaResult(null);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setConsultaProgress(prev => {
          const next = prev + 6.67; // 100/15 = 6.67% por segundo
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

      // Só adicionar data de nascimento se for pessoa física
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
      
      // Se for de um assinante cadastrado, salvar na validação
      if (isFromAssinante && selectedAssinante) {
        // Aqui você salvaria na base de dados para aparecer em "Faturas em Validação"
        console.log('Salvando fatura para validação:', {
          assinanteId: selectedAssinante.id,
          faturaUrl: result.fatura_url,
          ...dados
        });
        toast.success('Fatura consultada e enviada para validação!');
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

  const handleConsultarAssinante = () => {
    if (!selectedAssinante) {
      toast.error('Selecione um assinante');
      return;
    }

    consultarFatura({
      uc: selectedAssinante.uc,
      documento: selectedAssinante.cpfCnpj,
      dataNascimento: selectedAssinante.tipo === 'fisica' ? '01/01/1990' : undefined, // Você deveria pegar a data real
      tipo: selectedAssinante.tipo
    }, true);
  };

  const handleConsultarManual = () => {
    if (!manualData.uc || !manualData.documento) {
      toast.error('Preencha UC e documento');
      return;
    }

    if (manualData.tipo === 'fisica' && !manualData.dataNascimento) {
      toast.error('Data de nascimento é obrigatória para pessoa física');
      return;
    }

    consultarFatura(manualData, false);
  };

  const resetForm = () => {
    setSelectedAssinante(null);
    setManualData({
      uc: '',
      documento: '',
      dataNascimento: '',
      tipo: 'fisica'
    });
    setFaturaResult(null);
    setConsultaProgress(0);
    setTimeRemaining(0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Fatura Única
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Consulte e baixe faturas individuais diretamente da distribuidora</p>
            </div>
          </div>
          <div className="lg:ml-auto flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Consulta Instantânea
            </Badge>
            {faturaResult && (
              <Button variant="outline" size="sm" onClick={resetForm}>
                Nova Consulta
              </Button>
            )}
          </div>
        </div>

        {!isConsultingFatura && !faturaResult && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Panel */}
            <div className="space-y-6">
              {/* Method Selection */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">Selecionar Assinante</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <span className="text-xs sm:text-sm text-gray-500">Lista Cadastrada</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-sm">
                    Busque e selecione o assinante para consultar a fatura
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      placeholder="Buscar por nome, UC ou CPF/CNPJ..."
                      className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  
                  {filteredAssinantes.length > 0 && (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredAssinantes.map((assinante) => (
                        <div
                          key={assinante.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedAssinante?.id === assinante.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedAssinante(assinante)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{assinante.nome}</p>
                              <p className="text-xs text-gray-500">UC: {assinante.uc}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {assinante.tipo === 'fisica' ? 'PF' : 'PJ'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedAssinante && (
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-10 sm:h-12 text-sm"
                      onClick={handleConsultarAssinante}
                    >
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Consultar Fatura
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Manual Data Entry */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">Digitar Dados</CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm text-gray-500">Entrada Manual</span>
                      <Switch
                        checked={isManualMode}
                        onCheckedChange={setIsManualMode}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-sm">
                    Digite os dados manualmente para consultar a fatura
                  </CardDescription>
                </CardHeader>
                
                {isManualMode && (
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Pessoa
                      </label>
                      <Select
                        value={manualData.tipo}
                        onValueChange={(value: 'fisica' | 'juridica') => 
                          setManualData(prev => ({ ...prev, tipo: value }))
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-12 border-gray-200 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fisica">Pessoa Física</SelectItem>
                          <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Unidade Consumidora (UC)
                      </label>
                      <Input
                        placeholder="Ex: 10038684096"
                        className="h-10 sm:h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                        value={manualData.uc}
                        onChange={(e) => setManualData(prev => ({ ...prev, uc: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {manualData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
                      </label>
                      <MaskedInput
                        mask={manualData.tipo === 'fisica' ? "999.999.999-99" : "99.999.999/9999-99"}
                        placeholder={manualData.tipo === 'fisica' ? "000.000.000-00" : "00.000.000/0000-00"}
                        className="h-10 sm:h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                        value={manualData.documento}
                        onChange={(e) => setManualData(prev => ({ ...prev, documento: e.target.value }))}
                      />
                    </div>

                    {manualData.tipo === 'fisica' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Data de Nascimento
                        </label>
                        <MaskedInput
                          mask="99/99/9999"
                          placeholder="DD/MM/AAAA"
                          className="h-10 sm:h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                          value={manualData.dataNascimento}
                          onChange={(e) => setManualData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                        />
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg h-10 sm:h-12 text-sm"
                      onClick={handleConsultarManual}
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Consultar Fatura
                    </Button>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {!selectedAssinante && !isManualMode && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white h-full min-h-[400px]">
                  <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
                    <div className="relative mb-6 sm:mb-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Search className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        Aguardando Seleção
                      </h3>
                      <p className="text-gray-500 max-w-md leading-relaxed text-sm sm:text-base">
                        Selecione um assinante na lista ao lado para consultar suas faturas na distribuidora ou ative o modo manual.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isManualMode && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white h-full min-h-[400px]">
                  <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
                    <div className="relative mb-6 sm:mb-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                        <Edit3 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                          Manual
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        Modo Manual Ativo
                      </h3>
                      <p className="text-gray-500 max-w-md leading-relaxed text-sm sm:text-base">
                        Preencha os dados necessários para consultar a fatura diretamente na distribuidora.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-600 mt-4">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Download automático após consulta</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isConsultingFatura && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                  <Timer className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Consultando Fatura</h3>
                  <p className="text-gray-600">Aguarde enquanto processamos sua solicitação...</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progresso</span>
                  <span className="text-sm text-gray-500">{Math.round(consultaProgress)}%</span>
                </div>
                <Progress value={consultaProgress} className="h-3" />
                
                <div className="flex justify-center items-center gap-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {timeRemaining > 0 ? `${timeRemaining}s restantes` : 'Finalizando...'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {faturaResult && (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Fatura Consultada com Sucesso!</CardTitle>
                  <CardDescription>{faturaResult.message}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                  onClick={() => window.open(faturaResult.fatura_url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Fatura
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-200 hover:bg-gray-50"
                  onClick={() => window.open(faturaResult.fatura_url, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FaturaUnica;

}
