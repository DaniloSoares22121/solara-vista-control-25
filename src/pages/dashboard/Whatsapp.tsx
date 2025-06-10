
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { QrCode, Settings, MessageCircle, RefreshCw, X, Smartphone, Send, Users } from 'lucide-react';
import { useState } from 'react';

const Whatsapp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [autoResponse, setAutoResponse] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState(
    "Olá {{nome}}, sua fatura no valor de R$ {{valor}} está disponível. Acesse: {{link}}"
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Conexão WhatsApp</h1>
                <p className="text-gray-600 text-lg">Conecte e gerencie seu WhatsApp para envio de mensagens automáticas</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={`px-3 py-2 ${isConnected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Mensagens Enviadas</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Send className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-500">Este mês</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Taxa de Entrega</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">0%</div>
              <p className="text-sm text-gray-500">Sucesso na entrega</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Contatos Ativos</CardTitle>
                <div className="p-2 rounded-lg bg-purple-50">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-500">Números válidos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Status */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-green-50">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                Status da Conexão
              </CardTitle>
              <p className="text-gray-600">Gerencie a conexão do seu dispositivo WhatsApp</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Status Atual:</span>
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-semibold">Desconectado</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Escaneie o QR Code com seu WhatsApp</p>
                  <p>• Mantenha o dispositivo conectado à internet</p>
                  <p>• Não faça logout do WhatsApp Web</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg h-12"
                  size="lg"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Conectar WhatsApp
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full border-gray-200 hover:bg-gray-50 h-12"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Verificar Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Message Configuration */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>
                    Configurações de Mensagem
                  </CardTitle>
                  <p className="text-gray-600 mt-1">Configure as mensagens automáticas</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Mensagem Padrão para Faturas
                </label>
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none h-24 text-sm focus:border-blue-500 focus:ring-blue-500"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                />
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700 mb-2 font-medium">Variáveis disponíveis:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Badge variant="outline" className="justify-center">{`{{nome}}`}</Badge>
                    <Badge variant="outline" className="justify-center">{`{{valor}}`}</Badge>
                    <Badge variant="outline" className="justify-center">{`{{link}}`}</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Prévia da Mensagem</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm shadow-sm">
                  Olá <span className="font-medium text-blue-600">João Silva</span>, sua fatura no valor de 
                  <span className="font-medium text-green-600"> R$ 157,90</span> está disponível. 
                  Acesse: <span className="text-blue-600 underline">https://energypay.com.br/fatura/123456</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">Resposta Automática</label>
                  <p className="text-xs text-gray-500">Enviar confirmação automaticamente</p>
                </div>
                <Switch
                  checked={autoResponse}
                  onCheckedChange={setAutoResponse}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-12">
                <Settings className="w-5 h-5 mr-2" />
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
