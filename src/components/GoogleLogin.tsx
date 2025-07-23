import { useEffect } from 'react';

interface GoogleLoginProps {
  onSuccess: (user: { id: string; name: string; email: string; picture: string; credential: string }) => void;
}

export const GoogleLogin = ({ onSuccess }: GoogleLoginProps) => {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      // @ts-ignore
      if (window.google && window.google.accounts) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: document.querySelector('meta[name="google-signin-client_id"]')?.getAttribute('content'),
          callback: (response: any) => {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
            );
            const user = JSON.parse(jsonPayload);
            onSuccess({
              id: user.sub,
              name: user.name,
              email: user.email,
              picture: user.picture,
              credential: response.credential,
            });
          },
        });
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large' }
        );
      }
    };

    // Check if the script is already loaded
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      // Wait for the script to load
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        const handleScriptLoad = () => {
          initializeGoogleSignIn();
        };
        script.addEventListener('load', handleScriptLoad);
        // Clean up event listener on unmount
        return () => {
          script.removeEventListener('load', handleScriptLoad);
        };
      }
    }
  }, [onSuccess]);

  return <div id="google-signin-btn" />;
}; 