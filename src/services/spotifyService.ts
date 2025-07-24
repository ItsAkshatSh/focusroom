// Spotify 
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlayHistoryItem {
  track: SpotifyTrack;
  played_at: string;
}

//PKCE 
function base64URLEncode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest('SHA-256', data);
}
function generateCodeVerifier(length = 128) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let verifier = '';
  for (let i = 0; i < length; i++) {
    verifier += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return verifier;
}

import { useUser } from '../context/UserContext';

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('google_user') || 'null');
    return user?.id || '';
  } catch {
    return '';
  }
}

export class SpotifyService {
  private static instance: SpotifyService;
  private clientId: string = 'SPOTIFY_CLIENT_ID'; 
  private accessToken: string | null = null;

  private getStorageKey(key: string) {
    const userId = getUserId();
    return userId ? `${userId}_${key}` : key;
  }

  private constructor() {
    // Check for stored token on initialization
    this.accessToken = localStorage.getItem(this.getStorageKey('spotify_access_token'));
  }

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  async authenticate(): Promise<void> {
    const scopes = [
      'user-read-recently-played',
      'user-read-currently-playing',
      'user-read-playback-state'
    ];
    const redirectUri = window.location.origin + '/';
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(await sha256(codeVerifier));
    localStorage.setItem(this.getStorageKey('spotify_pkce_code_verifier'), codeVerifier);
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      show_dialog: 'true',
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });
    window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  }

  // Call this after redirect to handle the code
  async handleAuthCallback(): Promise<boolean> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) return false;
    try {
      const redirectUri = window.location.origin + '/';
      const codeVerifier = localStorage.getItem(this.getStorageKey('spotify_pkce_code_verifier'));
      if (!codeVerifier) throw new Error('Missing PKCE code verifier');
      const params = new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      });
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      if (!response.ok) throw new Error('Failed to exchange code for token');
      const data = await response.json();
      this.accessToken = data.access_token;
      localStorage.setItem(this.getStorageKey('spotify_access_token'), data.access_token);
      // Clear the code from URL
      window.history.replaceState(null, '', window.location.pathname);
      return true;
    } catch (error) {
      console.error('Spotify auth error:', error);
      return false;
    }
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem(this.getStorageKey('spotify_access_token'));
    localStorage.removeItem(this.getStorageKey('spotify_pkce_code_verifier'));
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  async getRecentlyPlayed(limit: number = 1): Promise<SpotifyPlayHistoryItem[]> {
    const data = await this.makeRequest(`/me/player/recently-played?limit=${limit}`);
    return data.items || [];
  }

  async getLastPlayedTrack(): Promise<SpotifyTrack | null> {
    try {
      const recentTracks = await this.getRecentlyPlayed(1);
      return recentTracks.length > 0 ? recentTracks[0].track : null;
    } catch (error) {
      console.error('Error fetching last played track:', error);
      return null;
    }
  }

  // Fetch the currently playing track
  async getCurrentlyPlayingTrack(): Promise<SpotifyTrack | null> {
    try {
      const data = await this.makeRequest('/me/player/currently-playing');
      if (data && data.item) {
        return data.item;
      }
      return null;
    } catch (error) {
      console.error('Error fetching currently playing track:', error);
      return null;
    }
  }
}
