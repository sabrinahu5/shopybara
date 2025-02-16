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
    
    // Set shorter timeouts
    page.setDefaultNavigationTimeout(5000);
    page.setDefaultTimeout(5000);

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // Wait for specific elements instead of networkidle
        await Promise.race([
          page.waitForSelector('#productTitle', { timeout: 5000 }),
          page.waitForTimeout(3000)
        ]);

        // Extract product details with individual try-catch blocks
        let title = '', price = '', description = '', imageUrl = '';
        
        try {
          title = await page.$eval('#productTitle', el => el.textContent?.trim() || '');
        } catch (e) {
          console.warn('Failed to extract title:', e);
        }

        try {
          price = await page.$eval('.a-price .a-offscreen', el => el.textContent?.trim() || '');
        } catch (e) {
          console.warn('Failed to extract price:', e);
        }

        try {
          description = await page.$eval('#feature-bullets .a-list-item', el => el.textContent?.trim() || '');
        } catch (e) {
          console.warn('Failed to extract description:', e);
        }

        try {
          imageUrl = await page.$eval('#landingImage', img => img.getAttribute('src') || '');
        } catch (e) {
          console.warn('Failed to extract image:', e);
        }

        // Only proceed if we have at least a title
        if (!title) {
          console.error(`Skipping URL ${url}: Could not extract title`);
          continue;
        }

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
          description,
          url: url,
          image_url: imageUrl,
          price,
          profile_id: userId
        });

        // Insert into Supabase
        const { data, error } = await supabase
          .from('amazon_finds')
          .upsert([{
            ...findCard,
            created_at: new Date().toISOString()
          }])
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