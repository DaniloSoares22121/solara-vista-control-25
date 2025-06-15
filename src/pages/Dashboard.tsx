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
  const { stats, loading, error } = useDashboardStats();

  const userDisplayName = currentUser?.user_metadata?.full_name || currentUser?.email || 'Usuário';

  if (loading) {
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo(a), {userDisplayName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral do seu negócio e principais indicadores.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/geradoras/nova')} className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nova Geradora
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Assinantes Ativos
              </CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.activeSubscribers}</div>
            <p className="text-sm text-gray-600 mt-1">
              {stats?.totalSubscribers} assinantes no total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Energia Distribuída
              </CardTitle>
              <Zap className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.distributedEnergy} kWh</div>
            <p className="text-sm text-gray-600 mt-1">
              Média de consumo por assinante
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Faturas Emitidas
              </CardTitle>
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.issuedInvoices}</div>
            <p className="text-sm text-gray-600 mt-1">
              {stats?.pendingInvoices} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Adimplência
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.complianceRate}%</div>
            <p className="text-sm text-gray-600 mt-1">
              Em dia com os pagamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => navigate('/dashboard/assinantes')} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Assinantes
            </Button>
            <Button onClick={() => navigate('/dashboard/fatura-unica')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Emitir Fatura Unica
            </Button>
            <Button onClick={() => navigate('/dashboard/geradoras')} variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Gerenciar Geradoras
            </Button>
            <Button onClick={() => navigate('/dashboard/rateio')} variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Realizar Rateio
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-800">Configurar método de pagamento</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-gray-800">Validar faturas pendentes</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-800">Acompanhar emissão de novas faturas</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Atividade Recente
            </CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-800">Novo assinante cadastrado</span>
            </div>
            <span className="text-gray-500 text-sm">Há 2 horas</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-800">Fatura #12345 emitida</span>
            </div>
            <span className="text-gray-500 text-sm">Há 1 dia</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-800">Rateio de energia realizado</span>
            </div>
            <span className="text-gray-500 text-sm">Há 3 dias</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
