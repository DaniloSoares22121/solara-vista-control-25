
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './components/ui/sidebar';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/DashboardLayout';
import Assinantes from './pages/dashboard/Assinantes';
import Geradoras from './pages/dashboard/Geradoras';
import NovaGeradora from './pages/dashboard/NovaGeradora';
import Rateio from './pages/dashboard/Rateio';
import FaturaUnica from './pages/dashboard/FaturaUnica';
import FaturaManual from './pages/dashboard/FaturaManual';
import FaturaValidacao from './pages/dashboard/FaturaValidacao';
import FaturasEmitidas from './pages/dashboard/FaturasEmitidas';
import Representantes from './pages/dashboard/Representantes';
import Whatsapp from './pages/dashboard/Whatsapp';
import FaturaLayout from './pages/FaturaLayout';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/fatura" element={<FaturaLayout />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="assinantes" element={<Assinantes />} />
                  <Route path="geradoras" element={<Geradoras />} />
                  <Route path="geradoras/nova" element={<NovaGeradora />} />
                  <Route path="rateio" element={<Rateio />} />
                  <Route path="fatura-unica" element={<FaturaUnica />} />
                  <Route path="fatura-manual" element={<FaturaManual />} />
                  <Route path="fatura-validacao" element={<FaturaValidacao />} />
                  <Route path="faturas-emitidas" element={<FaturasEmitidas />} />
                  <Route path="representantes" element={<Representantes />} />
                  <Route path="whatsapp" element={<Whatsapp />} />
                </Route>
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
