
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
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Carregando painel..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 text-red-500 inline-block mr-2" />
          Erro ao carregar os dados do painel.
        </div>
      </div>
    );
  }

  // Calculate compliance rate from available data
  const complianceRate = stats?.faturasPagas && stats?.faturasEmitidas 
    ? Math.round((stats.faturasPagas / stats.faturasEmitidas) * 100) 
    : 0;

  return (
    <div className="w-full h-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-8 space-y-6">
        {/* Welcome Header moderno */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo(a), {userDisplayName}!
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">
              Visão geral do seu negócio e principais indicadores.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/geradoras/nova')} 
            className="btn-primary h-10 lg:h-12 px-4 lg:px-6 text-sm lg:text-base"
          >
            <Plus className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
            Nova Geradora
          </Button>
        </div>

        {/* Stats Cards modernos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="stats-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 lg:w-6 h-5 lg:h-6 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                Ativo
              </Badge>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stats?.totalAssinantes || 0}</div>
              <div className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Assinantes Ativos</div>
              <div className="text-xs text-gray-500">Total de assinantes cadastrados</div>
            </div>
          </div>

          <div className="stats-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 lg:w-6 h-5 lg:h-6 text-green-600" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                Online
              </Badge>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stats?.totalGeradoras || 0}</div>
              <div className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Geradoras Ativas</div>
              <div className="text-xs text-gray-500">Geradoras em operação</div>
            </div>
          </div>

          <div className="stats-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FileText className="w-5 lg:w-6 h-5 lg:h-6 text-yellow-600" />
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
                {stats?.faturasPendentes || 0} pendentes
              </Badge>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stats?.faturasEmitidas || 0}</div>
              <div className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Faturas Emitidas</div>
              <div className="text-xs text-gray-500">Total de faturas processadas</div>
            </div>
          </div>

          <div className="stats-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 lg:w-6 h-5 lg:h-6 text-purple-600" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                {complianceRate}%
              </Badge>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">{complianceRate}%</div>
              <div className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Taxa de Pagamento</div>
              <div className="text-xs text-gray-500">Faturas pagas vs emitidas</div>
            </div>
          </div>
        </div>

        {/* Action Cards modernos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="card-modern p-4 lg:p-6">
            <div className="mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Ações Rápidas</h3>
              <p className="text-sm lg:text-base text-gray-600">Acesse rapidamente as principais funcionalidades</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <Button 
                onClick={() => navigate('/dashboard/assinantes')} 
                variant="outline"
                className="btn-outline h-10 lg:h-12 justify-start text-left p-3 lg:p-4"
              >
                <Users className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm lg:text-base truncate">Assinantes</div>
                  <div className="text-xs text-gray-500">Gerenciar cadastros</div>
                </div>
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/fatura-unica')} 
                variant="outline"
                className="btn-outline h-10 lg:h-12 justify-start text-left p-3 lg:p-4"
              >
                <FileText className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm lg:text-base truncate">Fatura Única</div>
                  <div className="text-xs text-gray-500">Emitir nova fatura</div>
                </div>
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/geradoras')} 
                variant="outline"
                className="btn-outline h-10 lg:h-12 justify-start text-left p-3 lg:p-4"
              >
                <Zap className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm lg:text-base truncate">Geradoras</div>
                  <div className="text-xs text-gray-500">Gerenciar usinas</div>
                </div>
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/rateio')} 
                variant="outline"
                className="btn-outline h-10 lg:h-12 justify-start text-left p-3 lg:p-4"
              >
                <Activity className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm lg:text-base truncate">Rateio</div>
                  <div className="text-xs text-gray-500">Distribuir créditos</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="card-modern p-4 lg:p-6">
            <div className="mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Resumo Financeiro</h3>
              <p className="text-sm lg:text-base text-gray-600">Visão geral dos valores e pagamentos</p>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center min-w-0">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <FileText className="w-4 lg:w-5 h-4 lg:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm lg:text-base truncate">Total de Faturas</div>
                    <div className="text-xs lg:text-sm text-gray-600">Todas as faturas do sistema</div>
                  </div>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-gray-900 flex-shrink-0">{stats?.totalFaturas || 0}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center min-w-0">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-green-50 rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm lg:text-base truncate">Valor Total</div>
                    <div className="text-xs lg:text-sm text-gray-600">Receita total gerada</div>
                  </div>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-green-600 flex-shrink-0">
                  R$ {stats?.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center min-w-0">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-green-50 rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm lg:text-base truncate">Faturas Pagas</div>
                    <div className="text-xs lg:text-sm text-gray-600">Pagamentos confirmados</div>
                  </div>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-green-600 flex-shrink-0">{stats?.faturasPagas || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
