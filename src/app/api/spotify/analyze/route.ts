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

    const analysis = vibeAnalysis.choices[0].message.content;

    // Get room curation based on vibe analysis
    const roomCuration = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert interior designer who specializes in creating cohesive, personalized spaces that reflect individual style.",
        },
        {
          role: "user",
          content: `Based on this personality and vibe analysis: "${analysis}", create a detailed list of exactly 15 specific furniture and decor items that would create a cohesive bedroom design reflecting this person's style. Be specific with materials, colors, and styles. Format as a numbered list. List each specific item without description. Focus on creating a unified aesthetic that matches their personality.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const curation = roomCuration.choices[0].message.content;

    return NextResponse.json({
      success: true,
      data: {
        topArtists: topArtists.items,
        topTracks: topTracks.items,
        vibeAnalysis: analysis,
        roomCuration: curation,
      },
    });
  } catch (error) {
    console.error("Error analyzing user data:", error);
    return NextResponse.json(
      { error: "Failed to analyze user data" },
      { status: 500 }
    );
  }
}
