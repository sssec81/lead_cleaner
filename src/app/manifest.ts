import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
 return {
 name: "LeadCleanr",
 short_name: "LeadCleanr",
 description:
 "Browser-first tools for cleaning lead CSV files and extracting contact data.",
 start_url: "/",
 display: "standalone",
 background_color: "#f9f3eb",
 theme_color: "#112433",
 icons: [
 {
 src: "/icon.svg",
 sizes: "any",
 type: "image/svg+xml",
 },
 {
 src: "/icon-192.png",
 sizes: "192x192",
 type: "image/png",
 },
 {
 src: "/icon-512.png",
 sizes: "512x512",
 type: "image/png",
 },
 ],
 };
}
