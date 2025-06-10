
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Whatsapp = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp</h1>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Send className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">3.247</div>
                  <div className="text-sm text-gray-600">Mensagens Enviadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">2.894</div>
                  <div className="text-sm text-gray-600">Entregues</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">231</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">122</div>
                  <div className="text-sm text-gray-600">Falhas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Envio de Mensagens em Massa</CardTitle>
            <CardDescription>Envie lembretes de fatura e atualizações para seus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Mensagem</label>
                  <select className="w-full mt-1 p-2 border rounded-lg">
                    <option>Lembrete de Fatura</option>
                    <option>Fatura Vencida</option>
                    <option>Confirmação de Pagamento</option>
                    <option>Atualização do Sistema</option>
                    <option>Mensagem Personalizada</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Destinatários</label>
                  <select className="w-full mt-1 p-2 border rounded-lg">
                    <option>Todos os Assinantes (1.247)</option>
                    <option>Apenas Faturas Pendentes (291)</option>
                    <option>Apenas Faturas Vencidas (47)</option>
                    <option>Lista Personalizada</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Agendar Envio</label>
                  <input type="datetime-local" className="w-full mt-1 p-2 border rounded-lg" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Prévia da Mensagem</label>
                  <div className="mt-1 p-4 border rounded-lg bg-green-50">
                    <div className="text-sm">
                      <p className="font-medium">🌞 SolarControl</p>
                      <p className="mt-2">Olá, João!</p>
                      <p className="mt-1">Sua fatura de energia solar no valor de R$ 385,50 vence em 3 dias (15/03/2024).</p>
                      <p className="mt-1">💰 Pague pelo PIX e receba 5% de desconto!</p>
                      <p className="mt-1">Dúvidas? Responda esta mensagem.</p>
                      <p className="mt-2 text-xs text-gray-500">Mensagem automática - SolarControl</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagens
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>Campanha: Lembretes de Março</span>
              </CardTitle>
              <CardDescription>Enviada em 10/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Destinatários</span>
                  <span className="font-medium">1.247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Entregues</span>
                  <span className="font-medium text-green-600">1.198 (96%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visualizadas</span>
                  <span className="font-medium text-blue-600">1.067 (89%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Respostas</span>
                  <span className="font-medium text-purple-600">23</span>
                </div>
                <div className="mt-3 p-2 bg-green-100 rounded">
                  <span className="text-sm text-green-800 font-medium">Campanha Finalizada</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-orange-600" />
                <span>Campanha: Faturas Vencidas</span>
              </CardTitle>
              <CardDescription>Enviada em 18/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Destinatários</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Entregues</span>
                  <span className="font-medium text-green-600">43 (91%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visualizadas</span>
                  <span className="font-medium text-blue-600">38 (88%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Respostas</span>
                  <span className="font-medium text-purple-600">12</span>
                </div>
                <div className="mt-3 p-2 bg-orange-100 rounded">
                  <span className="text-sm text-orange-800 font-medium">Em Andamento</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span>Campanha: Pagamentos Confirmados</span>
              </CardTitle>
              <CardDescription>Enviada em 20/03/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Destinatários</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Entregues</span>
                  <span className="font-medium text-green-600">152 (97%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visualizadas</span>
                  <span className="font-medium text-blue-600">134 (88%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Respostas</span>
                  <span className="font-medium text-purple-600">8</span>
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded">
                  <span className="text-sm text-blue-800 font-medium">Agendada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Templates de Mensagem</CardTitle>
            <CardDescription>Templates pré-configurados para diferentes situações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🔔 Lembrete de Vencimento</h4>
                  <p className="text-sm text-gray-600">Para faturas que vencem em 3 dias</p>
                  <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    "Sua fatura de R$ {valor} vence em 3 dias. Pague pelo PIX e ganhe desconto!"
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">⚠️ Fatura Vencida</h4>
                  <p className="text-sm text-gray-600">Para faturas em atraso</p>
                  <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    "Sua fatura de R$ {valor} está vencida. Regularize para manter seu desconto."
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">✅ Pagamento Confirmado</h4>
                  <p className="text-sm text-gray-600">Confirmação de recebimento</p>
                  <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    "Pagamento de R$ {valor} confirmado! Obrigado por estar conosco."
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📊 Relatório Mensal</h4>
                  <p className="text-sm text-gray-600">Resumo do consumo do mês</p>
                  <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    "Seu consumo em {mes}: {kwh} kWh. Economia de R$ {economia} com energia solar!"
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Whatsapp;
