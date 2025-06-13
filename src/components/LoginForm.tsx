
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
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

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, digite seu email no campo acima para recuperar a senha.",
        variant: "destructive",
      });
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("❌ [FORGOT_PASSWORD] Erro ao enviar email:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Verifique se o email está correto e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm xs:max-w-md mx-auto space-y-4 xs:space-y-6 lg:space-y-8">
      {/* Header com tamanhos otimizados */}
      <div className="text-center space-y-2 xs:space-y-3 lg:space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 xs:w-16 xs:h-16 lg:w-20 lg:h-20 mb-3 xs:mb-4 lg:mb-6 solar-gradient rounded-xl xs:rounded-2xl shadow-lg">
          <Sun className="w-6 h-6 xs:w-8 xs:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl xs:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
            Solar<span className="solar-text-gradient">Control</span>
          </h1>
          <p className="text-gray-600 text-sm xs:text-base lg:text-lg">
            Acesse sua plataforma de gestão
          </p>
        </div>
      </div>

      {/* Login Card com responsividade aprimorada */}
      <Card className="p-4 xs:p-6 lg:p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 lg:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-semibold text-sm xs:text-sm lg:text-base">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 xs:left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 xs:w-4 xs:h-4 lg:w-5 lg:h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 xs:pl-10 lg:pl-12 h-10 xs:h-12 lg:h-14 text-sm xs:text-base lg:text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-lg xs:rounded-xl"
                required
                disabled={loading || forgotPasswordLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-semibold text-sm xs:text-sm lg:text-base">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 xs:left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 xs:w-4 xs:h-4 lg:w-5 lg:h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 xs:pl-10 lg:pl-12 h-10 xs:h-12 lg:h-14 text-sm xs:text-base lg:text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-lg xs:rounded-xl"
                required
                disabled={loading || forgotPasswordLoading}
              />
            </div>
          </div>

          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-0">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-400" />
              <span className="text-gray-600 font-medium text-xs xs:text-sm">Lembrar-me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={forgotPasswordLoading}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors text-xs xs:text-sm disabled:opacity-50"
            >
              {forgotPasswordLoading ? "Enviando..." : "Esqueceu a senha?"}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading || forgotPasswordLoading}
            className="w-full h-10 xs:h-12 lg:h-14 solar-gradient hover:opacity-90 transition-all duration-300 text-white font-bold text-sm xs:text-base lg:text-lg rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl group disabled:opacity-50"
          >
            <Zap className="w-4 h-4 xs:w-4 xs:h-4 lg:w-5 lg:h-5 mr-2 xs:mr-2 lg:mr-3" />
            {loading ? "Entrando..." : "Entrar no Sistema"}
            <ArrowRight className="w-4 h-4 xs:w-4 xs:h-4 lg:w-5 lg:h-5 ml-2 xs:ml-2 lg:ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center pt-3 xs:pt-4 lg:pt-6">
            <p className="text-gray-600 text-xs xs:text-sm">
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
        <p className="text-gray-500 text-xs lg:text-sm">
          © 2024 SolarControl - Energia Limpa para um Futuro Sustentável
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
