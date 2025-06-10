
import LoginForm from "@/components/LoginForm";
import SolarHeroSection from "@/components/SolarHeroSection";

const Index = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Solar Hero Image */}
      <SolarHeroSection />
      
      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
