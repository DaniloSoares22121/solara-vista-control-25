
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-lg mb-6">
              <Sun className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Solar<span className="text-green-600">Control</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Card de Login */}
          <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium text-base">
                  Endereço de Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 border-2 border-gray-200 focus:border-green-500 rounded-xl text-base bg-gray-50 focus:bg-white transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-base">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-green-500 rounded-xl text-base bg-gray-50 focus:bg-white transition-all"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Opções */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-400" 
                  />
                  <span className="text-gray-600 font-medium">Manter conectado</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Esqueci a senha
                </button>
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              {/* Divisor */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
                </div>
              </div>

              {/* Link de Cadastro */}
              <div className="text-center">
                <p className="text-gray-600">
                  Ainda não tem uma conta?{" "}
                  <a 
                    href="/register" 
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
                  >
                    Cadastre-se gratuitamente
                  </a>
                </p>
              </div>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © 2024 SolarControl - Plataforma de Gestão de Energia Solar
            </p>
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
