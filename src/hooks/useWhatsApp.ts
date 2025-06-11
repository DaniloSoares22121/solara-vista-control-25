
import { useState } from 'react';
import { whatsappService, WhatsAppConfig, WhatsAppMessage, WhatsAppConnectionStatus } from '@/services/whatsappService';
import { useToast } from '@/hooks/use-toast';

export const useWhatsApp = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus | null>(null);
  const [config, setConfig] = useState<WhatsAppConfig>({
    apiUrl: '',
    apiKey: '',
    instanceName: ''
  });
  const { toast } = useToast();

  const connect = async () => {
    if (!config.apiUrl || !config.apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, configure a URL da API e a chave de API primeiro",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const result = await whatsappService.connect(config);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Solicitação de conexão enviada. Escaneie o QR Code no seu WhatsApp.",
        });
        // Verificar status após tentar conectar
        await checkStatus();
      } else {
        toast({
          title: "Erro na Conexão",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const checkStatus = async () => {
    if (!config.apiUrl || !config.apiKey) {
      return;
    }

    setIsCheckingStatus(true);
    try {
      const status = await whatsappService.checkConnectionStatus(config);
      setConnectionStatus(status);
      
      if (status.state === 'open') {
        toast({
          title: "WhatsApp Conectado",
          description: "Sua instância do WhatsApp está conectada e pronta para uso!",
        });
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const sendMessage = async (message: WhatsAppMessage) => {
    if (!config.apiUrl || !config.apiKey) {
      toast({
        title: "Erro",
        description: "Configure a API primeiro",
        variant: "destructive",
      });
      return false;
    }

    if (connectionStatus?.state !== 'open') {
      toast({
        title: "Erro",
        description: "WhatsApp não está conectado",
        variant: "destructive",
      });
      return false;
    }

    setIsSendingMessage(true);
    try {
      const result = await whatsappService.sendMessage(config, message);
      
      if (result.success) {
        toast({
          title: "Mensagem Enviada",
          description: "Mensagem enviada com sucesso!",
        });
        return true;
      } else {
        toast({
          title: "Erro ao Enviar",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSendingMessage(false);
    }
  };

  return {
    config,
    setConfig,
    connectionStatus,
    isConnecting,
    isCheckingStatus,
    isSendingMessage,
    connect,
    checkStatus,
    sendMessage
  };
};
