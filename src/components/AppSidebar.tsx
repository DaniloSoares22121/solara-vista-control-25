
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
      className="border-r-0 shadow-2xl" 
      collapsible="icon"
    >
      <div className="h-full solar-gradient">
        <SidebarContent className="bg-transparent">
          {/* Header com logo e botão de toggle */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Menu className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">SolarControl</h2>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu de navegação */}
          <SidebarGroup className="py-6 bg-transparent">
            {!isCollapsed && (
              <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-white/80 uppercase tracking-wider bg-transparent">
                Navegação
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="bg-transparent">
              <SidebarMenu className="px-3 space-y-2 bg-transparent">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="bg-transparent">
                    <SidebarMenuButton asChild className="bg-transparent">
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group border ${
                            isActive 
                              ? 'bg-white/20 text-white shadow-lg border-white/30 backdrop-blur-sm' 
                              : 'text-white/90 hover:bg-white/10 hover:text-white border-transparent hover:border-white/20 backdrop-blur-sm'
                          } ${isCollapsed ? 'justify-center' : ''}`
                        }
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
