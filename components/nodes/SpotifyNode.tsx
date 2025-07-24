import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { SpotifyMonitor } from '@/components/SpotifyMonitor';

interface SpotifyNodeProps {
  data: {
    currentTheme?: string;
  };
}

export const SpotifyNode = memo(({ data }: SpotifyNodeProps) => {
  const themeClass = data.currentTheme ? `theme-${data.currentTheme}` : '';
  return (
    <div className={`min-w-[280px] ${themeClass}`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <SpotifyMonitor />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});