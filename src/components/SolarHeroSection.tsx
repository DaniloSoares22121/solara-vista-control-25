
import { Sun, Zap, Battery, Leaf, TrendingUp, Shield } from "lucide-react";

const SolarHeroSection = () => {
  return (
    <div className="flex-1 relative overflow-hidden solar-gradient">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2187&auto=format&fit=crop')"
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/80 via-green-600/70 to-green-800/80"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 floating-animation">
        <Sun className="w-16 h-16 text-white/30" style={{ animationDelay: '0s' }} />
      </div>
      
      <div className="absolute top-40 right-20 floating-animation">
        <Zap className="w-12 h-12 text-white/25" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="absolute bottom-40 left-16 floating-animation">
        <Battery className="w-14 h-14 text-white/20" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="absolute top-60 right-1/4 floating-animation">
        <Leaf className="w-10 h-10 text-white/30" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-12 text-white">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Energia Solar
              <br />
              <span className="text-green-200">Inteligente</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-md">
              Gerencie sua usina solar com tecnologia avançada e monitore sua produção em tempo real.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-lg">Monitoramento em Tempo Real</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg">Segurança e Confiabilidade</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-lg">Sustentabilidade Total</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-200">98%</div>
              <div className="text-sm text-white/80">Eficiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-200">24/7</div>
              <div className="text-sm text-white/80">Monitoramento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* Solar Panels Grid */}
      <div className="absolute bottom-20 right-20 opacity-10">
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
