import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SpotifyService } from '@/services/spotifyService';
import { Music, LogOut, Settings } from 'lucide-react';

interface SpotifyAuthProps {
  onAuthChange: (isAuthenticated: boolean) => void;
}

export const SpotifyAuth = ({ onAuthChange }: SpotifyAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientId, setClientId] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const spotifyService = SpotifyService.getInstance();

  useEffect(() => {
    const isAuth = spotifyService.isAuthenticated();
    setIsAuthenticated(isAuth);
    onAuthChange(isAuth);

    if (window.location.search.includes('code=')) {
      spotifyService.handleAuthCallback().then((success) => {
        if (success) {
          setIsAuthenticated(true);
          onAuthChange(true);
        }
      });
    }
  }, [onAuthChange]);

  const handleLogin = async () => {
    try {
      await spotifyService.authenticate();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleLogout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    onAuthChange(false);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-soft-green">
          <Music className="w-3 h-3" />
          <span>Connected to Spotify</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleLogout}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleLogin}
      className="text-xs bg-soft-green hover:bg-soft-green/80"
    >
      <Music className="w-3 h-3 mr-1" />
      Connect Spotify
    </Button>
  );
};