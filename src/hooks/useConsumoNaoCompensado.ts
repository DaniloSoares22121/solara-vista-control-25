
import { useState } from 'react';
import { consumoNaoCompensadoService } from '@/services/consumoNaoCompensadoService';
import { toast } from 'sonner';

export const useConsumoNaoCompensado = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMonthReference, setPendingMonthReference] = useState<string>('');

  // Verificar se uma linha de consumo não compensado tem quantidade válida
  const hasValidConsumoNaoCompensado = (lines: any[]): boolean => {
    const consumoLine = lines.find(line => 
      line.description?.toLowerCase().includes('consumo não compensado') ||
      line.description?.toLowerCase().includes('consumo nao compensado')
    );

    return consumoLine && consumoLine.quantity > 0;
  };

  // Obter ou solicitar o valor de consumo não compensado
  const getConsumoNaoCompensadoValue = async (
    lines: any[], 
    monthReference: string
  ): Promise<number> => {
    // Primeiro, verifica se já existe na fatura
    const consumoLine = lines.find(line => 
      line.description?.toLowerCase().includes('consumo não compensado') ||
      line.description?.toLowerCase().includes('consumo nao compensado')
    );

    if (consumoLine && consumoLine.quantity > 0) {
      console.log(`✅ Consumo não compensado encontrado na fatura: ${consumoLine.quantity} kWh`);
      return consumoLine.quantity;
    }

    // Se não encontrou na fatura, verifica se já tem salvo para este mês
    const savedValue = consumoNaoCompensadoService.getValueForMonth(monthReference);
    if (savedValue !== null) {
      console.log(`📋 Usando valor salvo para ${monthReference}: ${savedValue} kWh`);
      return savedValue;
    }

    // Se não tem salvo, solicita ao usuário
    console.log(`❓ Solicitando valor ao usuário para ${monthReference}`);
    return new Promise((resolve) => {
      setPendingMonthReference(monthReference);
      setIsModalOpen(true);
      
      // Aguardar o usuário inserir o valor
      const checkForValue = () => {
        const newValue = consumoNaoCompensadoService.getValueForMonth(monthReference);
        if (newValue !== null) {
          resolve(newValue);
        } else {
          setTimeout(checkForValue, 100);
        }
      };
      
      setTimeout(checkForValue, 100);
    });
  };

  // Salvar valor inserido pelo usuário
  const saveConsumoValue = async (value: number): Promise<void> => {
    if (!pendingMonthReference) {
      throw new Error('Nenhuma referência de mês pendente');
    }

    try {
      consumoNaoCompensadoService.saveValueForMonth(pendingMonthReference, value);
      toast.success(`Valor salvo para ${pendingMonthReference}: ${value} kWh`);
      setIsModalOpen(false);
      setPendingMonthReference('');
    } catch (error) {
      console.error('Erro ao salvar valor:', error);
      toast.error('Erro ao salvar valor. Tente novamente.');
      throw error;
    }
  };

  // Fechar modal
  const closeModal = (): void => {
    setIsModalOpen(false);
    setPendingMonthReference('');
  };

  // Atualizar linha de consumo não compensado nos dados
  const updateConsumoNaoCompensadoInLines = (lines: any[], value: number): any[] => {
    return lines.map(line => {
      if (line.description?.toLowerCase().includes('consumo não compensado') ||
          line.description?.toLowerCase().includes('consumo nao compensado')) {
        return {
          ...line,
          quantity: value
        };
      }
      return line;
    });
  };

  return {
    isModalOpen,
    pendingMonthReference,
    hasValidConsumoNaoCompensado,
    getConsumoNaoCompensadoValue,
    saveConsumoValue,
    closeModal,
    updateConsumoNaoCompensadoInLines
  };
};
