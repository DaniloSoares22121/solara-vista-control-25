
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileCheck, FileX } from 'lucide-react';

const FaturaValidacao = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faturas Pendentes de Validação</h1>
          <p className="text-gray-600 mt-1">Gerencie e valide as faturas capturadas do sistema</p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar faturas..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="pendentes">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendentes">Pendentes</SelectItem>
              <SelectItem value="validadas">Validadas</SelectItem>
              <SelectItem value="rejeitadas">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-700">Cliente</TableHead>
                  <TableHead className="font-medium text-gray-700">Nº Fatura</TableHead>
                  <TableHead className="font-medium text-gray-700">Referência</TableHead>
                  <TableHead className="font-medium text-gray-700">Valor</TableHead>
                  <TableHead className="font-medium text-gray-700">Data Captura</TableHead>
                  <TableHead className="font-medium text-gray-700">Status</TableHead>
                  <TableHead className="font-medium text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileX className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">Nenhuma fatura encontrada</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FaturaValidacao;
