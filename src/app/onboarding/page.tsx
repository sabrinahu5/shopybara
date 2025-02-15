'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function generateCodeVerifier(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      redirectToAuthCodeFlow();
    } else {
      handleCallback(code);
    }
  }, [code]);

  async function redirectToAuthCodeFlow() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    
    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000/onboarding");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async function handleCallback(code: string) {
    try {
      const verifier = localStorage.getItem("verifier");
      const params = new URLSearchParams();
      params.append("client_id", process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", "http://localhost:3000/onboarding");
      params.append("code_verifier", verifier!);

      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });

      const data = await result.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Get analysis of user's music taste
      const analysisResponse = await fetch('/api/spotify/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.access_token })
      });

      const analysisData = await analysisResponse.json();
      console.log('Analysis:', analysisData);

      // If successful, redirect to home
      router.push('/home');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to Spotify');
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
