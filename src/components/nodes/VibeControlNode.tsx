import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Volume2, Coffee, Mountain } from 'lucide-react';

interface VibeControlNodeProps {
  data: {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
  };
}

const themes = [
  { 
    id: 'cozy', 
    name: 'Cozy Fireplace', 
    icon: Coffee,
    colors: ['#FF6B35', '#F7931E', '#FFD23F']
  },
  { 
    id: 'forest', 
    name: 'Forest Calm', 
    icon: Mountain,
    colors: ['#228B22', '#32CD32', '#90EE90']
  },
  { 
    id: 'ocean', 
    name: 'Ocean Waves', 
    icon: Volume2,
    colors: ['#4169E1', '#00BFFF', '#87CEEB']
  },
  { 
    id: 'sunset', 
    name: 'Sunset Glow', 
    icon: Palette,
    colors: ['#FF4500', '#FF69B4', '#FFB6C1']
  }
];

export const VibeControlNode = memo(({ data }: VibeControlNodeProps) => {
  return (
    <div className="min-w-[280px]">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-monitor-glow" />
          Vibe Control
        </h3>
        
        <div className="space-y-3">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isActive = data.currentTheme === theme.id;
            
            return (
              <Button
                key={theme.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => data.onThemeChange(theme.id)}
                className="w-full justify-start gap-3"
              >
                <IconComponent className="w-4 h-4" />
                <span className="flex-1 text-left">{theme.name}</span>
                <div className="flex gap-1">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-border/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <Badge variant="secondary" className="text-xs">
            Current: {themes.find(t => t.id === data.currentTheme)?.name || 'Default'}
          </Badge>
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});