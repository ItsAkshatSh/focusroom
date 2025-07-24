import { useState, useEffect } from 'react';
import { CozyRoom } from './CozyRoom';
import { SpotifyMonitor } from './SpotifyMonitor';
import { PomodoroTimer } from './PomodoroTimer';
import { AchievementSystem } from './AchievementSystem';

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('google_user') || 'null');
    return user?.id || '';
  } catch {
    return '';
  }
}

export const ProductivityRoom = () => {
  const userId = getUserId();
  const getKey = (key: string) => userId ? `${userId}_${key}` : key;

  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const savedW = localStorage.getItem(getKey('workSessionsCompleted'));
    setWorkSessionsCompleted(savedW ? parseInt(savedW, 10) : 0);
    const savedT = localStorage.getItem(getKey('totalFocusTime'));
    setTotalFocusTime(savedT ? parseInt(savedT, 10) : 0);
    const savedS = localStorage.getItem(getKey('currentStreak'));
    setCurrentStreak(savedS ? parseInt(savedS, 10) : 0);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(getKey('workSessionsCompleted'), workSessionsCompleted.toString());
  }, [workSessionsCompleted, userId]);
  useEffect(() => {
    localStorage.setItem(getKey('totalFocusTime'), totalFocusTime.toString());
  }, [totalFocusTime, userId]);
  useEffect(() => {
    localStorage.setItem(getKey('currentStreak'), currentStreak.toString());
  }, [currentStreak, userId]);

  const handleSessionComplete = (type: 'work' | 'break') => {
    if (type === 'work') {
      setWorkSessionsCompleted(prev => prev + 1);
      setTotalFocusTime(prev => prev + 25);
      setCurrentStreak(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CozyRoom />
      
      <div className="relative z-10 container mx-auto px-6 py-8 h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Focus Room
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sessions today</span>
                  <span className="font-mono text-warm-glow font-bold">
                    {workSessionsCompleted}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Focus time</span>
                  <span className="font-mono text-cool-light font-bold">
                    {totalFocusTime}m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current streak</span>
                  <span className="font-mono text-ambient-purple font-bold">
                    {currentStreak}
                  </span>
                </div>
              </div>
            </div>
            
            <AchievementSystem 
              workSessionsCompleted={workSessionsCompleted}
              totalFocusTime={totalFocusTime}
              currentStreak={currentStreak}
            />
          </div>

          <div className="flex items-center justify-center">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>

          <div className="flex flex-col justify-start pt-20">
            <SpotifyMonitor />
            
            <div className="mt-6 space-y-4">
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/30">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Room Vibes
                </h4>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-warm-glow animate-pulse-glow" />
                    Warm lighting
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-soft-green animate-pulse" />
                    Fresh air
                  </div>
                </div>
              </div>
              
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/30">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Today's Goal
                </h4>
                <p className="text-xs text-muted-foreground">
                  Complete 5 focus sessions
                </p>
                <div className="w-full bg-border/50 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-warm-glow h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((workSessionsCompleted / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {workSessionsCompleted > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-warm-glow/20 backdrop-blur-sm rounded-full px-6 py-2 border border-warm-glow/30 animate-pulse-glow">
              <span className="text-sm text-warm-glow font-medium">
                Great job! Keep the momentum going! 🔥
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};