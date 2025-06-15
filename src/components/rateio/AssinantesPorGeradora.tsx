
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Mock data - I'll replace this with real data fetching later
const mockGenerators = [
  { id: 'gen1', apelido: 'Geradora Solar 1', uc: '12345678', geracao: '15000 kWh' },
  { id: 'gen2', apelido: 'Fazenda Solar 2', uc: '87654321', geracao: '25000 kWh' },
];

const mockSubscribers: Record<string, any[]> = {
  gen1: [
    { id: 'sub1', nome: 'Maria da Silva', uc: '10203040', consumo: '500 kWh', credito: '150 kWh', tipo: 'Percentual: 10%', ultimaFatura: '05/2025' },
    { id: 'sub2', nome: 'João Santos', uc: '50607080', consumo: '300 kWh', credito: '50 kWh', tipo: 'Prioridade: 1', ultimaFatura: '05/2025' },
  ],
  gen2: [
    { id: 'sub3', nome: 'Pedro Almeida', uc: '90807060', consumo: '1000 kWh', credito: '300 kWh', tipo: 'Percentual: 25%', ultimaFatura: '05/2025' },
  ],
};

const AssinantesPorGeradora = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | null>(null);

  const selectedGeradora = mockGenerators.find(g => g.id === selectedGeradoraId);
  const subscribers = selectedGeradoraId ? mockSubscribers[selectedGeradoraId] || [] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Assinantes por Geradora</CardTitle>
        <CardDescription>Selecione uma geradora para visualizar os assinantes vinculados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select onValueChange={setSelectedGeradoraId}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Selecione uma geradora..." />
            </SelectTrigger>
            <SelectContent>
              {mockGenerators.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.apelido}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
        </div>

        {selectedGeradora && (
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-lg">{selectedGeradora.apelido}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">UC da Geradora</p>
                <p>{selectedGeradora.uc}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Geração Estimada</p>
                <p>{selectedGeradora.geracao}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedGeradoraId && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Assinantes Vinculados</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>UC</TableHead>
                    <TableHead>Consumo Contratado</TableHead>
                    <TableHead>Crédito Acumulado</TableHead>
                    <TableHead>Rateio</TableHead>
                    <TableHead>Última Fatura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.length > 0 ? (
                    subscribers.map(sub => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.nome}</TableCell>
                        <TableCell>{sub.uc}</TableCell>
                        <TableCell>{sub.consumo}</TableCell>
                        <TableCell>{sub.credito}</TableCell>
                        <TableCell>{sub.tipo}</TableCell>
                        <TableCell>{sub.ultimaFatura}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhum assinante encontrado para esta geradora.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssinantesPorGeradora;
