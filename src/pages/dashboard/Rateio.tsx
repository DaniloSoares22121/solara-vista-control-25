
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calculator, Users, Zap } from 'lucide-react';
import { useRateio } from '@/hooks/useRateio';
import RateioForm from '@/components/forms/RateioForm';
import { RateioFormData, RateioData } from '@/types/rateio';

const Rateio = () => {
  const { rateios, isLoading, error, createRateio } = useRateio();
  const [showForm, setShowForm] = useState(false);

  const handleCreateRateio = async (formData: RateioFormData) => {
    // Convert form data to RateioData format
    const rateioData: Omit<RateioData, 'id'> = {
      month: formData.date.month.toString().padStart(2, '0'),
      year: formData.date.year.toString(),
      status: 'pending',
      totalAmount: 0, // Will be calculated later
      subscribers: [], // Will be populated based on subscriberId
      generatorId: formData.generatorId,
      type: formData.type,
      date: formData.date,
      expectedGeneration: formData.expectedGeneration,
    };

    const result = await createRateio(rateioData);
    if (result.success) {
      setShowForm(false);
    }
  };

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Rateio</h1>
              <p className="text-gray-600">Crie um novo rateio de energia</p>
            </div>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
            >
              Voltar para Lista
            </Button>
          </div>
          
          <RateioForm 
            onSubmit={handleCreateRateio}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rateio de Energia</h1>
            <p className="text-gray-600">Gerencie a distribuição de energia entre assinantes</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Novo Rateio</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Rateios</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rateios.length}</div>
              <p className="text-xs text-muted-foreground">
                Rateios processados este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Aguardando integração com assinantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energia Distribuída</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 kWh</div>
              <p className="text-xs text-muted-foreground">
                Total distribuído este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Carregando rateios...</div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">{error}</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Lista de Rateios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rateios.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum rateio cadastrado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comece criando seu primeiro rateio de energia.
                  </p>
                  <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Criar Primeiro Rateio</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rateios.map((rateio) => (
                    <div key={rateio.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Rateio {rateio.month}/{rateio.year}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Status: {rateio.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {rateio.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {rateio.subscribers.length} assinantes
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Rateio;
