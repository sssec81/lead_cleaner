import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

const staticRoutes: Array<{
 route: string;
 changeFrequency: "weekly" | "monthly";
 priority: number;
}> = [
 { route: "", changeFrequency: "weekly", priority: 1.0 },
 { route: "/tools", changeFrequency: "weekly", priority: 0.9 },
 { route: "/tools/csv-lead-cleaner", changeFrequency: "weekly", priority: 0.95 },
 { route: "/tools/extract-emails-from-csv", changeFrequency: "weekly", priority: 0.9 },
 { route: "/tools/extract-phone-numbers-from-csv", changeFrequency: "weekly", priority: 0.88 },
 { route: "/tools/validate-email-list", changeFrequency: "weekly", priority: 0.88 },
 { route: "/tools/clean-email-list", changeFrequency: "weekly", priority: 0.85 },
 { route: "/tools/remove-duplicate-emails", changeFrequency: "weekly", priority: 0.84 },
 { route: "/tools/merge-csv-files", changeFrequency: "weekly", priority: 0.84 },
 { route: "/tools/split-csv-files", changeFrequency: "weekly", priority: 0.82 },
 { route: "/tools/remove-empty-rows-from-csv", changeFrequency: "weekly", priority: 0.82 },
 { route: "/tools/extract-emails-from-text", changeFrequency: "monthly", priority: 0.8 },
 { route: "/tools/extract-phone-numbers-from-text", changeFrequency: "monthly", priority: 0.78 },
 { route: "/tools/extract-urls-from-text", changeFrequency: "monthly", priority: 0.72 },
 { route: "/tools/extract-domains-from-emails", changeFrequency: "monthly", priority: 0.76 },
 { route: "/tools/remove-duplicate-phone-numbers", changeFrequency: "monthly", priority: 0.72 },
 { route: "/tools/remove-duplicate-urls", changeFrequency: "monthly", priority: 0.7 },
 { route: "/tools/count-words-characters-text", changeFrequency: "monthly", priority: 0.55 },
 { route: "/tools/convert-csv-to-json", changeFrequency: "monthly", priority: 0.72 },
 { route: "/pricing", changeFrequency: "monthly", priority: 0.7 },
 { route: "/privacy", changeFrequency: "monthly", priority: 0.5 },
 { route: "/terms", changeFrequency: "monthly", priority: 0.4 },
 { route: "/contact", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
 const siteUrl = getSiteUrl();
 const now = process.env.BUILD_TIME 
 ? new Date(process.env.BUILD_TIME) 
 : new Date();

 return staticRoutes.map(({ route, changeFrequency, priority }) => ({
 url: `${siteUrl}${route}`,
 lastModified: now,
 changeFrequency,
 priority,
 }));
}
