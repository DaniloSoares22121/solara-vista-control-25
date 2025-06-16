
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Plus, History, Calculator, Zap, TrendingUp } from "lucide-react";
import AssinantesPorGeradora from '@/components/rateio/AssinantesPorGeradora';
import CadastrarRateio from '@/components/rateio/CadastrarRateio';
import HistoricoRateios from '@/components/rateio/HistoricoRateios';

const Rateio = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-blue-50/30 to-purple-50/20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header Principal */}
        <div className="text-center space-y-6 py-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20 scale-110"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-2xl">
              <Calculator className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Rateio de Créditos
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sistema inteligente para distribuição equitativa de créditos energéticos entre geradoras e assinantes
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Distribuição Automática</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Gestão Eficiente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
          <Tabs defaultValue="assinantes" className="w-full relative">
            <div className="p-8 border-b border-gray-100/80">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-gray-200/50">
                <TabsTrigger 
                  value="assinantes" 
                  className="flex items-center gap-4 h-16 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 data-[state=active]:bg-white/20 flex items-center justify-center transition-colors">
                      <Users className="h-5 w-5 text-blue-600 data-[state=active]:text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Consultar</div>
                      <div className="text-xs opacity-80">Assinantes por Geradora</div>
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="cadastrar" 
                  className="flex items-center gap-4 h-16 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 data-[state=active]:bg-white/20 flex items-center justify-center transition-colors">
                      <Plus className="h-5 w-5 text-green-600 data-[state=active]:text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Cadastrar</div>
                      <div className="text-xs opacity-80">Novo Rateio</div>
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="historico" 
                  className="flex items-center gap-4 h-16 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 data-[state=active]:bg-white/20 flex items-center justify-center transition-colors">
                      <History className="h-5 w-5 text-purple-600 data-[state=active]:text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Histórico</div>
                      <div className="text-xs opacity-80">Rateios Anteriores</div>
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="assinantes" className="mt-0 space-y-6">
                <AssinantesPorGeradora />
              </TabsContent>
              
              <TabsContent value="cadastrar" className="mt-0 space-y-6">
                <CadastrarRateio />
              </TabsContent>
              
              <TabsContent value="historico" className="mt-0 space-y-6">
                <HistoricoRateios />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Rateio;
