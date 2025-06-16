
import LoginForm from "@/components/LoginForm";
import SolarHeroSection from "@/components/SolarHeroSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Hero compacto no mobile */}
        <div className="h-56">
          <SolarHeroSection />
        </div>
        
        {/* Login form no mobile */}
        <div className="flex-1 px-4 py-8 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <LoginForm />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen w-full">
        {/* Hero Section - Desktop */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center">
          <SolarHeroSection />
        </div>
        
        {/* Login Form - Desktop */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
