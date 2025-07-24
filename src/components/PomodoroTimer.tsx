import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Focus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  onSessionComplete: (type: 'work' | 'break') => void;
}

export const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const { toast } = useToast();

  const workDuration = 25 * 60; 
  const breakDuration = 5 * 60; 

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = useCallback(() => {
    setTimeLeft(isWorkSession ? workDuration : breakDuration);
    setIsActive(false);
  }, [isWorkSession, workDuration, breakDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onSessionComplete(isWorkSession ? 'work' : 'break');
      
      toast({
        title: isWorkSession ? 'Work session complete!' : 'Break time over!',
        description: isWorkSession ? 'Time for a well-deserved break 🎉' : 'Ready to get back to work? 💪',
      });

      setIsWorkSession(!isWorkSession);
      setTimeLeft(!isWorkSession ? workDuration : breakDuration);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWorkSession, onSessionComplete, toast, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const switchSession = () => {
    setIsWorkSession(!isWorkSession);
    setTimeLeft(!isWorkSession ? workDuration : breakDuration);
    setIsActive(false);
  };

  const progress = ((isWorkSession ? workDuration : breakDuration) - timeLeft) / (isWorkSession ? workDuration : breakDuration) * 100;

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6 relative overflow-hidden">

      <div 
        className={`absolute inset-0 opacity-30 transition-all duration-500 ${
          isWorkSession ? 'bg-gradient-warm' : 'bg-gradient-cool'
        }`}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isWorkSession ? (
              <Focus className="w-5 h-5 text-warm-glow" />
            ) : (
              <Coffee className="w-5 h-5 text-cool-light" />
            )}
            <span className="text-sm font-medium text-foreground">
              {isWorkSession ? 'Focus Time' : 'Break Time'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={switchSession}
            className="text-xs"
          >
            Switch to {isWorkSession ? 'Break' : 'Work'}
          </Button>
        </div>

        {/* Progress ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-border"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                isWorkSession ? 'text-warm-glow' : 'text-cool-light'
              }`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`${
              isWorkSession 
                ? 'bg-warm-glow/20 border-warm-glow/30 text-warm-glow hover:bg-warm-glow/30' 
                : 'bg-cool-light/20 border-cool-light/30 text-cool-light hover:bg-cool-light/30'
            } transition-all duration-300`}
            variant="outline"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-muted/50"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};