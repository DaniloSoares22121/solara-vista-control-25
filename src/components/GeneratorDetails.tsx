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
  Calendar,
  X,
  TrendingUp,
  Power,
  Activity
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

  const totalCapacity = generator.plants?.reduce((total: number, plant: any) => {
    return total + (plant.potenciaTotalUsina || 0);
  }, 0) || 0;

  const totalGeneration = generator.plants?.reduce((total: number, plant: any) => {
    return total + (plant.geracaoProjetada || 0);
  }, 0) || 0;

  return (
    <div className="w-[90vw] max-w-6xl h-[90vh] max-h-none p-0 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header Aprimorado */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {generator.owner?.name || 'Geradora'}
                </h2>
                <p className="text-green-100 text-lg">{generator.concessionaria}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onEdit} 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button 
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Usinas</p>
                  <p className="text-2xl font-bold text-white">{generator.plants?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Capacidade</p>
                  <p className="text-2xl font-bold text-white">{totalCapacity.toFixed(1)} kWp</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Geração</p>
                  <p className="text-2xl font-bold text-white">{totalGeneration.toFixed(0)} kWh/mês</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Power className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Status</p>
                  <Badge className={`${generator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} mt-1`}>
                    {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Dados do Proprietário */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                  <User className="w-5 h-5" />
                  Dados do Proprietário
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{generator.owner?.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {generator.owner?.type === 'fisica' ? 'CPF' : 'CNPJ'}
                    </label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{generator.owner?.cpfCnpj}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Nome</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{generator.owner?.name}</p>
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
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
                    <Building className="w-5 h-5" />
                    Dados do Administrador
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome</label>
                      <p className="text-sm text-gray-900 mt-1 font-medium">{generator.administrator.nome}</p>
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
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </label>
                      <p className="text-sm text-gray-900 mt-1">{generator.administrator.email}</p>
                    </div>
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
            <Card className="lg:col-span-2 xl:col-span-1 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b">
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
                  <Zap className="w-5 h-5" />
                  Usinas ({generator.plants?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {generator.plants?.map((plant: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{plant.apelido}</h4>
                        <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">UC: {plant.uc}</Badge>
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
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                  <CreditCard className="w-5 h-5" />
                  Dados de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Banco</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{generator.payment_data?.banco}</p>
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
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <FileText className="w-5 h-5" />
                  Login da Distribuidora
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                      <p className="text-sm text-gray-900 mt-1">{new Date(generator.distributor_login.dataNascimento).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
