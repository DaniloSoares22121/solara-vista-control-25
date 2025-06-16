
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
  Activity
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
    <Sidebar className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-none shadow-2xl" collapsible="icon">
      <div className="h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <SidebarContent className="bg-transparent flex flex-col h-full">
          {/* Header redesenhado */}
          <div className={`flex items-center p-4 lg:p-6 border-b border-slate-700/50 flex-shrink-0 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    SolarControl
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">v2.0</p>
                </div>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0 touch-manipulation"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu de navegação melhorado */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <SidebarGroup className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-slate-400 px-3 py-3 text-xs font-semibold uppercase tracking-wider mb-4 opacity-80">
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
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
                            `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-slate-300 group touch-manipulation relative overflow-hidden ${
                              isActive 
                                ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-white shadow-lg border border-green-500/30' 
                                : 'hover:bg-slate-700/30 hover:text-white'
                            } ${isCollapsed ? 'justify-center' : ''}`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {/* Indicador visual ativo */}
                              {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-r"></div>
                              )}
                              
                              <item.icon className={`flex-shrink-0 w-5 h-5 transition-transform duration-300 ${
                                isActive ? 'scale-110' : 'group-hover:scale-105'
                              }`} />
                              
                              {/* No mobile sempre mostra o texto quando aberto */}
                              <span className="font-medium text-sm truncate lg:hidden">
                                {item.title}
                              </span>
                              
                              {/* Desktop: mostra/esconde baseado no estado colapsado */}
                              {!isCollapsed && (
                                <span className="font-medium text-sm truncate hidden lg:block">
                                  {item.title}
                                </span>
                              )}
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
          
          {/* Footer redesenhado */}
          <div className="flex-shrink-0 p-4 lg:p-6">
            {!isCollapsed ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm animate-pulse"></div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold">Sistema Online</p>
                    <p className="text-slate-400 text-xs opacity-80 truncate">Todos os serviços ativos</p>
                  </div>
                  <Activity className="w-4 h-4 text-green-400 flex-shrink-0" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-4 h-4 bg-green-400 rounded-full shadow-sm animate-pulse"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
