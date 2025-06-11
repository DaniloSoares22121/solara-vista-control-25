
import { supabase } from '@/integrations/supabase/client';

export interface WhatsAppConfig {
  apiUrl: string;
  apiKey: string;
  instanceName: string;
}

export interface WhatsAppMessage {
  number: string;
  text: string;
}

export interface WhatsAppConnectionStatus {
  state: 'open' | 'close' | 'connecting';
  instance: string;
}

class WhatsAppService {
  private async getConfig(): Promise<WhatsAppConfig | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Por enquanto, vamos usar valores padrão ou permitir que o usuário configure
      // Em uma implementação real, isso viria do banco de dados ou configurações do usuário
      return {
        apiUrl: '', // Será configurado pelo usuário
        apiKey: '', // Será configurado pelo usuário
        instanceName: user.id.slice(0, 8) // Usar parte do user ID como instance
      };
    } catch (error) {
      console.error('Erro ao obter configuração WhatsApp:', error);
      return null;
    }
  }

  async connect(config: WhatsAppConfig): Promise<{ success: boolean; qrCode?: string; error?: string }> {
    try {
      console.log('Conectando ao WhatsApp...', config);
      
      const response = await fetch(`${config.apiUrl}/instance/connect/${config.instanceName}`, {
        method: 'GET',
        headers: {
          'apikey': config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na conexão: ${response.status}`);
      }

      const data = await response.json();
      console.log('Resposta da conexão:', data);

      return {
        success: true,
        qrCode: data.qrcode || data.qr_code // Pode variar dependendo da API
      };
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async checkConnectionStatus(config: WhatsAppConfig): Promise<WhatsAppConnectionStatus> {
    try {
      console.log('Verificando status da conexão...');
      
      const response = await fetch(`${config.apiUrl}/instance/connectionState/${config.instanceName}`, {
        method: 'GET',
        headers: {
          'apikey': config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Status da conexão:', data);

      return {
        state: data.state === 'open' ? 'open' : 'close',
        instance: config.instanceName
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return {
        state: 'close',
        instance: config.instanceName
      };
    }
  }

  async sendMessage(config: WhatsAppConfig, message: WhatsAppMessage): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Enviando mensagem WhatsApp:', message);
      
      const response = await fetch(`${config.apiUrl}/message/sendText/${config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
        },
        body: JSON.stringify({
          number: message.number,
          text: message.text
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.status}`);
      }

      const data = await response.json();
      console.log('Mensagem enviada:', data);

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export const whatsappService = new WhatsAppService();
