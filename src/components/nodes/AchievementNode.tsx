import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AchievementSystem } from '@/components/AchievementSystem';

interface AchievementNodeProps {
  data: {
    workSessionsCompleted: number;
    totalFocusTime: number;
    currentStreak: number;
    currentTheme?: string;
  };
}

export const AchievementNode = memo(({ data }: AchievementNodeProps) => {
  const themeClass = data.currentTheme ? `theme-${data.currentTheme}` : '';
  return (
    <div className={`min-w-[300px] ${themeClass}`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <AchievementSystem 
        workSessionsCompleted={data.workSessionsCompleted}
        totalFocusTime={data.totalFocusTime}
        currentStreak={data.currentStreak}
      />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});