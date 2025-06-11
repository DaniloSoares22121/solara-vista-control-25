
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { QrCode, Settings, MessageCircle, RefreshCw, CheckCircle, X, Smartphone, Send, Users, Cog } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import WhatsAppConfigModal from '@/components/WhatsAppConfigModal';
import WhatsAppTestMessage from '@/components/WhatsAppTestMessage';

const Whatsapp = () => {
  const [autoResponse, setAutoResponse] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState(
    "Olá {{nome}}, sua fatura no valor de R$ {{valor}} está disponível. Acesse: {{link}}"
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const {
    config,
    setConfig,
    connectionStatus,
    isConnecting,
    isCheckingStatus,
    isSendingMessage,
    connect,
    checkStatus,
    sendMessage
  } = useWhatsApp();

  const isConnected = connectionStatus?.state === 'open';

  // Verificar status ao carregar a página se já tiver configuração
  useEffect(() => {
    if (config.apiUrl && config.apiKey) {
      checkStatus();
    }
  }, [config.apiUrl, config.apiKey]);

  const handleTestMessage = async (number: string, text: string) => {
    return await sendMessage({ number, text });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Conexão WhatsApp</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Conecte e gerencie seu WhatsApp para envio de mensagens automáticas</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={`px-3 py-2 text-xs sm:text-sm ${isConnected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-2"
            >
              <Cog className="w-4 h-4" />
              Configurar API
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Mensagens Enviadas</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs sm:text-sm text-gray-500">Este mês</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Taxa de Entrega</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0%</div>
              <p className="text-xs sm:text-sm text-gray-500">Sucesso na entrega</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Contatos Ativos</CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs sm:text-sm text-gray-500">Números válidos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Connection Status */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="p-2 rounded-lg bg-green-50">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                Status da Conexão
              </CardTitle>
              <p className="text-gray-600 text-sm">Gerencie a conexão do seu dispositivo WhatsApp</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Status Atual:</span>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        <span className="text-green-600 font-semibold text-sm">Conectado</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        <span className="text-red-600 font-semibold text-sm">Desconectado</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p>• Configure a URL da API e chave de acesso</p>
                  <p>• Conecte e escaneie o QR Code com seu WhatsApp</p>
                  <p>• Mantenha o dispositivo conectado à internet</p>
                </div>
              </div>

              <div className="space-y-3">
                {!config.apiUrl || !config.apiKey ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-10 sm:h-12 text-sm"
                    size="lg"
                    onClick={() => setShowConfigModal(true)}
                  >
                    <Cog className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Configurar API
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg h-10 sm:h-12 text-sm"
                    size="lg"
                    onClick={connect}
                    disabled={isConnecting}
                  >
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isConnecting ? 'Conectando...' : 'Conectar WhatsApp'}
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  className="w-full border-gray-200 hover:bg-gray-50 h-10 sm:h-12 text-sm"
                  size="lg"
                  onClick={checkStatus}
                  disabled={isCheckingStatus || !config.apiUrl || !config.apiKey}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                  {isCheckingStatus ? 'Verificando...' : 'Verificar Status'}
                </Button>

                {isConnected && (
                  <Button 
                    variant="outline" 
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 h-10 sm:h-12 text-sm"
                    size="lg"
                    onClick={() => setShowTestModal(true)}
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Enviar Mensagem Teste
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Configuration */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    Configurações de Mensagem
                  </CardTitle>
                  <p className="text-gray-600 mt-1 text-sm">Configure as mensagens automáticas</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Mensagem Padrão para Faturas
                </label>
                <textarea
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg resize-none h-20 sm:h-24 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                />
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700 mb-2 font-medium">Variáveis disponíveis:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Badge variant="outline" className="justify-center text-xs">{`{{nome}}`}</Badge>
                    <Badge variant="outline" className="justify-center text-xs">{`{{valor}}`}</Badge>
                    <Badge variant="outline" className="justify-center text-xs">{`{{link}}`}</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Prévia da Mensagem</h4>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 text-xs sm:text-sm shadow-sm">
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

              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-10 sm:h-12 text-sm">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modais */}
      <WhatsAppConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        config={config}
        onSave={setConfig}
      />

      <WhatsAppTestMessage
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        onSend={handleTestMessage}
        isSending={isSendingMessage}
      />
    </DashboardLayout>
  );
};

export default Whatsapp;
