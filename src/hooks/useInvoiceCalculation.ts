
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalculationData {
  payload: any;
  discount: number;
  subscriberId?: string;
  consumerUnit: string;
}

export const useInvoiceCalculation = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [pendingCalculation, setPendingCalculation] = useState<CalculationData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Preparar dados para envio
  const prepareCalculationData = (
    extractedData: any, 
    discount: number, 
    subscriberId?: string
  ): CalculationData => {
    const payload = {
      legal_name: extractedData.legal_name,
      compensated_energy: extractedData.compensated_energy,
      tarifa_com_tributos: extractedData.tarifa_com_tributos,
      consumer_unit: extractedData.consumer_unit,
      address: extractedData.address,
      month_reference: extractedData.month_reference,
      expiration_date: extractedData.expiration_date,
      invoice_value: extractedData.invoice_value,
      lines: extractedData.lines,
      historical_lines: extractedData.historical_lines,
      extra: {
        distributor: extractedData.distributor,
        invoice_type: extractedData.invoice_type,
        instalation_code: extractedData.instalation_code,
        cnpj_cpf: extractedData.cnpj_cpf,
        zip_code: extractedData.zip_code,
        connection: extractedData.connection,
        classe: extractedData.classe,
        start_date: extractedData.start_date,
        end_date: extractedData.end_date,
        next_reading: extractedData.next_reading,
        total_days: extractedData.total_days,
        emission_date: extractedData.emission_date,
        processing_date: extractedData.processing_date,
        accumulated_balance: extractedData.accumulated_balance,
        energy_expire_next_cycle: extractedData.energy_expire_next_cycle,
        value_compensated_energy: extractedData.value_compensated_energy,
        value_invoice_consume: extractedData.value_invoice_consume,
        invoice_consume: extractedData.invoice_consume,
        measured_energy: extractedData.measured_energy,
        measured_energy_ponta: extractedData.measured_energy_ponta,
        measured_energy_fora_ponta: extractedData.measured_energy_fora_ponta,
        compensated_energy_ponta: extractedData.compensated_energy_ponta,
        compensated_energy_fora_ponta: extractedData.compensated_energy_fora_ponta,
        tarifa_sem_tributos: extractedData.tarifa_sem_tributos,
        tarifa_compensacao: extractedData.tarifa_compensacao,
        injected_energy: extractedData.injected_energy,
        icms_base: extractedData.icms_base,
        icms_aliq: extractedData.icms_aliq,
        icms: extractedData.icms,
        pis_cofins_base: extractedData.pis_cofins_base,
        pis: extractedData.pis,
        pis_aliq: extractedData.pis_aliq,
        cofins: extractedData.cofins,
        cofins_aliq: extractedData.cofins_aliq,
        flags_values: extractedData.flags_values,
        debts: extractedData.debts,
        consume_ponta: extractedData.consume_ponta,
        consume_fora_ponta: extractedData.consume_fora_ponta,
        produced_energy: extractedData.produced_energy,
        address_partner: extractedData.address_partner,
        address_consumer_unit: extractedData.address_consumer_unit,
        status: extractedData.status
      }
    };

    return {
      payload,
      discount,
      subscriberId,
      consumerUnit: extractedData.consumer_unit
    };
  };

  // Mostrar modal de confirmação
  const showConfirmationModal = (calculationData: CalculationData): void => {
    console.log('📋 Preparando dados para confirmação:', calculationData);
    setPendingCalculation(calculationData);
    setIsConfirmationModalOpen(true);
  };

  // Enviar dados para API de cálculo
  const sendToCalculationAPI = async (): Promise<any> => {
    if (!pendingCalculation) {
      throw new Error('Nenhum dado pendente para cálculo');
    }

    setIsCalculating(true);
    
    try {
      console.log('🚀 Enviando dados para API de cálculo...');
      console.log('📦 Payload:', pendingCalculation.payload);
      console.log('💰 Desconto:', pendingCalculation.discount);
      
      const { data, error } = await supabase.functions.invoke('calculate-invoice', {
        body: {
          payload: pendingCalculation.payload,
          discount: pendingCalculation.discount
        }
      });

      if (error) {
        console.error('❌ Erro na API de cálculo:', error);
        throw error;
      }

      console.log('✅ Resposta da API:', data);
      setCalculationResult(data);
      toast.success('Cálculo realizado com sucesso!');
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao calcular fatura:', error);
      toast.error('Erro ao calcular fatura. Tente novamente.');
      throw error;
    } finally {
      setIsCalculating(false);
      setIsConfirmationModalOpen(false);
      setPendingCalculation(null);
    }
  };

  // Fechar modal de confirmação
  const closeConfirmationModal = (): void => {
    setIsConfirmationModalOpen(false);
    setPendingCalculation(null);
  };

  return {
    isConfirmationModalOpen,
    pendingCalculation,
    isCalculating,
    calculationResult,
    prepareCalculationData,
    showConfirmationModal,
    sendToCalculationAPI,
    closeConfirmationModal
  };
};
