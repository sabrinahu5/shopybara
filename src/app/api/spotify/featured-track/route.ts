import { NextResponse } from 'next/server';

async function getSpotifyAccessToken() {
  const basic = Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET() {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    // Using the same fetch pattern as your existing routes
    const response = await fetch(
      'https://api.spotify.com/v1/browse/new-releases?limit=1',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const data = await response.json();
    const track = {
      name: data.albums.items[0].name,
      artists: data.albums.items[0].artists,
      album: {
        images: data.albums.items[0].images,
        name: data.albums.items[0].name
      }
    };
    
    return NextResponse.json(track);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch track' }, { status: 500 });
  }
} 