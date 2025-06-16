
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
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header moderno */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 solar-gradient rounded-2xl shadow-lg mx-auto">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Solar<span className="solar-text-gradient">Control</span>
            </h1>
            <p className="text-gray-600 text-base">
              Acesse sua plataforma de gestão
            </p>
          </div>
        </div>

        {/* Login Card moderno */}
        <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-400" />
                <span className="text-gray-600 font-medium">Lembrar-me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors text-left"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 solar-gradient hover:opacity-90 transition-all duration-300 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl group disabled:opacity-50"
            >
              <Zap className="w-5 h-5 mr-2" />
              {loading ? "Entrando..." : "Entrar no Sistema"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
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
          <p className="text-gray-500 text-sm">
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
