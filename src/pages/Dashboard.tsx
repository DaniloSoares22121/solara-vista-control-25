
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <SidebarTrigger />
                <div className="w-10 h-10 solar-gradient rounded-lg flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Solar<span className="solar-text-gradient">Control</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">
                    {currentUser?.displayName || currentUser?.email}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex w-full">
          <AppSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 solar-gradient rounded-2xl">
                  <Sun className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Bem-vindo ao SolarControl!
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Sua plataforma de gestão de energia solar está pronta.
                </p>
                <p className="text-gray-500">
                  Selecione uma opção no menu lateral para começar.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
