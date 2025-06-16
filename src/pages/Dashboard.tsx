
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Users, FileText, TrendingUp, Activity, AlertTriangle, CheckCircle, Clock, ArrowUpRight, Eye, Plus, BarChart3, DollarSign } from 'lucide-react';
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

  const complianceRate = stats?.faturasPagas && stats?.faturasEmitidas 
    ? Math.round((stats.faturasPagas / stats.faturasEmitidas) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-800 bg-clip-text text-transparent">
            Bem-vindo(a), {userDisplayName}!
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Visão geral do seu negócio e principais indicadores de performance.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/geradoras/nova')} size="lg" className="flex items-center gap-3 px-8">
          <Plus className="w-5 h-5" />
          Nova Geradora
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <Card className="group hover:scale-105 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Assinantes Ativos
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalAssinantes || 0}</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium">
                +12% este mês
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Geradoras Ativas
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalGeradoras || 0}</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-medium">
                100% operacionais
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Faturas Emitidas
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900">{stats?.faturasEmitidas || 0}</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-medium">
                {stats?.faturasPendentes || 0} pendentes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Taxa de Pagamento
                </CardTitle>
                <div className="text-3xl font-bold text-emerald-600">{complianceRate}%</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-medium">
                Excelente performance
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Action Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-600" />
                Ações Rápidas
              </CardTitle>
              <Badge className="bg-emerald-100 text-emerald-700">
                8 disponíveis
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={() => navigate('/dashboard/assinantes')} variant="outline" size="lg" className="justify-start h-16 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="font-semibold">Gerenciar Assinantes</span>
            </Button>
            <Button onClick={() => navigate('/dashboard/fatura-unica')} variant="outline" size="lg" className="justify-start h-16 flex-col gap-2">
              <FileText className="w-6 h-6" />
              <span className="font-semibold">Emitir Fatura Única</span>
            </Button>
            <Button onClick={() => navigate('/dashboard/geradoras')} variant="outline" size="lg" className="justify-start h-16 flex-col gap-2">
              <Zap className="w-6 h-6" />
              <span className="font-semibold">Gerenciar Geradoras</span>
            </Button>
            <Button onClick={() => navigate('/dashboard/rateio')} variant="outline" size="lg" className="justify-start h-16 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span className="font-semibold">Realizar Rateio</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                Resumo Financeiro
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                Ver detalhes
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-gray-800 font-semibold">Total de Faturas</span>
                  <p className="text-sm text-gray-600">Este mês</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.totalFaturas || 0}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-gray-800 font-semibold">Valor Total</span>
                  <p className="text-sm text-gray-600">Faturamento</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                R$ {stats?.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-gray-800 font-semibold">Faturas Pagas</span>
                  <p className="text-sm text-gray-600">Confirmadas</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats?.faturasPagas || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
