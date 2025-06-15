import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, FileCheck, FileX, Clock, CheckCircle, XCircle, Filter, Eye, Download, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { faturaValidacaoService, type FaturaValidacao as FaturaValidacaoType } from '@/services/faturaValidacaoService';
import { toast } from 'sonner';

const FaturaValidacao = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: faturas = [], isLoading, refetch } = useQuery({
    queryKey: ['faturas-validacao'],
    queryFn: faturaValidacaoService.getFaturasValidacao,
  });

  const filteredFaturas = faturas.filter(fatura => {
    const matchesSearch = searchTerm === '' || 
      fatura.uc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatura.documento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fatura.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendentes = faturas.filter(f => f.status === 'pendente').length;
  const aprovadas = faturas.filter(f => f.status === 'aprovada').length;
  const rejeitadas = faturas.filter(f => f.status === 'rejeitada').length;
  const total = faturas.length;
  const taxaAprovacao = total > 0 ? Math.round((aprovadas / total) * 100) : 0;

  const handleUpdateStatus = async (id: string, status: 'aprovada' | 'rejeitada') => {
    try {
      await faturaValidacaoService.updateStatusFatura(id, status);
      if (status === 'aprovada') {
        toast.success('Fatura aprovada e movida para faturas emitidas!');
      } else {
        toast.success('Fatura rejeitada com sucesso!');
      }
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da fatura');
    }
  };

  const handleDeleteFatura = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta fatura?')) return;
    
    try {
      await faturaValidacaoService.deleteFaturaValidacao(id);
      toast.success('Fatura excluída com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao excluir fatura:', error);
      toast.error('Erro ao excluir fatura');
    }
  };

  const handleViewFatura = (fatura: FaturaValidacaoType) => {
    window.open(fatura.fatura_url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">Pendente</Badge>;
      case 'aprovada':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Aprovada</Badge>;
      case 'rejeitada':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Validação de Faturas</h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Gerencie e valide as faturas capturadas do sistema</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-2 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Pendentes: {pendentes}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Aguardando Validação</CardTitle>
              <div className="p-2 rounded-lg bg-orange-50">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{pendentes}</div>
            <p className="text-xs sm:text-sm text-gray-500">Faturas pendentes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Validadas</CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{aprovadas}</div>
            <p className="text-xs sm:text-sm text-gray-500">Aprovadas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Rejeitadas</CardTitle>
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{rejeitadas}</div>
            <p className="text-xs sm:text-sm text-gray-500">Necessitam correção</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Taxa de Aprovação</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{taxaAprovacao}%</div>
            <p className="text-xs sm:text-sm text-gray-500">Este período</p>
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
                placeholder="Buscar por UC ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-gray-50 text-sm"
              />
            </div>
            <div className="flex gap-2 lg:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 border-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="aprovada">Aprovadas</SelectItem>
                  <SelectItem value="rejeitada">Rejeitadas</SelectItem>
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
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
            Faturas para Validação ({filteredFaturas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredFaturas.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <FileX className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {searchTerm || statusFilter !== 'all' ? 'Nenhuma fatura encontrada' : 'Nenhuma fatura pendente'}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Tente ajustar os filtros de busca' 
                      : 'Todas as faturas capturadas foram processadas'
                    }
                  </p>
                </div>
                {!searchTerm && statusFilter === 'all' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs sm:text-sm">
                    Tudo em dia ✓
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-3 sm:py-4 text-xs sm:text-sm">UC</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Documento</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Tipo</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Data Captura</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaturas.map((fatura) => (
                    <TableRow key={fatura.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm">{fatura.uc}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{fatura.documento}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Badge variant="outline" className="text-xs">
                          {fatura.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatDate(fatura.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(fatura.status)}</TableCell>
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
                          {fatura.status === 'pendente' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUpdateStatus(fatura.id, 'aprovada')}
                                className="p-1 sm:p-2 h-7 sm:h-8 w-7 sm:w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Aprovar fatura"
                              >
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUpdateStatus(fatura.id, 'rejeitada')}
                                className="p-1 sm:p-2 h-7 sm:h-8 w-7 sm:w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Rejeitar fatura"
                              >
                                <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteFatura(fatura.id)}
                            className="p-1 sm:p-2 h-7 sm:h-8 w-7 sm:w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Excluir fatura"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
    </div>
  );
};

export default FaturaValidacao;
