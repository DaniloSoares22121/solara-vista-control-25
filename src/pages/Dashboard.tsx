
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Users, FileText, TrendingUp, Activity, AlertTriangle, CheckCircle, Clock, ArrowUpRight, Eye, Plus } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { stats, isLoading, error } = useDashboardStats();

  const userDisplayName = currentUser?.user_metadata?.full_name || currentUser?.email || 'Usuário';

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Carregando painel..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertTriangle className="w-6 h-6 text-red-500 inline-block mr-2" />
        Erro ao carregar os dados do painel.
      </div>
    );
  }

  // Calculate compliance rate from available data
  const complianceRate = stats?.faturasPagas && stats?.faturasEmitidas 
    ? Math.round((stats.faturasPagas / stats.faturasEmitidas) * 100) 
    : 0;

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header com espaçamento consistente */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo(a), {userDisplayName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral do seu negócio e principais indicadores.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/geradoras/nova')} 
          className="bg-green-600 hover:bg-green-700 text-white shadow-sm h-11 px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Geradora
        </Button>
      </div>

      {/* Stats Cards com grid responsivo e espaçamento consistente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Assinantes Ativos
              </CardTitle>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalAssinantes || 0}</div>
            <p className="text-sm text-gray-600">
              Total de assinantes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Geradoras Ativas
              </CardTitle>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalGeradoras || 0}</div>
            <p className="text-sm text-gray-600">
              Geradoras cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Faturas Emitidas
              </CardTitle>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.faturasEmitidas || 0}</div>
            <p className="text-sm text-gray-600">
              {stats?.faturasPendentes || 0} pendentes de validação
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Pagamento
              </CardTitle>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-600 mb-1">{complianceRate}%</div>
            <p className="text-sm text-gray-600">
              Faturas pagas vs emitidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards com grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/dashboard/assinantes')} 
              variant="outline"
              className="h-11 justify-start"
            >
              <Users className="w-4 h-4 mr-3" />
              Gerenciar Assinantes
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/fatura-unica')} 
              variant="outline"
              className="h-11 justify-start"
            >
              <FileText className="w-4 h-4 mr-3" />
              Emitir Fatura Unica
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/geradoras')} 
              variant="outline"
              className="h-11 justify-start"
            >
              <Zap className="w-4 h-4 mr-3" />
              Gerenciar Geradoras
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/rateio')} 
              variant="outline"
              className="h-11 justify-start"
            >
              <Activity className="w-4 h-4 mr-3" />
              Realizar Rateio
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-800 font-medium">Total de Faturas</span>
              </div>
              <span className="font-semibold text-gray-900">{stats?.totalFaturas || 0}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-800 font-medium">Valor Total</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {stats?.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-800 font-medium">Faturas Pagas</span>
              </div>
              <span className="font-semibold text-gray-900">{stats?.faturasPagas || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
