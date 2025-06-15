
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssinantesPorGeradora from '@/components/rateio/AssinantesPorGeradora';
import CadastrarRateio from '@/components/rateio/CadastrarRateio';
import HistoricoRateios from '@/components/rateio/HistoricoRateios';

const Rateio = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Rateio de Créditos</h1>
        <p className="text-muted-foreground">Gerencie e consulte os rateios de créditos entre geradoras e assinantes.</p>
      </header>
      <Tabs defaultValue="assinantes" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:w-auto">
          <TabsTrigger value="assinantes">Assinantes por Geradora</TabsTrigger>
          <TabsTrigger value="cadastrar">Cadastrar Rateio</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Rateios</TabsTrigger>
        </TabsList>
        <TabsContent value="assinantes">
          <AssinantesPorGeradora />
        </TabsContent>
        <TabsContent value="cadastrar">
          <CadastrarRateio />
        </TabsContent>
        <TabsContent value="historico">
          <HistoricoRateios />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rateio;
