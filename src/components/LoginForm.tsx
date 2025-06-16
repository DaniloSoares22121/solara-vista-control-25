
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already logged in
  useState(() => {
    if (currentUser) {
      console.log('🔐 [LOGIN] User already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao SolarControl.",
      });
      
      // Navigate to the intended destination
      console.log('🔐 [LOGIN] Login successful, redirecting to:', from);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("❌ [LOGIN] Erro no login:", error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto space-y-4 px-3 sm:px-0">
        {/* Header otimizado */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 solar-gradient rounded-xl shadow-lg mx-auto">
            <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Solar<span className="solar-text-gradient">Control</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Acesse sua plataforma de gestão
            </p>
          </div>
        </div>

        {/* Login Card otimizado */}
        <Card className="p-4 sm:p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 sm:h-12 text-sm border-2 border-gray-200 focus:border-green-500 transition-colors rounded-lg"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 sm:h-12 text-sm border-2 border-gray-200 focus:border-green-500 transition-colors rounded-lg"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-400" />
                <span className="text-gray-600 font-medium text-xs">Lembrar-me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors text-xs text-left"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-12 solar-gradient hover:opacity-90 transition-all duration-300 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl group disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              {loading ? "Entrando..." : "Entrar no Sistema"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center pt-3">
              <p className="text-gray-600 text-xs">
                Não tem uma conta?{" "}
                <a href="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                  Cadastre-se aqui
                </a>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            © 2024 SolarControl - Energia Limpa para um Futuro Sustentável
          </p>
        </div>
      </div>

      <ForgotPasswordModal 
        open={showForgotPassword} 
        onOpenChange={setShowForgotPassword} 
      />
    </>
  );
};

export default LoginForm;
