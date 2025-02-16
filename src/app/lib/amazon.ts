import { createServerSupabaseClient } from "@/lib/server-utils";
import { chromium } from "playwright";
import type { AmazonFindCard } from "@/app/types/amazonFinds";

export async function processAndStoreAmazonUrls(urls: string[], userId: string) {
  const supabase = createServerSupabaseClient();
  const browser = await chromium.launch({ headless: true });
  const results: AmazonFindCard[] = [];

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const url of urls) {
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Extract product details
        const title = await page.$eval('#productTitle', el => el.textContent?.trim() || '');
        const price = await page.$eval('.a-price .a-offscreen', el => el.textContent?.trim() || '');
        const description = await page.$eval('#feature-bullets .a-list-item', el => el.textContent?.trim() || '');
        const imageUrl = await page.$eval('#landingImage', img => img.getAttribute('src') || '');

        // Create AmazonFindCard object
        const findCard: Omit<AmazonFindCard, 'id' | 'created_at'> = {
          title,
          description,
          url_to_product: url,
          image_url: imageUrl,
          price,
          profile_id: userId
        };

        console.log('Storing Amazon find:', {
          title,
          url: url,
          price
        });

        // Insert into Supabase
        const { data, error } = await supabase
          .from('amazon_finds')
          .upsert([
            {
              ...findCard,
              created_at: new Date().toISOString()
            }
          ])
          .select();

        if (error) {
          console.error('Error storing Amazon find:', error);
          continue;
        }

        if (data?.[0]) {
          console.log('Successfully stored Amazon find:', {
            id: data[0].id,
            title: data[0].title
          });
          results.push(data[0]);
        }

      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        continue;
      }
    }

  } finally {
    await browser.close();
  }

  return results;
} 