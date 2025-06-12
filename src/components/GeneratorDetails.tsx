
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  TrendingUp,
  Power,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratorDetailsProps {
  generator: any;
  isOpen: boolean;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const GeneratorDetails = ({ generator, isOpen, onEdit, onDelete, onClose }: GeneratorDetailsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  if (!generator) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] max-h-none p-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            
            <DialogHeader className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-bold text-white mb-3">
                      {generator.owner?.name || 'Geradora'}
                    </DialogTitle>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge 
                        className={`${
                          generator.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        } shadow-sm`}
                      >
                        {generator.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                        {generator.owner?.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                      <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                        {generator.concessionaria}
                      </Badge>
                    </div>
                    <p className="text-green-100 mt-2 text-lg">
                      {generator.plants?.length || 0} usinas cadastradas
                    </p>
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
            </DialogHeader>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="p-8 pb-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">{generator.plants?.length || 0}</p>
                    <p className="text-green-600 text-sm font-medium">Usinas</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{totalCapacity.toFixed(1)} kWp</p>
                    <p className="text-blue-600 text-sm font-medium">Capacidade Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-700">{totalGeneration.toFixed(0)} kWh</p>
                    <p className="text-yellow-600 text-sm font-medium">Geração Mensal</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Power className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-700">
                      {generator.status === 'active' ? '100%' : '0%'}
                    </p>
                    <p className="text-purple-600 text-sm font-medium">Status Operacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="px-8 pb-8 bg-gray-50">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Lado Esquerdo - Dados do Proprietário */}
              <div className="space-y-8">
                {/* Dados do Proprietário */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-blue-800 font-bold">Dados do Proprietário</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tipo</label>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.owner?.type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          {generator.owner?.type === 'fisica' ? 'CPF' : 'CNPJ'}
                        </label>
                        <p className="text-lg font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.owner?.cpfCnpj}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Nome</label>
                      <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {generator.owner?.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Telefone
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.owner?.telefone || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.owner?.email || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    {generator.owner?.address && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Endereço
                          </label>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-base text-gray-900 leading-relaxed">
                              {formatAddress(generator.owner.address)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Dados de Pagamento */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b border-green-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-green-800 font-bold">Dados de Pagamento</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Banco</label>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.payment_data?.banco || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Agência</label>
                        <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.payment_data?.agencia || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Conta</label>
                        <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.payment_data?.conta || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">PIX</label>
                        <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.payment_data?.pix || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lado Direito - Usinas e Sistema */}
              <div className="space-y-8">
                {/* Usinas */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-b border-yellow-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-yellow-800 font-bold">Usinas ({generator.plants?.length || 0})</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {generator.plants?.map((plant: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{plant.apelido}</h4>
                            <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">
                              UC: {plant.uc}
                            </Badge>
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

                {/* Login Distribuidora */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b border-gray-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-bold">Login da Distribuidora</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">UC</label>
                        <p className="text-lg font-mono font-bold text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          {generator.distributor_login?.uc || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">CPF/CNPJ</label>
                        <p className="text-lg font-mono text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.distributor_login?.cpfCnpj || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    {generator.distributor_login?.dataNascimento && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Data de Nascimento
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {new Date(generator.distributor_login.dataNascimento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Administrador */}
                {generator.administrator && (
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 border-b border-purple-100/50 rounded-t-xl">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-purple-800 font-bold">Dados do Administrador</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Nome</label>
                          <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {generator.administrator.nome}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">CPF</label>
                          <p className="text-lg font-mono text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {generator.administrator.cpf}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Data de Nascimento
                          </label>
                          <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {new Date(generator.administrator.dataNascimento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telefone
                          </label>
                          <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {generator.administrator.telefone}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {generator.administrator.email}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Endereço
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-base text-gray-900 leading-relaxed">
                            {formatAddress(generator.administrator.address)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir a geradora "{generator.owner?.name}"? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratorDetails;
