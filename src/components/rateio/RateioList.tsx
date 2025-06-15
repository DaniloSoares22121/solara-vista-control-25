
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Activity, AlertTriangle, Calculator, Plus } from 'lucide-react';
import { RateioData } from '@/types/rateio';
import RateioItem from './RateioItem';

interface RateioListProps {
  rateios: RateioData[];
  filteredRateios: RateioData[];
  isLoading: boolean;
  error: string | null;
  onNewRateio: () => void;
}

const RateioList: React.FC<RateioListProps> = ({ 
  rateios, 
  filteredRateios, 
  isLoading, 
  error, 
  onNewRateio 
}) => {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Activity className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando Rateios</h3>
            <p className="text-gray-600">Aguarde enquanto buscamos os dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg border-red-200">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-2">Erro ao Carregar</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredRateios.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-6">
              <Calculator className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {rateios.length === 0 ? 'Nenhum rateio cadastrado' : 'Nenhum rateio encontrado'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {rateios.length === 0 
                ? 'Comece criando seu primeiro rateio de energia para distribuir energia entre os assinantes.'
                : 'Tente ajustar os filtros para encontrar o que procura.'
              }
            </p>
            {rateios.length === 0 && (
              <Button 
                onClick={onNewRateio} 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeiro Rateio
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl">Lista de Rateios</span>
          </div>
          <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
            {filteredRateios.length} resultado(s)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {filteredRateios.map((rateio, index) => (
            <RateioItem key={rateio.id} rateio={rateio} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RateioList;
