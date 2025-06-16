
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  FileText, 
  FileCheck, 
  Receipt, 
  UserCheck, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Upload,
  Spline,
  Activity,
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
  { title: 'Assinantes', url: '/dashboard/assinantes', icon: Users },
  { title: 'Geradoras', url: '/dashboard/geradoras', icon: Zap },
  { title: 'Rateio de Créditos', url: '/dashboard/rateio', icon: Spline },
  { title: 'Fatura única', url: '/dashboard/fatura-unica', icon: FileText },
  { title: 'Fatura Manual', url: '/dashboard/fatura-manual', icon: Upload },
  { title: 'Faturas em Validação', url: '/dashboard/fatura-validacao', icon: FileCheck },
  { title: 'Faturas Emitidas', url: '/dashboard/faturas-emitidas', icon: Receipt },
  { title: 'Representantes', url: '/dashboard/representantes', icon: UserCheck },
  { title: 'WhatsApp', url: '/dashboard/whatsapp', icon: MessageCircle },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-none shadow-2xl relative overflow-hidden" collapsible="icon">
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-900/10 to-emerald-800/20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-2xl"></div>
        
        <SidebarContent className="bg-transparent flex flex-col h-full relative z-10">
          {/* Header premium */}
          <div className={`flex items-center p-6 border-b border-emerald-500/20 flex-shrink-0 relative ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    <Sun className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/30 to-green-600/30 rounded-2xl blur-lg opacity-75"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      SolarControl
                    </span>
                  </h2>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <p className="text-xs text-emerald-300/90 font-semibold">Premium v2.0</p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-3 rounded-2xl bg-slate-700/50 backdrop-blur-sm hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-300 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 flex-shrink-0 touch-manipulation group border border-emerald-500/20 hover:border-emerald-400/30"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Menu de navegação premium */}
          <div className="flex-1 p-6 overflow-y-auto">
            <SidebarGroup className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-emerald-300/70 px-4 py-4 text-xs font-bold uppercase tracking-wider mb-6 opacity-90 relative">
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        size="default"
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) => 
                            `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 text-slate-300 group touch-manipulation relative overflow-hidden backdrop-blur-sm border ${
                              isActive 
                                ? 'bg-gradient-to-r from-emerald-600/30 via-emerald-500/20 to-green-600/30 text-white shadow-xl shadow-emerald-500/30 border-emerald-400/40 scale-105' 
                                : 'hover:bg-emerald-700/10 hover:text-emerald-200 border-transparent hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-102'
                            } ${isCollapsed ? 'justify-center' : ''}`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {/* Glow effect para item ativo */}
                              {isActive && (
                                <>
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-emerald-500 to-green-600 rounded-r-full shadow-lg shadow-emerald-400/50"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl"></div>
                                </>
                              )}
                              
                              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                                isActive 
                                  ? 'bg-gradient-to-br from-emerald-500/20 to-green-600/20 shadow-lg' 
                                  : 'group-hover:bg-emerald-600/10'
                              }`}>
                                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                                  isActive ? 'text-emerald-300 scale-110' : 'group-hover:text-emerald-400 group-hover:scale-105'
                                }`} />
                              </div>
                              
                              {/* Texto responsivo */}
                              {!isCollapsed && (
                                <span className={`font-semibold text-sm truncate transition-all duration-300 ${
                                  isActive ? 'text-emerald-100' : 'group-hover:text-emerald-200'
                                }`}>
                                  {item.title}
                                </span>
                              )}

                              {/* Mobile sempre mostra */}
                              <span className="font-semibold text-sm truncate lg:hidden">
                                {item.title}
                              </span>
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          
          {/* Footer premium */}
          <div className="flex-shrink-0 p-6">
            {!isCollapsed ? (
              <div className="bg-gradient-to-br from-emerald-800/30 via-slate-800/50 to-green-800/30 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-600/5 rounded-2xl"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg animate-pulse"></div>
                    <div className="absolute inset-0 bg-emerald-400/50 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-emerald-100 text-sm font-bold">Sistema Online</p>
                    <p className="text-emerald-300/80 text-xs font-medium truncate">Todos os serviços ativos</p>
                  </div>
                  <Activity className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute inset-0 bg-emerald-400/50 rounded-full blur-sm animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
