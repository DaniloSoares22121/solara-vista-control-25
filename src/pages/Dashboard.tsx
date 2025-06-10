
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 solar-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Solar<span className="solar-text-gradient">Control</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">
                    {currentUser?.displayName || currentUser?.email}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5">
                  <div className="absolute top-10 left-10 w-32 h-32 solar-gradient rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 solar-gradient rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 solar-gradient rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 mb-8 solar-gradient rounded-3xl shadow-2xl">
                    <Sun className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Bem-vindo ao SolarControl!
                  </h2>
                  <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Sua plataforma de gestão de energia solar está pronta para revolucionar 
                    o gerenciamento dos seus projetos.
                  </p>
                  <div className="inline-flex items-center space-x-2 text-green-600 font-semibold">
                    <span>Selecione uma opção no menu lateral para começar</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
