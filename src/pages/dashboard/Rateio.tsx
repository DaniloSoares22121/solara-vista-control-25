
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Plus, History, Calculator } from "lucide-react";
import AssinantesPorGeradora from '@/components/rateio/AssinantesPorGeradora';
import CadastrarRateio from '@/components/rateio/CadastrarRateio';
import HistoricoRateios from '@/components/rateio/HistoricoRateios';

const Rateio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Principal */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Rateio de Créditos
            </h1>
            <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
              Gerencie e consulte a distribuição inteligente de créditos entre geradoras e assinantes
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <Tabs defaultValue="assinantes" className="w-full">
            <div className="p-6 border-b border-border/50">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 bg-muted/50 p-2 rounded-xl">
                <TabsTrigger 
                  value="assinantes" 
                  className="flex items-center gap-3 h-14 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Consultar</div>
                      <div className="text-xs text-muted-foreground">Assinantes por Geradora</div>
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="cadastrar" 
                  className="flex items-center gap-3 h-14 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Cadastrar</div>
                      <div className="text-xs text-muted-foreground">Novo Rateio</div>
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="historico" 
                  className="flex items-center gap-3 h-14 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <History className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Histórico</div>
                      <div className="text-xs text-muted-foreground">Rateios Anteriores</div>
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
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
