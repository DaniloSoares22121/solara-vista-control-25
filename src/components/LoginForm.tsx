
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { useEffect } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (currentUser) {
      console.log('🔐 [LOGIN] User already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

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
      <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden relative">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-green-100/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-green-200/25 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Container principal que ocupa toda a tela */}
        <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md mx-auto">
            {/* Header da marca */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl shadow-xl mb-6 relative transform hover:scale-105 transition-transform duration-300">
                <Sun className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Solar<span className="text-green-600">Control</span>
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Energia Solar Inteligente
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Gerencie sua energia renovável com facilidade
              </p>
            </div>

            {/* Card de Login */}
            <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl relative overflow-hidden transform hover:shadow-3xl transition-all duration-300">
              {/* Gradiente decorativo no topo */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-600"></div>
              
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Bem-vindo de volta!</h2>
                <p className="text-gray-600 text-sm">Entre na sua conta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800 font-semibold">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800 font-semibold">
                    Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Opções */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-2 border-gray-300 text-green-500 focus:ring-green-400 focus:ring-2" 
                    />
                    <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors">Lembrar de mim</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors relative group"
                  >
                    Esqueci minha senha
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </div>

                {/* Botão de Login */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 group">
                      <span>Entrar no Sistema</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                {/* Divisor elegante */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
                  </div>
                </div>

                {/* Link de Cadastro */}
                <div className="text-center bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 text-sm mb-1">
                    Novo no SolarControl?
                  </p>
                  <a 
                    href="/register" 
                    className="text-green-600 hover:text-green-700 font-bold transition-colors relative group inline-block"
                  >
                    Criar conta gratuita
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </div>
              </form>
            </Card>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-xs">
                © 2024 SolarControl - Transformando o futuro da energia solar
              </p>
            </div>
          </div>
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
