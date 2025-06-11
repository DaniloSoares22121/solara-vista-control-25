
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubscriberFormData } from '@/types/subscriber';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Zap, 
  FileText, 
  Settings, 
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface SubscriberDetailsProps {
  subscriber: SubscriberFormData & { id: string };
  onEdit: (subscriber: SubscriberFormData & { id: string }) => void;
  onDelete: (id: string) => void;
}

const SubscriberDetails = ({ subscriber, onEdit, onDelete }: SubscriberDetailsProps) => {
  const formatAddress = (address: any) => {
    if (!address) return 'Endereço não informado';
    return `${address.endereco}, ${address.numero}${address.complemento ? `, ${address.complemento}` : ''} - ${address.bairro}, ${address.cidade}/${address.estado} - CEP: ${address.cep}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatModalidade = (modalidade: string) => {
    return modalidade === 'autoconsumo' ? 'Autoconsumo Remoto' : 'Geração Compartilhada';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {subscriber.subscriber.name}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Dados Básicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Dados do Assinante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome</label>
                    <p className="text-gray-900">{subscriber.subscriber.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo</label>
                    <Badge variant="outline">
                      {subscriber.subscriber.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CPF/CNPJ</label>
                    <p className="text-gray-900">{subscriber.subscriber.cpfCnpj}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Parceiro de Negócio</label>
                    <p className="text-gray-900">{subscriber.subscriber.numeroParceiroNegocio}</p>
                  </div>
                  {subscriber.subscriber.dataNascimento && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                      <p className="text-gray-900">{formatDate(subscriber.subscriber.dataNascimento)}</p>
                    </div>
                  )}
                  {subscriber.subscriber.estadoCivil && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado Civil</label>
                      <p className="text-gray-900">{subscriber.subscriber.estadoCivil}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contato
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Telefone:</span>
                      <p className="text-gray-900">{subscriber.subscriber.telefone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="text-gray-900">{subscriber.subscriber.email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço
                  </label>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {formatAddress(subscriber.subscriber.address)}
                  </p>
                </div>

                {subscriber.subscriber.observacoes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Observações</label>
                      <p className="text-gray-900 text-sm">{subscriber.subscriber.observacoes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Conta de Energia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5" />
                  Conta de Energia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">UC (Unidade Consumidora)</label>
                    <p className="text-gray-900 font-mono">{subscriber.energyAccount.originalAccount.uc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Parceiro UC</label>
                    <p className="text-gray-900">{subscriber.energyAccount.originalAccount.numeroParceiroUC}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Titular Original</label>
                    <p className="text-gray-900">{subscriber.energyAccount.originalAccount.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CPF/CNPJ Titular</label>
                    <p className="text-gray-900">{subscriber.energyAccount.originalAccount.cpfCnpj}</p>
                  </div>
                </div>

                {subscriber.energyAccount.realizarTrocaTitularidade && subscriber.energyAccount.newTitularity && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Nova Titularidade</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Novo Titular:</span>
                          <p className="text-gray-900">{subscriber.energyAccount.newTitularity.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Status:</span>
                          <Badge variant={subscriber.energyAccount.newTitularity.trocaConcluida ? "default" : "secondary"}>
                            {subscriber.energyAccount.newTitularity.trocaConcluida ? 'Concluída' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Plano Contratado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Plano Contratado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modalidade</label>
                    <Badge className="block w-fit">
                      {formatModalidade(subscriber.planContract.modalidadeCompensacao)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Adesão</label>
                    <p className="text-gray-900">{formatDate(subscriber.planContract.dataAdesao)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">kWh Contratado</label>
                    <p className="text-gray-900 font-semibold">{subscriber.planContract.kwhContratado.toLocaleString()} kWh/mês</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">kWh Vendedor</label>
                    <p className="text-gray-900">{subscriber.planContract.kwhVendedor.toLocaleString()} kWh/mês</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Faixa de Consumo</label>
                    <p className="text-gray-900">{subscriber.planContract.faixaConsumo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Desconto</label>
                    <p className="text-gray-900 font-semibold text-green-600">{subscriber.planContract.desconto}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fidelidade</label>
                    <Badge variant={subscriber.planContract.fidelidade === 'com' ? "default" : "secondary"}>
                      {subscriber.planContract.fidelidade === 'com' 
                        ? `Com fidelidade (${subscriber.planContract.anosFidelidade} ano${subscriber.planContract.anosFidelidade === '1' ? '' : 's'})`
                        : 'Sem fidelidade'
                      }
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes do Plano */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5" />
                  Detalhes do Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cliente paga PIS/COFINS:</span>
                    <Badge variant={subscriber.planDetails.clientePagaPisCofins ? "destructive" : "secondary"}>
                      {subscriber.planDetails.clientePagaPisCofins ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cliente paga Fio B:</span>
                    <Badge variant={subscriber.planDetails.clientePagaFioB ? "destructive" : "secondary"}>
                      {subscriber.planDetails.clientePagaFioB ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Adicionar valor distribuidora:</span>
                    <Badge variant={subscriber.planDetails.adicionarValorDistribuidora ? "default" : "secondary"}>
                      {subscriber.planDetails.adicionarValorDistribuidora ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assinante isento:</span>
                    <Badge variant={subscriber.planDetails.assinanteIsento ? "default" : "secondary"}>
                      {subscriber.planDetails.assinanteIsento ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Administrador (se existe) */}
            {subscriber.administrator && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Dados do Administrador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome</label>
                      <p className="text-gray-900">{subscriber.administrator.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">CPF</label>
                      <p className="text-gray-900">{subscriber.administrator.cpf}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                      <p className="text-gray-900">{formatDate(subscriber.administrator.dataNascimento)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Profissão</label>
                      <p className="text-gray-900">{subscriber.administrator.profissao}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Telefone</label>
                      <p className="text-gray-900">{subscriber.administrator.telefone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{subscriber.administrator.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => onEdit(subscriber)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => onDelete(subscriber.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriberDetails;
