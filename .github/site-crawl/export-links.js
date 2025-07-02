import fs from "fs";

const data = JSON.parse(fs.readFileSync("found-links.json", "utf-8"));

const allUrls = new Set();

// Add each page URL
for (const pageUrl of Object.keys(data)) {
  allUrls.add(pageUrl);

  for (const link of data[pageUrl]) {
    allUrls.add(link);
  }
}

const output = Array.from(allUrls).sort().join("\n");
fs.writeFileSync("all-urls.txt", output, "utf-8");

console.log(`Wrote ${allUrls.size} unique URLs to all-urls.txt`);