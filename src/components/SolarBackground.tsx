
import { Sun, Zap, Battery, Leaf } from "lucide-react";

const SolarBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 solar-gradient opacity-90"></div>
      
      {/* Floating Solar Elements */}
      <div className="absolute top-20 left-10 floating-animation">
        <Sun className="w-12 h-12 text-yellow-300 opacity-20" style={{ animationDelay: '0s' }} />
      </div>
      
      <div className="absolute top-40 right-20 floating-animation">
        <Zap className="w-8 h-8 text-white opacity-30" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="absolute bottom-32 left-20 floating-animation">
        <Battery className="w-10 h-10 text-green-300 opacity-25" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="absolute bottom-20 right-32 floating-animation">
        <Leaf className="w-6 h-6 text-green-200 opacity-40" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="absolute top-60 left-1/4 floating-animation">
        <Sun className="w-6 h-6 text-yellow-200 opacity-30" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="absolute top-32 right-1/3 floating-animation">
        <Zap className="w-5 h-5 text-white opacity-20" style={{ animationDelay: '3s' }} />
      </div>

      {/* Geometric Solar Panels */}
      <div className="absolute top-1/4 left-1/6 transform -rotate-12 opacity-10">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-white rounded-sm"></div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-1/4 right-1/6 transform rotate-12 opacity-10">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-white rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Radial gradients for depth */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-yellow-300/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-blue-300/20 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

export default SolarBackground;
