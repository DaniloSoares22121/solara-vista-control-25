
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
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-300/20 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-100/40 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-green-200/25 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            {/* Header da marca */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl shadow-2xl mb-8 relative">
                <Sun className="w-12 h-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-yellow-600" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Solar<span className="text-green-600">Control</span>
              </h1>
              <p className="text-gray-600 text-xl font-medium">
                Energia Solar Inteligente
              </p>
              <p className="text-gray-500 text-base mt-2">
                Gerencie sua energia renovável com facilidade
              </p>
            </div>

            {/* Card de Login */}
            <Card className="p-10 shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-3xl relative overflow-hidden">
              {/* Gradiente decorativo no topo */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-600"></div>
              
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h2>
                <p className="text-gray-600">Entre na sua conta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Campo Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-800 font-semibold text-base">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-16 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-2xl text-base bg-gray-50 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-gray-800 font-semibold text-base">
                    Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-16 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-2xl text-base bg-gray-50 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Opções */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-green-500 focus:ring-green-400 focus:ring-2" 
                    />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Lembrar de mim</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors relative group"
                  >
                    Esqueci minha senha
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </div>

                {/* Botão de Login */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 group">
                      <span>Entrar no Sistema</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                {/* Divisor elegante */}
                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-6 bg-white text-gray-500 font-medium">ou</span>
                  </div>
                </div>

                {/* Link de Cadastro */}
                <div className="text-center bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 text-base mb-2">
                    Novo no SolarControl?
                  </p>
                  <a 
                    href="/register" 
                    className="text-green-600 hover:text-green-700 font-bold text-lg transition-colors relative group inline-block"
                  >
                    Criar conta gratuita
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </div>
              </form>
            </Card>

            {/* Footer */}
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm">
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
