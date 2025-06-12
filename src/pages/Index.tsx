
import LoginForm from "@/components/LoginForm";
import SolarHeroSection from "@/components/SolarHeroSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section - Ocupa altura reduzida no mobile */}
      <div className="lg:flex-1 h-64 lg:h-auto">
        <SolarHeroSection />
      </div>
      
      {/* Login Form - Ocupa o restante da tela no mobile */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
