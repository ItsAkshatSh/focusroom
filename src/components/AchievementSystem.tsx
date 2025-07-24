import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Clock, Target, Star, Zap } from 'lucide-react';

const iconMap = { Trophy, Flame, Clock, Target, Star, Zap };

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'focus' | 'streak' | 'time' | 'milestone';
}

interface AchievementSystemProps {
  workSessionsCompleted: number;
  totalFocusTime: number;
  currentStreak: number;
}

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('google_user') || 'null');
    return user?.id || '';
  } catch {
    return '';
  }
}

export const AchievementSystem = ({ 
  workSessionsCompleted, 
  totalFocusTime, 
  currentStreak 
}: AchievementSystemProps) => {
  const userId = getUserId();
  const getKey = (key: string) => userId ? `${userId}_${key}` : key;

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(getKey('achievements'));
    if (saved) {
      return JSON.parse(saved).map((a: any) => ({
        ...a,
        icon: iconMap[a.icon] || Trophy
      }));
    }
    return [
      {
        id: 'first-session',
        title: 'First Steps',
        description: 'Complete your first focus session',
        icon: Target,
        iconName: 'Target',
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        category: 'milestone'
      },
      {
        id: 'streak-3',
        title: 'Getting Warmed Up',
        description: 'Complete 3 sessions in a row',
        icon: Flame,
        iconName: 'Flame',
        unlocked: false,
        progress: 0,
        maxProgress: 3,
        category: 'streak'
      },
      {
        id: 'time-60',
        title: 'Hour of Power',
        description: 'Focus for a total of 60 minutes',
        icon: Clock,
        iconName: 'Clock',
        unlocked: false,
        progress: 0,
        maxProgress: 60,
        category: 'time'
      },
      {
        id: 'sessions-10',
        title: 'Consistency Champion',
        description: 'Complete 10 focus sessions',
        icon: Trophy,
        iconName: 'Trophy',
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        category: 'focus'
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintain a 7-session streak',
        icon: Star,
        iconName: 'Star',
        unlocked: false,
        progress: 0,
        maxProgress: 7,
        category: 'streak'
      },
      {
        id: 'time-300',
        title: 'Focus Master',
        description: 'Accumulate 5 hours of focus time',
        icon: Zap,
        iconName: 'Zap',
        unlocked: false,
        progress: 0,
        maxProgress: 300,
        category: 'time'
      }
    ];
  });

  useEffect(() => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        let progress = achievement.progress;
        let unlocked = achievement.unlocked;
        switch (achievement.id) {
          case 'first-session':
            progress = Math.min(workSessionsCompleted, achievement.maxProgress);
            break;
          case 'sessions-10':
            progress = Math.min(workSessionsCompleted, achievement.maxProgress);
            break;
          case 'streak-3':
          case 'streak-7':
            progress = Math.min(currentStreak, achievement.maxProgress);
            break;
          case 'time-60':
          case 'time-300':
            progress = Math.min(totalFocusTime, achievement.maxProgress);
            break;
        }
        if (progress >= achievement.maxProgress && !unlocked) {
          unlocked = true;
        }
        // @ts-ignore
        return { ...achievement, progress, unlocked, iconName: achievement.iconName || Object.keys(iconMap).find(k => iconMap[k] === achievement.icon) };
      });
      
      localStorage.setItem(getKey('achievements'), JSON.stringify(updated.map(a => ({ ...a, icon: undefined }))));
      
      return updated.map(a => ({ ...a, icon: iconMap[a.iconName] || Trophy }));
    });
  }, [workSessionsCompleted, totalFocusTime, currentStreak, userId]);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'focus': return 'bg-warm-glow/20 text-warm-glow border-warm-glow/30';
      case 'streak': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'time': return 'bg-cool-light/20 text-cool-light border-cool-light/30';
      case 'milestone': return 'bg-ambient-purple/20 text-ambient-purple border-ambient-purple/30';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);
  const lockedAchievements = achievements.filter(a => !a.unlocked && a.progress === 0);

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-warm-glow" />
        <h3 className="font-semibold text-foreground">Achievements</h3>
        <Badge variant="secondary" className="text-xs">
          {unlockedAchievements.length}/{achievements.length}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Unlocked</h4>
            <div className="space-y-2">
              {unlockedAchievements.map(achievement => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-warm-glow/10 border border-warm-glow/20 animate-pulse-glow"
                  >
                    <div className="p-2 rounded-full bg-warm-glow/20">
                      <IconComponent className="w-4 h-4 text-warm-glow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground text-sm">
                        {achievement.title}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge className={getCategoryColor(achievement.category)}>
                      Unlocked!
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress Achievements */}
        {inProgressAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">In Progress</h4>
            <div className="space-y-2">
              {inProgressAchievements.map(achievement => {
                const IconComponent = achievement.icon;
                const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
                
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="p-2 rounded-full bg-muted">
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground text-sm">
                        {achievement.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="w-full bg-border/50 rounded-full h-1.5">
                        <div 
                          className="bg-cool-light h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Locked</h4>
            <div className="space-y-2">
              {lockedAchievements.slice(0, 2).map(achievement => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 opacity-60"
                  >
                    <div className="p-2 rounded-full bg-muted/50">
                      <IconComponent className="w-4 h-4 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-muted-foreground text-sm">
                        {achievement.title}
                      </h5>
                      <p className="text-xs text-muted-foreground/70">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
