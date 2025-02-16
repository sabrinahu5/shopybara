import { NextResponse } from "next/server";
import OpenAI from "openai";
import { processAndStoreAmazonUrls } from "@/app/lib/amazon";
import { createServerSupabaseClient } from "@/lib/server-utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    const { spotifyData, pinterestData } = await request.json();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Spotify Analysis:', spotifyData.vibeAnalysis);
    console.log('Pinterest Analysis:', pinterestData.descriptions);

    const prompt = `
      Based on this person's music and visual preferences:

      MUSIC ANALYSIS:
      ${spotifyData.vibeAnalysis}

      PINTEREST ROOM INSPIRATION KEYWORDS:
      ${pinterestData.descriptions.join(', ')}

      Please provide:
      1. A comprehensive analysis of their overall aesthetic, vibe, and interests (3-4 sentences)
      2. A curated list of exactly 15 specific furniture and decor item (< 5 words each) that would create their perfect room, taking into account both their music taste and visual preferences.
      
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

    const amazonUrls = await handleAmazonSearch(combinedAnalysis.choices[0].message.content || '');

    // Process and store Amazon URLs
    const storedFinds = await processAndStoreAmazonUrls(amazonUrls, user.id);

    return NextResponse.json({
      success: true,
      data: combinedAnalysis.choices[0].message.content,
      amazonUrls: storedFinds
    });
  } catch (error) {
    console.error('Error in combine-analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis' },
      { status: 500 }
    );
  }
}

const handleAmazonSearch = async (combinedAnalysis: string) => {
  // Extract items after "RECOMMENDED ITEMS:"
  const itemsMatch = combinedAnalysis.match(/RECOMMENDED ITEMS:\s*([\s\S]*?)(?:\n\n|$)/);
  
  if (!itemsMatch || !itemsMatch[1]) {
    console.error("No recommended items found in analysis");
    return;
  }

  // Split into array and clean up
  const itemsList = itemsMatch[1]
    .split('\n')
    .map(item => item.replace(/^\d+\.\s*/, '').trim())
    .filter(item => item.length > 0)
    .slice(0, 15); // Limit to 15 items
    
  console.log('Items List:', itemsList);
  
  try {
    // Use absolute URL with the current host
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const amazonApiUrl = `${protocol}://${host}/api/amazon`;

    const response = await fetch(amazonApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerms: itemsList
      })
    });

    const data = await response.json();
    console.log('Amazon API Response:', data);
    return data.items;
  } catch (error) {
    console.error('Error calling Amazon API:', error);
  }
}; 