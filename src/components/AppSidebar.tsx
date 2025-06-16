
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
  Home,
  TrendingUp
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
  { 
    title: 'Dashboard', 
    url: '/dashboard', 
    icon: LayoutDashboard,
    description: 'Visão geral'
  },
  { 
    title: 'Assinantes', 
    url: '/dashboard/assinantes', 
    icon: Users,
    description: 'Gerenciar clientes'
  },
  { 
    title: 'Geradoras', 
    url: '/dashboard/geradoras', 
    icon: Zap,
    description: 'Usinas solares'
  },
  { 
    title: 'Rateio de Créditos', 
    url: '/dashboard/rateio', 
    icon: Spline,
    description: 'Distribuição de energia'
  },
  { 
    title: 'Fatura Única', 
    url: '/dashboard/fatura-unica', 
    icon: FileText,
    description: 'Emissão automática'
  },
  { 
    title: 'Fatura Manual', 
    url: '/dashboard/fatura-manual', 
    icon: Upload,
    description: 'Upload manual'
  },
  { 
    title: 'Faturas em Validação', 
    url: '/dashboard/fatura-validacao', 
    icon: FileCheck,
    description: 'Aguardando aprovação'
  },
  { 
    title: 'Faturas Emitidas', 
    url: '/dashboard/faturas-emitidas', 
    icon: Receipt,
    description: 'Histórico completo'
  },
  { 
    title: 'Representantes', 
    url: '/dashboard/representantes', 
    icon: UserCheck,
    description: 'Equipe comercial'
  },
  { 
    title: 'WhatsApp', 
    url: '/dashboard/whatsapp', 
    icon: MessageCircle,
    description: 'Comunicação'
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r border-gray-200/60" collapsible="icon">
      <div className="h-screen bg-white/95 backdrop-blur-sm flex flex-col shadow-xl">
        <SidebarContent className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className={`flex items-center p-6 border-b border-gray-100 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    SolarControl
                  </h2>
                  <p className="text-xs text-emerald-600 font-semibold">SISTEMA DE GESTÃO</p>
                </div>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-emerald-600 transition-all duration-200 shadow-sm"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Enhanced Menu */}
          <div className="flex-1 p-4">
            <SidebarGroup>
              {!isCollapsed && (
                <SidebarGroupLabel className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-6 px-2">
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
                            `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                              isActive 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md'
                            } ${isCollapsed ? 'justify-center' : ''}`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon className={`w-5 h-5 ${
                                isActive ? 'text-white' : 'text-gray-500 group-hover:text-emerald-600'
                              } transition-colors duration-200`} />
                              
                              {!isCollapsed && (
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">
                                    {item.title}
                                  </span>
                                  <span className={`text-xs ${
                                    isActive ? 'text-emerald-100' : 'text-gray-500 group-hover:text-emerald-600'
                                  } transition-colors duration-200`}>
                                    {item.description}
                                  </span>
                                </div>
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
          
          {/* Enhanced Footer */}
          <div className="p-4 border-t border-gray-100">
            {!isCollapsed ? (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-emerald-700 text-sm font-semibold">Sistema Online</p>
                    <p className="text-emerald-600 text-xs">Todos os serviços ativos</p>
                  </div>
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">Performance: 99.9%</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
