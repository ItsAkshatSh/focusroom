import { useState, useEffect } from 'react';
import { Moon, Sun, Cloud, CloudRain } from 'lucide-react';

export const CozyRoom = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState('cloudy'); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isNight = currentTime.getHours() >= 20 || currentTime.getHours() < 6;
  const timeString = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-400" />;
      default: return <Cloud className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ambient" />
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-warm-glow/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-16 w-40 h-40 bg-cool-light/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-ambient-purple/25 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      
      <div className="absolute top-8 right-8 w-40 h-32">
        <div className="w-full h-full bg-card/20 backdrop-blur-sm rounded-lg border border-border/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Outside</span>
            {getWeatherIcon()}
          </div>
          <div className="text-right">
            <div className="text-lg font-mono text-foreground">{timeString}</div>
            <div className="text-xs text-muted-foreground">
              {isNight ? 'Night' : 'Day'}
            </div>
          </div>
          
          <div className="absolute inset-2 bg-gradient-to-br from-transparent via-foreground/5 to-transparent rounded opacity-60" />
        </div>
      </div>

      <div className="absolute top-12 left-12">
        <div className="relative">
          <div className="w-16 h-16 bg-warm-glow/40 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-muted rounded-full" />
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-warm-glow/30 rounded-full blur-sm" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <div className="w-12 h-16 relative">
          <div className="absolute bottom-0 w-10 h-6 bg-amber-900/60 rounded-full mx-auto left-1/2 transform -translate-x-1/2" />

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-8 bg-soft-green/60 rounded-full" />
            <div className="absolute top-0 -left-2 w-4 h-3 bg-soft-green/80 rounded-full" />
            <div className="absolute top-1 left-1 w-3 h-4 bg-soft-green/70 rounded-full" />
            <div className="absolute top-2 -left-1 w-2 h-3 bg-soft-green/60 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 right-20">
        <div className="space-y-1">
          <div className="w-16 h-2 bg-red-800/60 rounded-sm" />
          <div className="w-14 h-2 bg-blue-800/60 rounded-sm ml-1" />
          <div className="w-15 h-2 bg-green-800/60 rounded-sm" />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};