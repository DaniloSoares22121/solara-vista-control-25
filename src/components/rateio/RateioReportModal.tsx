
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RateioHistoryItem } from '@/hooks/useRateio';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Users, Zap, TrendingUp, Download, FileText, Percent, Hash, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface RateioReportModalProps {
  rateio: RateioHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RateioReportModal: React.FC<RateioReportModalProps> = ({ rateio, isOpen, onClose }) => {
  if (!rateio) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'processed':
        return <Zap className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getTipoRateioColor = (tipo: string) => {
    return tipo === 'porcentagem' 
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const mockAssinantes = [
    { nome: 'DOUGLAS VICTOR SEGATTI DIAS', uc: '10007559826', valor: 100, tipo: rateio.tipo_rateio },
    { nome: 'Maria Silva Santos', uc: '10007559827', valor: 50, tipo: rateio.tipo_rateio },
    { nome: 'João Carlos Oliveira', uc: '10007559828', valor: 75, tipo: rateio.tipo_rateio },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-slate-50">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Relatório Detalhado do Rateio
              </span>
              <p className="text-sm text-slate-500 font-normal mt-1">
                Análise completa da distribuição de energia
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Header do Relatório redesenhado */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-slate-800 font-bold">
                    Rateio de {format(parseISO(rateio.data_rateio), 'dd/MM/yyyy', { locale: ptBR })}
                  </CardTitle>
                  <p className="text-slate-600 mt-2 font-medium">ID: {rateio.id.slice(0, 8)}...</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getTipoRateioColor(rateio.tipo_rateio)} font-semibold px-3 py-1.5`}>
                    {rateio.tipo_rateio === 'porcentagem' ? (
                      <><Percent className="h-3 w-3 mr-1.5" /> Por Porcentagem</>
                    ) : (
                      <><Hash className="h-3 w-3 mr-1.5" /> Por Prioridade</>
                    )}
                  </Badge>
                  <Badge className={`${getStatusColor(rateio.status)} font-semibold px-3 py-1.5`}>
                    {getStatusIcon(rateio.status)}
                    <span className="ml-1.5">
                      {rateio.status.charAt(0).toUpperCase() + rateio.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Data do Rateio</p>
                    <p className="font-bold text-slate-800 text-lg">{format(parseISO(rateio.data_rateio), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Distribuído</p>
                    <p className="font-bold text-emerald-700 text-lg">{rateio.total_distribuido.toLocaleString('pt-BR')} kWh</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Assinantes</p>
                    <p className="font-bold text-purple-700 text-lg">{mockAssinantes.length} participantes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Assinantes redesenhada */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="h-6 w-6 text-slate-600" />
                Distribuição por Assinante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssinantes.map((assinante, index) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{assinante.nome}</p>
                        <p className="text-slate-600 font-medium">UC: {assinante.uc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1.5">
                          {assinante.valor}{rateio.tipo_rateio === 'porcentagem' ? '%' : '°'}
                        </Badge>
                        <div className="text-xl font-bold text-emerald-600">
                          {rateio.tipo_rateio === 'porcentagem' 
                            ? Math.round((rateio.total_distribuido * assinante.valor) / 100).toLocaleString('pt-BR')
                            : '---'
                          } kWh
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro redesenhado */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-3 text-xl">
                <TrendingUp className="h-6 w-6" />
                Resumo da Distribuição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center p-6 bg-white/50 rounded-2xl border border-emerald-200">
                  <p className="text-sm text-emerald-700 mb-3 font-semibold">Energia Total Disponível</p>
                  <p className="text-3xl font-bold text-emerald-800">{rateio.total_distribuido.toLocaleString('pt-BR')} kWh</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-2xl border border-emerald-200">
                  <p className="text-sm text-emerald-700 mb-3 font-semibold">Valor Médio por Assinante</p>
                  <p className="text-3xl font-bold text-emerald-800">
                    {Math.round(rateio.total_distribuido / mockAssinantes.length).toLocaleString('pt-BR')} kWh
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações redesenhadas */}
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-slate-300 hover:bg-slate-50 font-semibold"
            >
              Fechar
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
              <Download className="h-5 w-5 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
