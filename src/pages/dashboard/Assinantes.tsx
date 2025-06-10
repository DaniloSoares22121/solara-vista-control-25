
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, User } from 'lucide-react';

const Assinantes = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assinantes por Unidade Consumidora</h1>
            <p className="text-gray-600 mt-1">Gerencie seus clientes de energia por UC</p>
          </div>
          
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Assinante
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar assinantes..."
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum assinante encontrado
            </h3>
            
            <p className="text-gray-500 mb-6 max-w-md">
              Tente ajustar sua busca ou adicione um novo assinante.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assinantes;
