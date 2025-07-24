import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PomodoroTimer } from '@/components/PomodoroTimer';

interface PomodoroNodeProps {
  data: {
    onSessionComplete?: (type: 'work' | 'break') => void;
    currentTheme?: string;
  };
}

export const PomodoroNode = memo(({ data }: PomodoroNodeProps) => {
  const themeClass = data.currentTheme ? `theme-${data.currentTheme}` : '';
  return (
    <div className={`bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 min-w-[300px] ${themeClass}`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <PomodoroTimer onSessionComplete={data.onSessionComplete} />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});