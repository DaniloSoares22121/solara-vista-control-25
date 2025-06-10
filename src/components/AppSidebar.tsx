
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
  Menu,
  Sparkles
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
      className="border-0 shadow-2xl" 
      collapsible="icon"
    >
      <div className="h-full bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-8 right-6 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-4 w-28 h-28 bg-teal-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-2 w-12 h-12 bg-cyan-300/25 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <SidebarContent className="bg-transparent relative z-10 py-6">
          {/* Modern Header with enhanced design */}
          <div className="px-6 mb-10">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-4 group">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-105 transition-all duration-300">
                      <Sparkles className="w-7 h-7 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text">
                      SolarControl
                    </h2>
                    <p className="text-emerald-100/90 text-sm font-semibold tracking-wide">
                      Gestão Inteligente
                    </p>
                  </div>
                </div>
              )}
              
              <button
                onClick={toggleSidebar}
                className="group relative p-3 rounded-2xl bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white transition-all duration-300 border border-white/30 hover:border-white/50 hover:scale-110 shadow-xl hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 relative z-10" />
                ) : (
                  <ChevronLeft className="w-5 h-5 relative z-10" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Navigation Section */}
          <SidebarGroup className="px-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="px-4 py-3 text-xs font-bold text-emerald-100/95 uppercase tracking-widest mb-6 flex items-center group">
                <div className="w-2 h-6 bg-gradient-to-b from-emerald-300 to-teal-300 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300"></div>
                <span className="bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">
                  Navegação Principal
                </span>
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {menuItems.map((item, index) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => 
                          `group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm ${
                            isActive 
                              ? 'bg-white/25 text-white shadow-2xl border border-white/50 scale-[1.02] shadow-emerald-500/30' 
                              : 'text-emerald-50/90 hover:bg-white/15 hover:text-white border border-transparent hover:border-white/30 hover:scale-[1.01] hover:shadow-xl'
                          } ${isCollapsed ? 'justify-center px-4' : ''}`
                        }
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Enhanced icon with backdrop */}
                        <div className={`relative flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                          isCollapsed 
                            ? 'bg-white/20 backdrop-blur-md' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}>
                          <item.icon className="w-5 h-5" />
                          {/* Icon glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        </div>
                        
                        {!isCollapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-semibold text-sm tracking-wide truncate">
                              {item.title}
                            </span>
                            
                            {/* Modern indicator */}
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse"></div>
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-300 transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced hover effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/5 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-300 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full"></div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Enhanced Footer Status */}
          <div className="mt-auto px-6 pb-2">
            {!isCollapsed ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-5 h-5 bg-emerald-300 rounded-full animate-pulse shadow-lg shadow-emerald-300/50"></div>
                    <div className="absolute inset-0 w-5 h-5 bg-emerald-300 rounded-full animate-ping opacity-40"></div>
                    <div className="absolute inset-0 w-5 h-5 bg-white/30 rounded-full animate-pulse delay-1000"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-sm font-bold tracking-wide">Sistema Online</p>
                    <p className="text-emerald-100/90 text-xs font-medium">
                      Todos os serviços operacionais
                    </p>
                  </div>
                </div>
                
                {/* Status bar */}
                <div className="mt-4 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center group">
                <div className="relative p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:scale-110 transition-all duration-300">
                  <div className="w-4 h-4 bg-emerald-300 rounded-full animate-pulse shadow-lg shadow-emerald-300/50"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-emerald-300 rounded-full animate-ping opacity-30 m-3"></div>
                </div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
