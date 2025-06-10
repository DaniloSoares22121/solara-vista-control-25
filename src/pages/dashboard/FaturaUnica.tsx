
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
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Fatura Única
            </h1>
            <p className="text-gray-600 text-lg">Consulte e baixe faturas individuais diretamente da distribuidora</p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Consulta Instantânea
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Method Selection */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Selecionar Assinante</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-500">Busca na Lista</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <CardDescription className="text-gray-600">
                  Busque e selecione o assinante para consultar a fatura
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar assinante por nome ou CNF..."
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                {isSearching && (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-gray-500 text-sm">Buscando assinantes...</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Data Entry */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Edit3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Digitar Dados</CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Entrada Manual</span>
                    <Switch
                      checked={isManualMode}
                      onCheckedChange={setIsManualMode}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
                <CardDescription className="text-gray-600">
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
                      className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CPF ou CNPJ
                    </label>
                    <Input
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg h-12">
                    <Search className="w-5 h-5 mr-2" />
                    Consultar Fatura
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {!selectedAssinante && !isManualMode && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white h-full">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Search className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Aguardando Seleção
                    </h3>
                    <p className="text-gray-500 max-w-md leading-relaxed">
                      Selecione um assinante na lista ao lado para consultar suas faturas na distribuidora ou ative o modo manual.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isManualMode && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white h-full">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Edit3 className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                        Manual
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Modo Manual Ativo
                    </h3>
                    <p className="text-gray-500 max-w-md leading-relaxed">
                      Preencha os dados necessários para consultar a fatura diretamente na distribuidora.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600 mt-4">
                      <Download className="w-4 h-4" />
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
