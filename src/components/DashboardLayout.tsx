
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User } from 'lucide-react';
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - Responsividade extrema */}
          <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
            <div className="flex items-center justify-between h-11 xs:h-12 sm:h-14 lg:h-16 px-2 xs:px-3 sm:px-4 lg:px-6">
              <div className="flex items-center space-x-1.5 xs:space-x-2 min-w-0">
                {/* Mobile Menu Button - Only visible on mobile */}
                <SidebarTrigger className="lg:hidden mr-1 xs:mr-2 p-1 xs:p-1.5 h-7 w-7 xs:h-8 xs:w-8" />
                
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 solar-gradient rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Sun className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <h1 className="text-sm xs:text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">
                  Solar<span className="solar-text-gradient">Control</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 lg:space-x-4 flex-shrink-0">
                {/* User info - Melhor responsividade */}
                <div className="hidden xs:flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 lg:space-x-3 bg-white/80 backdrop-blur-sm px-1.5 xs:px-2 sm:px-3 lg:px-4 py-1 xs:py-1 lg:py-2 rounded-lg xs:rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-md xs:rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-xs lg:text-sm max-w-12 xs:max-w-16 sm:max-w-20 lg:max-w-none truncate">
                    {getUserDisplayName()}
                  </span>
                </div>
                
                {/* Logout button - Touch-friendly */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-0.5 xs:space-x-1 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-xs sm:text-sm px-1.5 xs:px-2 sm:px-3 lg:px-4 h-7 xs:h-8 sm:h-9 lg:h-10 min-w-0"
                >
                  <LogOut className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content - Padding otimizado */}
          <main className="flex-1 p-2 xs:p-3 sm:p-4 lg:p-8 min-w-0 overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
