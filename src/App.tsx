
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assinantes from "./pages/dashboard/Assinantes";
import NovaGeradora from "./pages/dashboard/NovaGeradora";
import Geradoras from "./pages/dashboard/Geradoras";
import Representantes from "./pages/dashboard/Representantes";
import FaturaUnica from "./pages/dashboard/FaturaUnica";
import FaturaManual from "./pages/dashboard/FaturaManual";
import FaturaValidacao from "./pages/dashboard/FaturaValidacao";
import FaturasEmitidas from "./pages/dashboard/FaturasEmitidas";
import Whatsapp from "./pages/dashboard/Whatsapp";
import NotFound from "./pages/NotFound";
import FaturaLayout from "./pages/FaturaLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Assinantes />} />
                <Route path="assinantes" element={<Assinantes />} />
                <Route path="nova-geradora" element={<NovaGeradora />} />
                <Route path="geradoras" element={<Geradoras />} />
                <Route path="representantes" element={<Representantes />} />
                <Route path="fatura-unica" element={<FaturaUnica />} />
                <Route path="fatura-manual" element={<FaturaManual />} />
                <Route path="fatura-validacao" element={<FaturaValidacao />} />
                <Route path="faturas-emitidas" element={<FaturasEmitidas />} />
                <Route path="whatsapp" element={<Whatsapp />} />
              </Route>
              <Route path="/fatura/:faturaId" element={<FaturaLayout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
