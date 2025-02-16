import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(request: Request) {
  try {
    const { searchTerms } = await request.json();

    if (!Array.isArray(searchTerms)) {
      return NextResponse.json(
        { error: "searchTerms must be an array" },
        { status: 400 }
      );
    }

    const items: string[] = [];
    const browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.amazon.com/');

    for (const searchTerm of searchTerms) {
      try {
        // Find and use the search box
        await page.fill('#twotabsearchtextbox', searchTerm);
        await page.press('#twotabsearchtextbox', 'Enter');
        
        // Wait for either condition to be met
        await Promise.race([
          page.waitForLoadState('networkidle', { timeout: 10000 }),
          page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 10000 })
        ]);

        // Add a small delay to ensure content is loaded
        await page.waitForTimeout(2000);

        // Get the first product result
        const firstProduct = await page.locator('div[data-component-type="s-search-result"] a.a-link-normal').first();
        
        if (firstProduct) {
          const href = await firstProduct.getAttribute('href');
          if (href) {
            const itemUrl = `https://www.amazon.com${href}`;
            items.push(itemUrl);
            console.log(`Found URL for ${searchTerm}: ${itemUrl}`);
          } else {
            console.log(`No link found for ${searchTerm}`);
          }
        } else {
          console.log(`No results found for ${searchTerm}`);
        }
      } catch (searchError) {
        console.error(`Error searching for "${searchTerm}":`, searchError);
        continue; // Skip to next search term if this one fails
      }
    }

    await browser.close();

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Amazon scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape Amazon' },
      { status: 500 }
    );
  }
} 