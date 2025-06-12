
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Trash2, 
  User, 
  MapPin, 
  Zap, 
  CreditCard, 
  FileText,
  Building,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { GeneratorFormData } from '@/types/generator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface GeneratorDetailsProps {
  generator: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const GeneratorDetails = ({ generator, onEdit, onDelete, onClose }: GeneratorDetailsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(generator.id);
    setShowDeleteDialog(false);
    onClose();
    toast({
      title: "Geradora excluída",
      description: "A geradora foi excluída com sucesso.",
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Não informado';
    return `${address.endereco}, ${address.numero}${address.complemento ? `, ${address.complemento}` : ''} - ${address.bairro}, ${address.cidade}/${address.estado} - ${address.cep}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="max-w-6xl w-[90vw] h-[90vh] max-h-none p-0 overflow-hidden">
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {generator.owner?.name || 'Geradora'}
            </h2>
            <p className="text-gray-600">{generator.concessionaria}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-6">
          <Badge className={generator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {generator.status === 'active' ? 'Ativa' : 'Inativa'}
          </Badge>
          <span className="text-sm text-gray-500">
            Criada em {new Date(generator.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Dados do Proprietário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-blue-600" />
                Dados do Proprietário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.owner?.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {generator.owner?.type === 'fisica' ? 'CPF' : 'CNPJ'}
                  </label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{generator.owner?.cpfCnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.owner?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Número Parceiro Negócio</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.owner?.numeroParceiroNegocio}</p>
                </div>
                {generator.owner?.type === 'juridica' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Razão Social</label>
                      <p className="text-sm text-gray-900 mt-1">{generator.owner?.razaoSocial}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome Fantasia</label>
                      <p className="text-sm text-gray-900 mt-1">{generator.owner?.nomeFantasia}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefone
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{generator.owner?.telefone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{generator.owner?.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Endereço
                </label>
                <p className="text-sm text-gray-900 mt-1">{formatAddress(generator.owner?.address)}</p>
              </div>
              {generator.owner?.observacoes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Observações</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.owner.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Administrador */}
          {generator.administrator && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="w-5 h-5 text-purple-600" />
                  Dados do Administrador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.administrator.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">CPF</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{generator.administrator.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Data de Nascimento
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(generator.administrator.dataNascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefone
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{generator.administrator.telefone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{generator.administrator.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Endereço
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{formatAddress(generator.administrator.address)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usinas */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                Usinas ({generator.plants?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generator.plants?.map((plant: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{plant.apelido}</h4>
                      <Badge variant="outline">UC: {plant.uc}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-600">Tipo</label>
                        <p className="text-gray-900 capitalize">{plant.tipoUsina}geradora</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-600">Modalidade</label>
                        <p className="text-gray-900">{plant.modalidadeCompensacao}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-600">Potência Total</label>
                        <p className="text-gray-900 font-medium">{plant.potenciaTotalUsina} kWp</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-600">Módulos</label>
                        <p className="text-gray-900">{plant.quantidadeModulos}x {plant.marcaModulo} ({plant.potenciaModulo}W)</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-600">Geração Projetada</label>
                        <p className="text-gray-900">{plant.geracaoProjetada} kWh/mês</p>
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-gray-600">Endereço</label>
                      <p className="text-gray-900 text-sm">{formatAddress(plant.address)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dados de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                Dados de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Banco</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.payment_data?.banco}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Agência</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.payment_data?.agencia}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Conta</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.payment_data?.conta}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">PIX</label>
                  <p className="text-sm text-gray-900 mt-1">{generator.payment_data?.pix || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Distribuidora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-gray-600" />
                Login da Distribuidora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">UC</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{generator.distributor_login?.uc}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">CPF/CNPJ</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{generator.distributor_login?.cpfCnpj}</p>
                </div>
                {generator.distributor_login?.dataNascimento && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                    <p className="text-sm text-gray-900 mt-1">{new Date(generator.distributor_login.dataNascimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a geradora "{generator.owner?.name}"? 
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GeneratorDetails;
