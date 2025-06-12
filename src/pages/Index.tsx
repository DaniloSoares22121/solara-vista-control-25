
import LoginForm from "@/components/LoginForm";
import SolarHeroSection from "@/components/SolarHeroSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Hero compacto no mobile */}
        <div className="h-48 sm:h-56">
          <SolarHeroSection />
        </div>
        
        {/* Login form no mobile */}
        <div className="flex-1 px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
          <LoginForm />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-row lg:min-h-screen">
        {/* Hero Section - Desktop */}
        <div className="lg:flex-1">
          <SolarHeroSection />
        </div>
        
        {/* Login Form - Desktop */}
        <div className="lg:flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
