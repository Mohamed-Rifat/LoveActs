import { readdirSync } from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { resolve } from "path";

const domain = "https://loveacts.vercel.app";

const pagesDir = resolve("./src/assets/Pages");
const pages = readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((dir) => {
        const name = dir.name.toLowerCase();

        if (name === "home") return { url: "/", changefreq: "daily", priority: 1.0 };

        if (name === "notfound") return null;

        return {
            url: `/${name}`,
            changefreq: "weekly",
            priority: 0.7,
        };
    })
    .filter(Boolean);

async function generateSitemap() {
    const sitemapStream = new SitemapStream({ hostname: domain });
    const writeStream = createWriteStream(resolve("./public/sitemap.xml"));

    sitemapStream.pipe(writeStream);

    pages.forEach((page) => sitemapStream.write(page));

    sitemapStream.end();

    await streamToPromise(sitemapStream);
    console.log("✅ sitemap.xml generated automatically from src/Pages/");
}

generateSitemap();
