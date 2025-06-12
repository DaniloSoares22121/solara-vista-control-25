
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header - Responsivo */}
          <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
            <div className="flex items-center justify-between h-14 lg:h-16 px-3 lg:px-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 solar-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Sun className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                  Solar<span className="solar-text-gradient">Control</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* User info - Escondido em telas muito pequenas */}
                <div className="hidden sm:flex items-center space-x-2 lg:space-x-3 bg-white/80 backdrop-blur-sm px-2 lg:px-4 py-1 lg:py-2 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs lg:text-sm max-w-24 lg:max-w-none truncate">
                    {getUserDisplayName()}
                  </span>
                </div>
                
                {/* Logout button - Responsivo */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 lg:space-x-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-xs lg:text-sm px-2 lg:px-4"
                >
                  <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content - Responsivo */}
          <main className="flex-1 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
