
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo(a), {userDisplayName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral do seu negócio e principais indicadores.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/geradoras/nova')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Geradora
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Assinantes Ativos
              </CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalAssinantes || 0}</div>
            <p className="text-sm text-gray-600 mt-1">
              Total de assinantes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Geradoras Ativas
              </CardTitle>
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalGeradoras || 0}</div>
            <p className="text-sm text-gray-600 mt-1">
              Geradoras cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Faturas Emitidas
              </CardTitle>
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.faturasEmitidas || 0}</div>
            <p className="text-sm text-gray-600 mt-1">
              {stats?.faturasPendentes || 0} pendentes de validação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Pagamento
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{complianceRate}%</div>
            <p className="text-sm text-gray-600 mt-1">
              Faturas pagas vs emitidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={() => navigate('/dashboard/assinantes')} variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Assinantes
            </Button>
            <Button onClick={() => navigate('/dashboard/fatura-unica')} variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Emitir Fatura Única
            </Button>
            <Button onClick={() => navigate('/dashboard/geradoras')} variant="outline" className="justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Gerenciar Geradoras
            </Button>
            <Button onClick={() => navigate('/dashboard/rateio')} variant="outline" className="justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Realizar Rateio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-800">Total de Faturas</span>
              </div>
              <span className="font-semibold text-gray-900">{stats?.totalFaturas || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-800">Valor Total</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {stats?.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-800">Faturas Pagas</span>
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
