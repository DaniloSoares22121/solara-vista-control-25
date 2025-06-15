
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calculator, Download, ArrowRight, Sparkles } from 'lucide-react';
import { useRateio } from '@/hooks/useRateio';
import RateioForm from '@/components/forms/RateioForm';
import RateioStats from '@/components/rateio/RateioStats';
import RateioFilters from '@/components/rateio/RateioFilters';
import RateioList from '@/components/rateio/RateioList';
import { RateioFormData } from '@/types/rateio';

const Rateio = () => {
  const { rateios, isLoading, error, createRateio } = useRateio();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const handleCreateRateio = async (formData: RateioFormData) => {
    const result = await createRateio(formData);
    if (result.success) {
      setShowForm(false);
    }
  };

  const filteredRateios = rateios.filter(rateio => {
    const matchesSearch = rateio.dataRateio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rateio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showForm) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-green-600" />
              Novo Rateio de Energia
            </h1>
            <p className="text-gray-600 mt-1">Configure a distribuição inteligente de energia entre os assinantes</p>
          </div>
          <Button 
            onClick={() => setShowForm(false)} 
            variant="outline" 
            className="px-6 hover:bg-gray-50 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar para Lista
          </Button>
        </div>
        
        <RateioForm 
          onSubmit={handleCreateRateio}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl mr-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            Rateio de Energia
          </h1>
          <p className="text-lg text-gray-600">Distribua energia de forma inteligente e otimizada</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 px-6 hover:bg-gray-50 transition-all duration-300">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button 
            onClick={() => setShowForm(true)} 
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Rateio</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <RateioStats rateios={rateios} isLoading={isLoading} />

      {/* Filtros */}
      <RateioFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Lista de Rateios */}
      <RateioList
        rateios={rateios}
        filteredRateios={filteredRateios}
        isLoading={isLoading}
        error={error}
        onNewRateio={() => setShowForm(true)}
      />
    </div>
  );
};

export default Rateio;
