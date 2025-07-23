import fs from "fs";
import { parseStringPromise } from "xml2js";
import { chromium } from "playwright";
import fetch from "node-fetch";

async function run() {
  const sitemapUrl = "https://revenuedata.doi.gov/sitemap-0.xml";

  // Download sitemap XML
  console.log(`Fetching sitemap from: ${sitemapUrl}`);
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.statusText}`);
  }
  const xml = await res.text();

  // Parse XML to extract <loc> URLs
  const result = await parseStringPromise(xml);
  const urls = result.urlset.url.map((u) => u.loc[0]);

  console.log(`Found ${urls.length} URLs in sitemap.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const allLinks = {};

  for (const url of urls) {
    console.log(`Visiting: ${url}`);

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    // Extract all visible <a href> links
    const links = await page.$$eval("a[href]", (anchors) =>
      anchors
        .map((a) => a.href)
        .filter((href) => href && !href.startsWith("javascript:"))
    );

    allLinks[url] = links;

    await page.close();
  }

  await browser.close();

  // Save results to JSON
  fs.writeFileSync(
    "found-links.json",
    JSON.stringify(allLinks, null, 2),
    "utf-8"
  );

  console.log("Saved found links to found-links.json");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});