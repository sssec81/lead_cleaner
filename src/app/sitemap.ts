import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";
import { TOOL_REGISTRY } from "@/lib/tool-registry";

const staticRoutes: Array<{
 route: string;
 changeFrequency: "weekly" | "monthly";
 priority: number;
}> = [
 { route: "", changeFrequency: "weekly", priority: 1.0 },
 { route: "/tools", changeFrequency: "weekly", priority: 0.9 },
 { route: "/pricing", changeFrequency: "monthly", priority: 0.7 },
 { route: "/privacy", changeFrequency: "monthly", priority: 0.5 },
 { route: "/terms", changeFrequency: "monthly", priority: 0.4 },
 { route: "/contact", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
 const siteUrl = getSiteUrl();

 return [...staticRoutes, ...TOOL_REGISTRY.map((tool) => ({
 route: tool.path,
 changeFrequency: tool.changeFrequency,
 priority: tool.priority,
 }))].map(({ route, changeFrequency, priority }) => ({
 url: `${siteUrl}${route}`,
 changeFrequency,
 priority,
 }));
}
