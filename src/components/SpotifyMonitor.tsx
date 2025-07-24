import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Music, ExternalLink } from 'lucide-react';
import { SpotifyService } from '@/services/spotifyService';
import { SpotifyAuth } from '@/components/SpotifyAuth';

interface Track {
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt?: string;
  spotifyUrl?: string;
}

export const SpotifyMonitor = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Remove loading state from refreshes, only use for first load
  const [firstLoad, setFirstLoad] = useState(true);
  const spotifyService = SpotifyService.getInstance();

  // New: fetch currently playing track first, fallback to last played
  const fetchCurrentOrLastPlayed = async () => {
    if (!isAuthenticated) return;
    if (firstLoad) setLoading(true);
    setError(null);
    try {
      // Try to get currently playing track
      const current = await spotifyService.getCurrentlyPlayingTrack?.();
      if (current) {
        const newTrack = {
          title: current.name,
          artist: current.artists.map((artist: any) => artist.name).join(', '),
          album: current.album.name,
          duration: Math.floor(current.duration_ms / 1000),
          albumArt: current.album.images[0]?.url,
          spotifyUrl: current.external_urls.spotify
        };
        if (!currentTrack || JSON.stringify(currentTrack) !== JSON.stringify(newTrack)) {
          setCurrentTrack(newTrack);
        }
        if (firstLoad) setLoading(false);
        setFirstLoad(false);
        return;
      }
      // Fallback to last played
      const track = await spotifyService.getLastPlayedTrack();
      if (track) {
        const newTrack = {
          title: track.name,
          artist: track.artists.map((artist: any) => artist.name).join(', '),
          album: track.album.name,
          duration: Math.floor(track.duration_ms / 1000),
          albumArt: track.album.images[0]?.url,
          spotifyUrl: track.external_urls.spotify
        };
        if (!currentTrack || JSON.stringify(currentTrack) !== JSON.stringify(newTrack)) {
          setCurrentTrack(newTrack);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch track');
      if (err instanceof Error && err.message.includes('expired')) {
        setIsAuthenticated(false);
      }
    } finally {
      if (firstLoad) setLoading(false);
      setFirstLoad(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setFirstLoad(true);
      fetchCurrentOrLastPlayed();
      const interval = setInterval(fetchCurrentOrLastPlayed, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-monitor-glow/30 p-6 relative overflow-hidden shadow-monitor">
      
      <div className="absolute inset-0 bg-gradient-to-br from-monitor-glow/20 via-transparent to-cool-light/10 animate-pulse-glow" />
      
      <div className="absolute inset-2 border border-monitor-glow/20 rounded-lg" />
      
      <div className="relative z-10">
        
        <div className="flex items-center justify-between mb-4">
          {!isAuthenticated && <SpotifyAuth onAuthChange={setIsAuthenticated} />}
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-8 space-y-2">
            <Music className="w-12 h-12 text-monitor-glow/50 mx-auto" />
            <p className="text-muted-foreground text-sm">Connect to Spotify to see your last played track</p>
          </div>
        ) : firstLoad && loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-monitor-glow/30 border-t-monitor-glow rounded-full animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Loading track...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-destructive text-sm">{error}</p>
            <button 
              onClick={fetchCurrentOrLastPlayed}
              className="text-monitor-glow hover:underline text-xs"
            >
              Try again
            </button>
          </div>
        ) : currentTrack ? (
          <>
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-monitor-glow/30 to-ambient-purple/30 rounded-lg flex items-center justify-center border border-monitor-glow/20 overflow-hidden">
              {currentTrack.albumArt ? (
                <img 
                  src={currentTrack.albumArt} 
                  alt={`${currentTrack.album} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-8 h-8 text-monitor-glow/80" />
              )}
            </div>

            
            <div className="text-center mb-4 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-semibold text-foreground text-lg leading-tight">
                  {currentTrack.title}
                </h3>
                {currentTrack.spotifyUrl && (
                  <a 
                    href={currentTrack.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-monitor-glow hover:text-monitor-glow/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{currentTrack.artist}</p>
              <p className="text-muted-foreground text-xs">{currentTrack.album}</p>
            </div>

            <div className="text-center text-xs text-muted-foreground font-mono mb-4">
              Duration: {formatTime(currentTrack.duration)}
            </div>
          </>
        ) : (
          <div className="text-center py-8 space-y-2">
            <Music className="w-12 h-12 text-monitor-glow/50 mx-auto" />
            <p className="text-muted-foreground text-sm">No recent tracks found</p>
          </div>
        )}
      </div>
    </Card>
  );
};