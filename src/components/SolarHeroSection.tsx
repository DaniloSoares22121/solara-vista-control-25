
import { Sun, Zap, Battery, Leaf, TrendingUp, Shield } from "lucide-react";

const SolarHeroSection = () => {
  return (
    <div className="h-full relative overflow-hidden solar-gradient">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2187&auto=format&fit=crop')"
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/80 via-green-600/70 to-green-800/80"></div>
      
      {/* Floating Elements - Hidden on mobile */}
      <div className="hidden md:block">
        <div className="absolute top-6 xs:top-8 lg:top-20 left-4 xs:left-6 lg:left-10 floating-animation">
          <Sun className="w-6 h-6 xs:w-8 xs:h-8 lg:w-16 lg:h-16 text-white/30" style={{ animationDelay: '0s' }} />
        </div>
        
        <div className="absolute top-12 xs:top-16 lg:top-40 right-6 xs:right-8 lg:right-20 floating-animation">
          <Zap className="w-4 h-4 xs:w-6 xs:h-6 lg:w-12 lg:h-12 text-white/25" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="absolute bottom-12 xs:bottom-16 lg:bottom-40 left-4 xs:left-6 lg:left-16 floating-animation">
          <Battery className="w-6 h-6 xs:w-8 xs:h-8 lg:w-14 lg:h-14 text-white/20" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="absolute top-20 xs:top-24 lg:top-60 right-1/4 floating-animation">
          <Leaf className="w-4 h-4 xs:w-6 xs:h-6 lg:w-10 lg:h-10 text-white/30" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-3 xs:px-4 sm:px-6 lg:px-12 text-white">
        <div className="space-y-3 xs:space-y-4 lg:space-y-8">
          <div className="space-y-1.5 xs:space-y-2 lg:space-y-4">
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              Energia Solar
              <br />
              <span className="text-green-200">Inteligente</span>
            </h1>
            <p className="text-xs xs:text-sm sm:text-base lg:text-xl text-white/90 leading-relaxed max-w-xs xs:max-w-sm sm:max-w-sm lg:max-w-md">
              Gerencie sua usina solar com tecnologia avançada e monitore sua produção em tempo real.
            </p>
          </div>

          {/* Features - Hidden on mobile, visible from md up */}
          <div className="hidden md:block space-y-1.5 xs:space-y-2 lg:space-y-4">
            <div className="flex items-center space-x-1.5 xs:space-x-2 lg:space-x-3">
              <div className="w-5 h-5 xs:w-6 xs:h-6 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 xs:w-3 xs:h-3 lg:w-5 lg:h-5" />
              </div>
              <span className="text-xs xs:text-sm lg:text-lg">Monitoramento Real Time</span>
            </div>
            
            <div className="flex items-center space-x-1.5 xs:space-x-2 lg:space-x-3">
              <div className="w-5 h-5 xs:w-6 xs:h-6 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-2.5 h-2.5 xs:w-3 xs:h-3 lg:w-5 lg:h-5" />
              </div>
              <span className="text-xs xs:text-sm lg:text-lg">Segurança Total</span>
            </div>
            
            <div className="flex items-center space-x-1.5 xs:space-x-2 lg:space-x-3">
              <div className="w-5 h-5 xs:w-6 xs:h-6 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-2.5 h-2.5 xs:w-3 xs:h-3 lg:w-5 lg:h-5" />
              </div>
              <span className="text-xs xs:text-sm lg:text-lg">100% Sustentável</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 xs:gap-4 lg:gap-6 pt-3 xs:pt-4 lg:pt-8">
            <div className="text-center">
              <div className="text-lg xs:text-xl lg:text-3xl font-bold text-green-200">98%</div>
              <div className="text-xs lg:text-sm text-white/80">Eficiência</div>
            </div>
            <div className="text-center">
              <div className="text-lg xs:text-xl lg:text-3xl font-bold text-green-200">24/7</div>
              <div className="text-xs lg:text-sm text-white/80">Monitoramento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-8 xs:h-12 lg:h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* Solar Panels Grid - Hidden on mobile */}
      <div className="hidden lg:block absolute bottom-20 right-20 opacity-10">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-6 h-6 bg-white rounded border border-white/30"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarHeroSection;
