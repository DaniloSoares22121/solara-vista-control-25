
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RateioFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

const RateioFilters: React.FC<RateioFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange
}) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <span>Filtros e Busca</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por período (MM/AAAA)..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-52 h-12 border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Pendente</span>
                  </div>
                </SelectItem>
                <SelectItem value="processed">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Processado</span>
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Concluído</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="w-full sm:w-52 h-12 border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="date">Data (Mais Recente)</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="energy">Energia Gerada</SelectItem>
                <SelectItem value="subscribers">Nº de Assinantes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateioFilters;
