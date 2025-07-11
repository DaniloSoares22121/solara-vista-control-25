
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, User, Building, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.name);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao SolarControl.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 solar-gradient rounded-2xl shadow-lg">
          <Sun className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Solar<span className="solar-text-gradient">Control</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Crie sua conta e comece a gerenciar sua energia solar
          </p>
        </div>
      </div>

      {/* Register Card */}
      <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-semibold text-base">
              Nome Completo *
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-semibold text-base">
              Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-700 font-semibold text-base">
              Empresa
            </Label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="company"
                type="text"
                placeholder="Nome da sua empresa (opcional)"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-semibold text-base">
              Senha *
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold text-base">
              Confirmar Senha *
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input 
              type="checkbox" 
              className="mt-1 rounded border-gray-300 text-green-500 focus:ring-green-400" 
              required 
              disabled={loading}
            />
            <span className="text-gray-600 font-medium text-sm leading-relaxed">
              Aceito os{" "}
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                termos de uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                política de privacidade
              </a>
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 solar-gradient hover:opacity-90 transition-all duration-300 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl group disabled:opacity-50"
          >
            <Zap className="w-5 h-5 mr-3" />
            {loading ? "Criando conta..." : "Criar Conta"}
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center pt-6">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <a href="/" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Faça login aqui
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
  );
};

export default RegisterForm;
