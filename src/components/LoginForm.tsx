
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sun, Mail, Lock, Zap } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    // Aqui você implementaria a lógica de autenticação
  };

  return (
    <Card className="solar-card-gradient p-8 w-full max-w-md border-0 solar-glow">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 solar-gradient rounded-full pulse-glow">
          <Sun className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold solar-text-gradient mb-2">
          SolarControl
        </h1>
        <p className="text-gray-600">
          Sistema de Gestão de Energia Solar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-yellow-400 transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-yellow-400 transition-colors"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-gray-600">Lembrar-me</span>
          </label>
          <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
            Esqueceu a senha?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-12 solar-gradient hover:opacity-90 transition-opacity text-white font-semibold text-lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Entrar no Sistema
        </Button>

        <div className="text-center pt-4">
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
              Cadastre-se aqui
            </a>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
