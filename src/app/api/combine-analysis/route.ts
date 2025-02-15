import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { spotifyData, pinterestData } = await request.json();

    const prompt = `
      Based on this person's music and visual preferences:

      MUSIC ANALYSIS:
      ${spotifyData.vibeAnalysis}

      PINTEREST ROOM INSPIRATION KEYWORDS:
      ${pinterestData.descriptions.join(', ')}

      Please provide:
      1. A comprehensive analysis of their aesthetic, vibe, and interests (3-4 sentences)
      2. A curated list of exactly 15 specific furniture and decor items that would create their perfect room, taking into account both their music taste and visual preferences.
      
      Format the response as:
      PERSONALITY ANALYSIS:
      [Your analysis here]

      RECOMMENDED ITEMS:
      1. [First item]
      2. [Second item]
      ...
    `;

    const combinedAnalysis = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interior designer and personality analyst who specializes in creating personalized spaces that reflect individual style.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      success: true,
      data: combinedAnalysis.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error combining analyses:", error);
    return NextResponse.json(
      { error: "Failed to combine analyses" },
      { status: 500 }
    );
  }
} 