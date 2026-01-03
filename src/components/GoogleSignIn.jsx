import { useEffect, useRef } from 'react';
import { authService } from '../services/authService';

export default function GoogleSignIn({ text = 'Continue with Google' }) {
  const btnRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!clientId) return;

    const existing = document.getElementById('google-identity-script');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-identity-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => initButton();
    } else {
      initButton();
    }

    function initButton() {
      try {
        /* global google */
        if (window.google && btnRef.current) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          });

          // render the branded button if desired
          window.google.accounts.id.renderButton(btnRef.current, {
            theme: 'outline',
            size: 'large',
            width: '260',
          });

          // optionally prompt
          // window.google.accounts.id.prompt();
        }
      } catch (e) {
        console.error('Google Sign-in init error', e);
      }
    }

    async function handleCredentialResponse(response) {
      try {
        const id_token = response?.credential;
        if (!id_token) throw new Error('No id_token from Google');
        const result = await authService.googleSignIn(id_token);
        if (result && result.token) {
          // token and user already stored by authService.googleSignIn
          window.location.replace('/');
        }
      } catch (err) {
        console.error('Google sign-in failed', err);
        alert('Google sign-in failed.');
      }
    }
  }, [clientId]);

  if (!clientId) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column', alignItems: 'center' }}>
      <div ref={btnRef}></div>
      <div style={{ textAlign: 'center', color: '#666', fontSize: 13 }}>{text}</div>
    </div>
  );
}
