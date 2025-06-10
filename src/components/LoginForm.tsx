
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, Zap, ArrowRight } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    // Aqui você implementaria a lógica de autenticação
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
            Acesse sua plataforma de gestão
          </p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-semibold text-base">
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
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-semibold text-base">
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
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-400" />
              <span className="text-gray-600 font-medium">Lembrar-me</span>
            </label>
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full h-14 solar-gradient hover:opacity-90 transition-all duration-300 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl group"
          >
            <Zap className="w-5 h-5 mr-3" />
            Entrar no Sistema
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center pt-6">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <a href="#" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
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
  );
};

export default LoginForm;
