import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { chromium } from 'playwright';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function scrapeImages(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set a shorter timeout
  page.setDefaultTimeout(5000);
  
  await page.goto(url);

  // Only scroll once and reduce wait time
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .map(img => img.src)
      .filter(src => src && !src.includes('profile') && !src.includes('avatar'))
      .slice(0, 10); // Limit to 10 images for faster processing
  });

  await browser.close();
  return imageUrls;
}

async function getImageDescriptions(imageUrls: string[]) {
  const descriptions = [];
  // Only process first 5 images to avoid rate limits
  const limitedUrls = imageUrls.slice(0, 5);

  for (const url of limitedUrls) {
    try {
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Give 5-6 words that describe the vibe of this image. This can include any standout colors, activities, or objects." },
              {
                type: "image_url",
                image_url: { url },
              },
            ],
          },
        ],
        max_tokens: 150,
      });
      descriptions.push(completion.choices[0].message.content);
    } catch (error) {
      console.error(`Error processing image ${url}:`, error);
      continue;
    }
  }

  return descriptions;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    // Scrape image URLs
    const imageUrls = await scrapeImages(url);
    
    // Get descriptions for each image
    const descriptions = await getImageDescriptions(imageUrls);

    console.log('Scraped image URLs:', imageUrls);
    console.log('Descriptions:', descriptions);

    return NextResponse.json({
      success: true,
      data: {
        imageUrls,
        descriptions,
      },
    });
  } catch (error) {
    console.error('Error analyzing Pinterest board:', error);
    return NextResponse.json(
      { error: 'Failed to analyze Pinterest board' },
      { status: 500 }
    );
  }
} 