
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { FileText, Users, Search, Edit3 } from 'lucide-react';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-600">Fatura Única</h1>
            <p className="text-gray-600 mt-1">Consulte e baixe faturas individuais diretamente da distribuidora</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Method Selection */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Selecionar Assinante</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-600">Lista</span>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <CardDescription>
                  Busque e selecione o assinante para consultar a fatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar assinante por nome ou CNF"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="text-gray-500">Buscando...</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Data Entry */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Digitar Dados</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Manual</span>
                    <Switch
                      checked={isManualMode}
                      onCheckedChange={setIsManualMode}
                    />
                  </div>
                </div>
                <CardDescription>
                  Digite os dados manualmente para consultar a fatura
                </CardDescription>
              </CardHeader>
              
              {isManualMode && (
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade Consumidora (UC)
                    </label>
                    <Input
                      placeholder="Ex: 10038684096"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF ou CNPJ
                    </label>
                    <Input
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {!selectedAssinante && !isManualMode && (
              <Card className="border-0 shadow-sm h-full">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum assinante selecionado
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Selecione um assinante na lista ao lado para consultar suas faturas na distribuidora.
                  </p>
                </CardContent>
              </Card>
            )}

            {isManualMode && (
              <Card className="border-0 shadow-sm h-full">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Edit3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Preencha os dados
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Digite a UC, CPF/CNPJ e data de nascimento (se CPF) para consultar a fatura.
                  </p>
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
