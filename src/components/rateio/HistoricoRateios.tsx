
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const HistoricoRateios = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Rateios</CardTitle>
        <CardDescription>Consulte os rateios já realizados para cada geradora.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-8">Em breve, você poderá consultar o histórico de rateios aqui.</p>
      </CardContent>
    </Card>
  );
};

export default HistoricoRateios;
