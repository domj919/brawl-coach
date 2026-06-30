import type { MetadataRoute } from "next";

const SITE_URL = "https://brawl-advisor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/draft`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/roster`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
