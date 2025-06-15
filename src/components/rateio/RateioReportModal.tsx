
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RateioHistoryItem } from '@/hooks/useRateio';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Users, Zap, TrendingUp, Download, FileText, Percent, Hash } from 'lucide-react';

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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Relatório Detalhado do Rateio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header do Relatório */}
          <Card className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">
                    Rateio de {format(parseISO(rateio.data_rateio), 'dd/MM/yyyy', { locale: ptBR })}
                  </CardTitle>
                  <p className="text-blue-700 mt-1">ID: {rateio.id.slice(0, 8)}...</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getTipoRateioColor(rateio.tipo_rateio)}>
                    {rateio.tipo_rateio === 'porcentagem' ? (
                      <><Percent className="h-3 w-3 mr-1" /> Por Porcentagem</>
                    ) : (
                      <><Hash className="h-3 w-3 mr-1" /> Por Prioridade</>
                    )}
                  </Badge>
                  <Badge className={getStatusColor(rateio.status)}>
                    {rateio.status.charAt(0).toUpperCase() + rateio.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data do Rateio</p>
                    <p className="font-semibold">{format(parseISO(rateio.data_rateio), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Distribuído</p>
                    <p className="font-semibold text-green-700">{rateio.total_distribuido.toLocaleString('pt-BR')} kWh</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assinantes</p>
                    <p className="font-semibold text-purple-700">{mockAssinantes.length} participantes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Assinantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribuição por Assinante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssinantes.map((assinante, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{assinante.nome}</p>
                        <p className="text-sm text-gray-600">UC: {assinante.uc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {assinante.valor}{rateio.tipo_rateio === 'porcentagem' ? '%' : '°'}
                        </Badge>
                        <div className="text-lg font-bold text-green-600">
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

          {/* Resumo Financeiro */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo da Distribuição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-green-700 mb-2">Energia Total Disponível</p>
                  <p className="text-2xl font-bold text-green-800">{rateio.total_distribuido.toLocaleString('pt-BR')} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-2">Valor Médio por Assinante</p>
                  <p className="text-2xl font-bold text-green-800">
                    {Math.round(rateio.total_distribuido / mockAssinantes.length).toLocaleString('pt-BR')} kWh
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
