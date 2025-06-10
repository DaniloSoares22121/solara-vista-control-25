
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Search, Edit3, Download, Zap } from 'lucide-react';
import { useState } from 'react';

const FaturaUnica = () => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedAssinante, setSelectedAssinante] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
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
          <div className="lg:ml-auto">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Consulta Instantânea
            </Badge>
          </div>
        </div>

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
                    <span className="text-xs sm:text-sm text-gray-500">Busca na Lista</span>
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
                    placeholder="Buscar assinante por nome ou CNF..."
                    className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                {isSearching && (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-gray-500 text-xs sm:text-sm">Buscando assinantes...</div>
                  </div>
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
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Unidade Consumidora (UC)
                    </label>
                    <Input
                      placeholder="Ex: 10038684096"
                      className="h-10 sm:h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CPF ou CNPJ
                    </label>
                    <Input
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      className="h-10 sm:h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg h-10 sm:h-12 text-sm">
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
      </div>
    </DashboardLayout>
  );
};

export default FaturaUnica;
