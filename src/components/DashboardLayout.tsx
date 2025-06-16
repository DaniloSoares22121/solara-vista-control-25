
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User, Menu, Bell, Settings } from 'lucide-react';
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
      <div className="min-h-screen w-full flex bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-green-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-100/20 to-green-200/10 rounded-full blur-3xl"></div>
        </div>
        
        <AppSidebar />
        
        {/* Container principal */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Header premium */}
          <header className="bg-white/70 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 z-50 w-full shadow-sm shadow-emerald-100/20">
            <div className="flex items-center justify-between h-20 px-8">
              <div className="flex items-center space-x-6 min-w-0">
                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <SidebarTrigger className="p-3 h-12 w-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 border-0 rounded-2xl transition-all duration-500 shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/40 transform hover:scale-105 hover:-translate-y-0.5">
                    <Menu className="w-6 h-6 text-white" />
                  </SidebarTrigger>
                </div>
                
                {/* Logo premium */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <Sun className="w-7 h-7 text-white relative z-10 drop-shadow-sm" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-2xl blur-lg opacity-75"></div>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-3xl font-bold">
                      <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 bg-clip-text text-transparent">
                        Solar
                      </span>
                      <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        Control
                      </span>
                    </h1>
                    <p className="text-sm text-emerald-600/70 font-semibold">Sistema de Gestão Avançado</p>
                  </div>
                </div>
              </div>
              
              {/* User section premium */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-12 w-12 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-emerald-50/80 border border-emerald-100/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <Bell className="w-5 h-5 text-emerald-700" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white shadow-sm"></div>
                </Button>

                {/* Settings */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-emerald-50/80 border border-emerald-100/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <Settings className="w-5 h-5 text-emerald-700" />
                </Button>
                
                {/* User info premium */}
                <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white/90">
                  <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <User className="w-5 h-5 text-white relative z-10" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-base font-bold text-slate-800 truncate max-w-[180px]">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-sm text-emerald-600/80 font-medium">Administrador</p>
                  </div>
                </div>
                
                {/* Logout button premium */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-3 border-emerald-200/50 hover:border-emerald-300 bg-white/50 hover:bg-emerald-50/80 backdrop-blur-sm transition-all duration-300 rounded-2xl px-6 py-3 h-12 shadow-sm hover:shadow-lg hover:scale-105 group"
                >
                  <LogOut className="w-5 h-5 text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                  <span className="hidden sm:inline font-semibold text-emerald-700 group-hover:text-emerald-800">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 w-full overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
