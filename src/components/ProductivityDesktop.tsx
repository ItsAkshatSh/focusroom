import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { PomodoroNode } from '@/components/nodes/PomodoroNode';
import { SpotifyNode } from '@/components/nodes/SpotifyNode';
import { AchievementNode } from '@/components/nodes/AchievementNode';
import { StatsNode } from '@/components/nodes/StatsNode';
import { VibeControlNode } from '@/components/nodes/VibeControlNode';

const nodeTypes = {
  pomodoro: PomodoroNode,
  spotify: SpotifyNode,
  achievement: AchievementNode,
  stats: StatsNode,
  vibeControl: VibeControlNode,
};

const initialNodes: Node[] = [
  {
    id: 'achievement-1',
    type: 'achievement',
    position: { x: 100, y: 50 }, 
    data: {
      workSessionsCompleted: 0,
      totalFocusTime: 0,
      currentStreak: 0,
    },
  },
  {
    id: 'stats-1',
    type: 'stats',
    position: { x: 100, y: 350 },
    data: {
      workSessionsCompleted: 0,
      totalFocusTime: 0,
      currentStreak: 0,
    },
  },
  {
    id: 'pomodoro-1',
    type: 'pomodoro',
    position: { x: 600, y: 200 }, 
    data: {},
  },
  {
    id: 'spotify-1',
    type: 'spotify',
    position: { x: 1100, y: 50 }, 
    data: {},
  },
  {
    id: 'vibe-1',
    type: 'vibeControl',
    position: { x: 500, y: 600 }, 
    data: {
      currentTheme: 'cozy',
    },
  },
];

const initialEdges: Edge[] = [];

export const ProductivityDesktop = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('cozy');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSessionComplete = (type: 'work' | 'break') => {
    if (type === 'work') {
      const newSessionsCompleted = workSessionsCompleted + 1;
      const newTotalFocusTime = totalFocusTime + 25;
      const newStreak = currentStreak + 1;

      setWorkSessionsCompleted(newSessionsCompleted);
      setTotalFocusTime(newTotalFocusTime);
      setCurrentStreak(newStreak);

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.type === 'stats' || node.type === 'achievement') {
            return {
              ...node,
              data: {
                ...node.data,
                workSessionsCompleted: newSessionsCompleted,
                totalFocusTime: newTotalFocusTime,
                currentStreak: newStreak,
              },
            };
          }
          if (node.type === 'pomodoro') {
            return {
              ...node,
              data: {
                ...node.data,
                onSessionComplete: handleSessionComplete,
              },
            };
          }
          return node;
        })
      );
    }
  };

  const handleThemeChange = (theme: string) => {
    console.log('Theme changing to:', theme);
    setCurrentTheme(theme);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.type === 'vibeControl') {
          return {
            ...node,
            data: {
              ...node.data,
              currentTheme: theme,
              onThemeChange: handleThemeChange,
            },
          };
        }
        return node;
      })
    );

    document.documentElement.setAttribute('data-theme', theme);
    console.log('Applied data-theme:', theme, 'to document element');
    
    const root = document.documentElement;
    const themes = {
      cozy: {
        '--primary': '14 89% 58%',
        '--primary-glow': '25 100% 75%',
        '--cozy-warmth': '14 89% 65%',
        '--accent': '25 100% 65%',
        '--monitor-glow': '25 100% 70%',
      },
      forest: {
        '--primary': '122 39% 49%',
        '--primary-glow': '120 60% 70%',
        '--cozy-warmth': '122 39% 55%',
        '--accent': '120 50% 45%',
        '--monitor-glow': '120 60% 70%',
      },
      ocean: {
        '--primary': '220 90% 56%',
        '--primary-glow': '200 100% 80%',
        '--cozy-warmth': '220 90% 62%',
        '--accent': '200 80% 60%',
        '--monitor-glow': '200 100% 75%',
      },
      sunset: {
        '--primary': '330 81% 60%',
        '--primary-glow': '340 100% 80%',
        '--cozy-warmth': '330 81% 66%',
        '--accent': '340 75% 55%',
        '--monitor-glow': '340 90% 75%',
      }
    };
    
    const themeColors = themes[theme as keyof typeof themes];
    if (themeColors) {
      Object.entries(themeColors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
        console.log(`Set ${property} to ${value}`);
      });
    }
  };

  const nodesWithData = nodes.map((node) => {
    if (node.type === 'pomodoro') {
      return {
        ...node,
        data: {
          ...node.data,
          onSessionComplete: handleSessionComplete,
          currentTheme,
        },
      };
    }
    if (node.type === 'stats' || node.type === 'achievement') {
      return {
        ...node,
        data: {
          ...node.data,
          workSessionsCompleted,
          totalFocusTime,
          currentStreak,
          currentTheme,
        },
      };
    }
    if (node.type === 'spotify') {
      return {
        ...node,
        data: {
          ...node.data,
          currentTheme,
        },
      };
    }
    if (node.type === 'vibeControl') {
      return {
        ...node,
        data: {
          ...node.data,
          currentTheme,
          onThemeChange: handleThemeChange,
        },
      };
    }
    return node;
  });

  return (
    <div className="h-screen w-full bg-gradient-to-br from-cozy-warmth/20 via-background to-cool-light/30 overflow-hidden">
      <ReactFlow
        nodes={nodesWithData}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent w-full h-full"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        preventScrolling={true}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={false}
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20} 
          size={1} 
          className="opacity-30"
        />
      </ReactFlow>
    </div>
  );
};