
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Users, 
  Calculator, 
  UserCheck, 
  FileText, 
  FileCheck, 
  Receipt, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Geradoras', url: '/dashboard/geradoras', icon: Zap },
  { title: 'Assinantes', url: '/dashboard/assinantes', icon: Users },
  { title: 'Rateio', url: '/dashboard/rateio', icon: Calculator },
  { title: 'Representantes', url: '/dashboard/representantes', icon: UserCheck },
  { title: 'Fatura única', url: '/dashboard/fatura-unica', icon: FileText },
  { title: 'Fatura em validação', url: '/dashboard/fatura-validacao', icon: FileCheck },
  { title: 'Faturas emitidas', url: '/dashboard/faturas-emitidas', icon: Receipt },
  { title: 'WhatsApp', url: '/dashboard/whatsapp', icon: MessageCircle },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      className="border-0 shadow-none" 
      collapsible="icon"
    >
      <div className="h-full bg-gradient-to-b from-green-600 via-green-700 to-green-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <SidebarContent className="bg-transparent relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 mb-2">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">SolarControl</h2>
                  <p className="text-green-100/70 text-xs">Gestão de Energia</p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <SidebarGroup className="py-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-green-100/80 uppercase tracking-widest mb-2">
                Navegação
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="px-3 space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => 
                          `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                            isActive 
                              ? 'bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-sm scale-[1.02]' 
                              : 'text-green-100/90 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20 hover:scale-[1.01]'
                          } ${isCollapsed ? 'justify-center px-3' : ''}`
                        }
                        title={isCollapsed ? item.title : undefined}
                      >
                        {/* Icon container */}
                        <div className={`flex-shrink-0 ${isCollapsed ? '' : 'relative z-10'}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        
                        {!isCollapsed && (
                          <>
                            <span className="font-medium text-sm relative z-10 truncate">
                              {item.title}
                            </span>
                            {/* Animated background for active state */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Footer */}
          <div className="mt-auto p-4">
            {!isCollapsed && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Sistema Online</p>
                    <p className="text-green-100/70 text-xs">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
