
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Geradoras from "./pages/dashboard/Geradoras";
import Assinantes from "./pages/dashboard/Assinantes";
import Rateio from "./pages/dashboard/Rateio";
import Representantes from "./pages/dashboard/Representantes";
import FaturaUnica from "./pages/dashboard/FaturaUnica";
import FaturaValidacao from "./pages/dashboard/FaturaValidacao";
import FaturasEmitidas from "./pages/dashboard/FaturasEmitidas";
import Whatsapp from "./pages/dashboard/Whatsapp";
import NotFound from "./pages/NotFound";
import FaturaLayout from "./pages/FaturaLayout";
import FaturaManual from '@/pages/dashboard/FaturaManual';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/fatura-layout" element={<FaturaLayout />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/geradoras" element={
              <ProtectedRoute>
                <Geradoras />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/assinantes" element={
              <ProtectedRoute>
                <Assinantes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/rateio" element={
              <ProtectedRoute>
                <Rateio />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/representantes" element={
              <ProtectedRoute>
                <Representantes />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fatura-unica" element={
              <ProtectedRoute>
                <FaturaUnica />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fatura-validacao" element={
              <ProtectedRoute>
                <FaturaValidacao />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/faturas-emitidas" element={
              <ProtectedRoute>
                <FaturasEmitidas />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/whatsapp" element={
              <ProtectedRoute>
                <Whatsapp />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fatura-manual" element={
              <ProtectedRoute>
                <FaturaManual />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
