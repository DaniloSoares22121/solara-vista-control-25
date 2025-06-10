
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { QrCode, Settings, MessageCircle, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

const Whatsapp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [autoResponse, setAutoResponse] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState(
    "Olá {{nome}}, sua fatura no valor de R$ {{valor}} está disponível. Acesse: {{link}}"
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conexão WhatsApp</h1>
          <p className="text-gray-600 mt-1">Conecte e gerencie seu WhatsApp para envio de mensagens automáticas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Status da Conexão
              </CardTitle>
              <p className="text-gray-600 text-sm">Status atual do seu WhatsApp</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 font-medium">Desconectado</span>
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Conectar WhatsApp
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Status
              </Button>
            </CardContent>
          </Card>

          {/* Message Configuration */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Configurações de Mensagem</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">Configure as mensagens automáticas</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem Padrão
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 text-sm"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use {`{{nome}}`}, {`{{valor}}`}, {`{{link}}`} como variáveis que serão substituídas automaticamente.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Visualização da Mensagem</h4>
                <div className="bg-white p-3 rounded-lg border text-sm">
                  Olá João Silva, sua fatura no valor de R$ R$ 157,90 está disponível. Acesse: 
                  https://energypay.com.br/fatura/123456
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Resposta automática</label>
                </div>
                <Switch
                  checked={autoResponse}
                  onCheckedChange={setAutoResponse}
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Whatsapp;
