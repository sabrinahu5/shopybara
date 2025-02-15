import { NextResponse } from 'next/server';

async function getTopItems(token: string, type: 'artists' | 'tracks') {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?limit=10&time_range=medium_term`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
}

export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();

    const [topArtists, topTracks] = await Promise.all([
      getTopItems(access_token, 'artists'),
      getTopItems(access_token, 'tracks'),
    ]);

    // Log the data to console for now
    console.log('Top Artists:', topArtists);
    console.log('Top Tracks:', topTracks);

    return NextResponse.json({
      success: true,
      data: {
        topArtists: topArtists.items,
        topTracks: topTracks.items,
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 