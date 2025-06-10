
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
      className="border-0" 
      collapsible="icon"
    >
      <div className="h-full bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 relative overflow-hidden">
        {/* Modern glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-black/10 backdrop-blur-[2px]"></div>
        
        {/* Floating orbs for modern effect */}
        <div className="absolute top-10 right-8 w-24 h-24 bg-gradient-to-br from-emerald-300/20 to-green-300/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 left-6 w-32 h-32 bg-gradient-to-tl from-teal-300/15 to-emerald-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-4 w-16 h-16 bg-green-300/20 rounded-full blur-lg"></div>
        
        <SidebarContent className="bg-transparent relative z-10 py-6">
          {/* Modern Header */}
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Menu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">SolarControl</h2>
                    <p className="text-emerald-100/80 text-sm font-medium">Gestão Inteligente</p>
                  </div>
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className="p-3 rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Section */}
          <SidebarGroup className="px-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 py-2 text-xs font-bold text-emerald-100/90 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-1 h-4 bg-emerald-300 rounded-full mr-3"></div>
                Navegação
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => 
                          `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                            isActive 
                              ? 'bg-white/25 text-white shadow-xl border border-white/40 backdrop-blur-md scale-[1.02] shadow-emerald-500/20' 
                              : 'text-emerald-50/90 hover:bg-white/15 hover:text-white border border-transparent hover:border-white/20 hover:scale-[1.01] hover:shadow-lg backdrop-blur-sm'
                          } ${isCollapsed ? 'justify-center px-4' : ''}`
                        }
                        title={isCollapsed ? item.title : undefined}
                      >
                        {/* Icon with modern styling */}
                        <div className={`flex-shrink-0 p-2 rounded-xl ${isCollapsed ? 'bg-white/20' : ''} transition-all duration-300`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        
                        {!isCollapsed && (
                          <>
                            <span className="font-semibold text-sm tracking-wide truncate">
                              {item.title}
                            </span>
                            {/* Modern animated indicator */}
                            <div className="absolute right-3 w-2 h-2 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </>
                        )}
                        
                        {/* Active state glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Modern Footer Status */}
          <div className="mt-auto px-6">
            {!isCollapsed && (
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-emerald-300 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Sistema Online</p>
                    <p className="text-emerald-100/80 text-xs">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-300 rounded-full animate-ping opacity-30"></div>
                </div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
