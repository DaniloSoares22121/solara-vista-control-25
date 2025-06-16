
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Zap, Upload } from 'lucide-react';
import ManualInvoiceSection from '@/components/faturas/ManualInvoiceSection';

const FaturaUnica = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Faturas</h1>
            <p className="text-gray-600 mt-2">
              Gere faturas únicas ou processe faturas manuais para seus assinantes
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturas Processadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energia Total</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 kWh</div>
              <p className="text-xs text-muted-foreground">Consumo processado</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div>
              <p className="text-xs text-muted-foreground">Valor processado</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different invoice types */}
        <Tabs defaultValue="fatura-unica" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fatura-unica" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Fatura Única
            </TabsTrigger>
            <TabsTrigger value="fatura-manual" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Fatura Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fatura-unica" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Fatura Única
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Funcionalidade em Desenvolvimento
                  </h3>
                  <p className="text-gray-600">
                    A geração de fatura única estará disponível em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fatura-manual" className="mt-6">
            <ManualInvoiceSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FaturaUnica;
