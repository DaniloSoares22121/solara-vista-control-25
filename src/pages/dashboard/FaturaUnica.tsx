
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaskedInput } from '@/components/ui/masked-input';
import { FileText, Search, Download, Zap, Clock, Check, Timer } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FaturaResponse {
  fatura_url: string;
  message: string;
  pdf_path: string;
}

const FaturaUnica = () => {
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

  const handleConsultarManual = () => {
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
          <div className="max-w-2xl mx-auto">
            {/* Manual Data Entry */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg sm:text-xl">Consultar Fatura</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Digite os dados para consultar a fatura diretamente na distribuidora
                </CardDescription>
              </CardHeader>
              
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
                    className="h-10 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm"
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
                    className="h-10 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm"
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
                      className="h-10 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm"
                      value={manualData.dataNascimento}
                      onChange={(e) => setManualData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                    />
                  </div>
                )}

                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg h-10 sm:h-12 text-sm"
                  onClick={handleConsultarManual}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Consultar Fatura
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        {isConsultingFatura && (
          <Card className="border-0 shadow-lg bg-white max-w-2xl mx-auto">
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
          <Card className="border-0 shadow-lg bg-white max-w-2xl mx-auto">
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
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FaturaUnica;
