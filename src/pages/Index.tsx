
import LoginForm from "@/components/LoginForm";
import SolarBackground from "@/components/SolarBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <SolarBackground />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-white/80 text-sm text-center">
          © 2024 SolarControl - Energia Limpa para um Futuro Sustentável
        </p>
      </div>
    </div>
  );
};

export default Index;
