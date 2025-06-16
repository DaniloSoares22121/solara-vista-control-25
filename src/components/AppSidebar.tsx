
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
    <Sidebar className="border-r border-gray-200" collapsible="icon">
      <div className="h-screen bg-white flex flex-col">
        <SidebarContent className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center p-4 border-b border-gray-100 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">SolarControl</h2>
                  <p className="text-xs text-gray-500">Sistema de Gestão</p>
                </div>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Menu */}
          <div className="flex-1 p-4">
            <SidebarGroup>
              {!isCollapsed && (
                <SidebarGroupLabel className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-4">
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
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
                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            } ${isCollapsed ? 'justify-center' : ''}`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon className={`w-5 h-5 ${
                                isActive ? 'text-emerald-600' : ''
                              }`} />
                              
                              {!isCollapsed && (
                                <span className="font-medium text-sm">
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
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            {!isCollapsed ? (
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="text-emerald-700 text-sm font-medium">Sistema Online</p>
                    <p className="text-emerald-600 text-xs">Todos os serviços ativos</p>
                  </div>
                  <Activity className="w-4 h-4 text-emerald-500 ml-auto" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
