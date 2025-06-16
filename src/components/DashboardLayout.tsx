import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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

  const getUserDisplayName = () => {
    if (currentUser?.user_metadata?.full_name) {
      return currentUser.user_metadata.full_name;
    }
    return currentUser?.email || 'Usuário';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        
        {/* Container principal - flexível para ocupar todo o espaço restante */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
          {/* Header - ocupa toda a largura disponível */}
          <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40 w-full">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-3 min-w-0">
                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <SidebarTrigger className="p-2 h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Menu className="w-5 h-5 text-white" />
                  </SidebarTrigger>
                </div>
                
                <div className="w-10 h-10 solar-gradient rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Solar<span className="solar-text-gradient">Control</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                {/* User info */}
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white/80 backdrop-blur-sm px-2 sm:px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                    {getUserDisplayName()}
                  </span>
                </div>
                
                {/* Logout button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content - ocupa todo o espaço disponível */}
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
