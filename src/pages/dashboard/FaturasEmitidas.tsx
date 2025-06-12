
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileText, Download, Filter, DollarSign, Calendar, TrendingUp, Eye } from 'lucide-react';
import { faturaValidacaoService, type FaturaEmitida } from '@/services/faturaValidacaoService';
import FaturaViewModal from '@/components/FaturaViewModal';

const FaturasEmitidas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedFatura, setSelectedFatura] = useState<FaturaEmitida | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: faturas = [], isLoading } = useQuery({
    queryKey: ['faturas-emitidas'],
    queryFn: faturaValidacaoService.getFaturasEmitidas,
  });

  const filteredFaturas = faturas.filter(fatura => {
    const matchesSearch = searchTerm === '' || 
      fatura.uc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatura.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fatura.numero_fatura && fatura.numero_fatura.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'todos' || fatura.status_pagamento === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalFaturas = faturas.length;
  const valorTotal = faturas.reduce((acc, fatura) => acc + (fatura.valor_total || 0), 0);
  const faturasPagas = faturas.filter(f => f.status_pagamento === 'pago').length;
  const taxaRecebimento = totalFaturas > 0 ? Math.round((faturasPagas / totalFaturas) * 100) : 0;

  const handleViewFatura = (fatura: FaturaEmitida) => {
    setSelectedFatura(fatura);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">Pendente</Badge>;
      case 'pago':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Pago</Badge>;
      case 'vencido':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">Vencido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Faturas Emitidas</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Gerencie as faturas emitidas e acompanhe os pagamentos</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Exportar
            </Button>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-2 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Total: {formatCurrency(valorTotal)}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total de Faturas</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{totalFaturas}</div>
              <p className="text-xs sm:text-sm text-gray-500">Emitidas este mês</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Valor Total</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{formatCurrency(valorTotal)}</div>
              <p className="text-xs sm:text-sm text-gray-500">Valor faturado</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Faturas Pagas</CardTitle>
                <div className="p-2 rounded-lg bg-purple-50">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{faturasPagas}</div>
              <p className="text-xs sm:text-sm text-gray-500">{totalFaturas > 0 ? `${Math.round((faturasPagas / totalFaturas) * 100)}% quitadas` : '0% quitadas'}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Taxa de Recebimento</CardTitle>
                <div className="p-2 rounded-lg bg-orange-50">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{taxaRecebimento}%</div>
              <p className="text-xs sm:text-sm text-gray-500">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Buscar faturas por número, assinante ou referência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-gray-50 text-sm"
                />
              </div>
              <div className="flex gap-2 lg:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 border-gray-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-10 sm:h-12 px-4 sm:px-6 border-gray-200 hover:bg-gray-50 text-sm whitespace-nowrap">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Table */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Lista de Faturas Emitidas ({filteredFaturas.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredFaturas.length === 0 ? (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {searchTerm || statusFilter !== 'todos' ? 'Nenhuma fatura encontrada' : 'Nenhuma fatura emitida'}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {searchTerm || statusFilter !== 'todos' 
                        ? 'Tente ajustar os filtros de busca' 
                        : 'As faturas aprovadas aparecerão aqui automaticamente'
                      }
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 text-xs sm:text-sm">
                    Aguardando aprovações
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-700 py-3 sm:py-4 text-xs sm:text-sm">Número</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">UC</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Documento</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Referência</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Valor Total</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Emissão</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaturas.map((fatura) => (
                      <TableRow key={fatura.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-xs sm:text-sm">{fatura.numero_fatura}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{fatura.uc}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{fatura.documento}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{fatura.referencia}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{formatCurrency(fatura.valor_total || 0)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{formatDate(fatura.data_emissao)}</TableCell>
                        <TableCell>{getStatusBadge(fatura.status_pagamento)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewFatura(fatura)}
                              className="p-1 sm:p-2 h-7 sm:h-8 w-7 sm:w-8 hover:bg-blue-50"
                              title="Visualizar fatura"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(fatura.fatura_url, '_blank')}
                              className="p-1 sm:p-2 h-7 sm:h-8 w-7 sm:w-8 hover:bg-green-50"
                              title="Baixar fatura"
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para visualizar fatura */}
        {selectedFatura && (
          <FaturaViewModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedFatura(null);
            }}
            faturaUrl={selectedFatura.fatura_url}
            documento={selectedFatura.documento}
            uc={selectedFatura.uc}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default FaturasEmitidas;
