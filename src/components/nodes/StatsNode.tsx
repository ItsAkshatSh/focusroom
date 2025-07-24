import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Timer, Flame } from 'lucide-react';

interface StatsNodeProps {
  data: {
    workSessionsCompleted: number;
    totalFocusTime: number;
    currentStreak: number;
    currentTheme?: string;
  };
}

export const StatsNode = memo(({ data }: StatsNodeProps) => {
  const themeClass = data.currentTheme ? `theme-${data.currentTheme}` : '';
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const dailyGoal = 4; // 4 sessions per day
  const goalProgress = Math.min((data.workSessionsCompleted / dailyGoal) * 100, 100);

  return (
    <div className="min-w-[280px]">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Card className={`bg-card/95 backdrop-blur-sm border-border/50 p-4 ${themeClass}`}>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-monitor-glow" />
          Your Stats
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-soft-green" />
              <span className="text-sm text-muted-foreground">Sessions</span>
            </div>
            <span className="font-bold text-lg text-foreground">{data.workSessionsCompleted}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-ambient-purple" />
              <span className="text-sm text-muted-foreground">Focus Time</span>
            </div>
            <span className="font-bold text-lg text-foreground">{formatTime(data.totalFocusTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-warm-orange" />
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <span className="font-bold text-lg text-foreground">{data.currentStreak}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Goal</span>
              <span className="text-foreground">{data.workSessionsCompleted}/{dailyGoal}</span>
            </div>
            <Progress 
              value={goalProgress} 
              className="h-2 bg-border/50"
            />
          </div>
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});