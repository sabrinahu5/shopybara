import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Artist {
  name: string;
}

interface Track {
  name: string;
  artists: Artist[];
}

async function getTopItems(token: string, type: "artists" | "tracks") {
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

function formatMusicData(artists: Artist[], tracks: Track[]) {
  const artistNames = artists.map((artist) => artist.name);
  const trackInfo = tracks.map((track) => ({
    name: track.name,
    artist: track.artists[0].name,
  }));

  return `
    Top Artists: ${artistNames.join(", ")}
    
    Top Tracks: ${trackInfo.map((t) => `${t.name} by ${t.artist}`).join(", ")}
  `;
}

export async function POST(request: Request) {
  try {
    const { access_token }: { access_token: string } = await request.json();

    // For demo token, return a fixed analysis
    if (access_token === 'demo_token') {
      return NextResponse.json({
        success: true,
        data: {
          vibeAnalysis: "This track exemplifies a sophisticated blend of modern aesthetics with classic sensibilities. The sonic palette suggests an appreciation for clean lines and minimalist design, while maintaining warmth and emotional depth. The overall mood points to someone who values both contemporary innovation and timeless elegance, with an eye for subtle details and refined taste.",
          roomCuration: "// ... room curation items ..."
        }
      });
    }

    // Get Spotify data
    const [topArtists, topTracks] = await Promise.all([
      getTopItems(access_token, "artists"),
      getTopItems(access_token, "tracks"),
    ]);

    // Format data for GPT
    const musicData = formatMusicData(topArtists.items, topTracks.items);

    // Get initial vibe analysis
    const vibeAnalysis = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert at analyzing music taste and determining personality traits and aesthetic preferences.",
        },
        {
          role: "user",
          content: `Based on this user's top artists and tracks, write 3-5 sentences about this individual's interests, aesthetic, vibe, and personality type. Include the user's color palette and visual style.\n${musicData}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      success: true,
      data: {
        vibeAnalysis: vibeAnalysis.choices[0].message.content
      },
    });
  } catch (error) {
    console.error("Error analyzing music taste:", error);
    return NextResponse.json(
      { error: "Failed to analyze music taste" },
      { status: 500 }
    );
  }
}
