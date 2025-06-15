
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CadastrarRateio = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Rateio</CardTitle>
        <CardDescription>Funcionalidade para cadastrar um novo rateio por porcentagem ou prioridade.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-8">Em breve, você poderá cadastrar novos rateios aqui.</p>
      </CardContent>
    </Card>
  );
};

export default CadastrarRateio;
