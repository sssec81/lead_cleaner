import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

export const alt = "LeadCleanr";
export const contentType = "image/png";
export const size = {
 width: 1200,
 height: 630,
};

export const runtime = "nodejs";

export default async function OpenGraphImage() {
 const mark = await readFile(path.join(process.cwd(), "public", "leadcleanr-mark.png"));
 const markUrl = `data:image/png;base64,${mark.toString("base64")}`;

 return new ImageResponse(
 (
 <div
 style={{
 display: "flex",
 height: "100%",
 width: "100%",
          background: "#f6f4ee",
 color: "#102a43",
 padding: "56px",
 }}
 >
 <div
 style={{
 display: "flex",
 flexDirection: "column",
 justifyContent: "space-between",
 width: "100%",
 border: "1px solid rgba(16,42,67,0.12)",
 borderRadius: "36px",
 background: "rgba(255,255,255,0.86)",
 padding: "48px",
 }}
 >
 <div
 style={{
 display: "flex",
 alignItems: "center",
 gap: "20px",
 }}
 >
 <img
 src={markUrl}
 alt=""
 style={{ width: "92px", height: "72px", objectFit: "contain" }}
 />
 <div
 style={{
 display: "flex",
 flexDirection: "column",
 gap: "6px",
 }}
 >
 <div style={{ display: "flex", fontSize: "28px", fontWeight: 700 }}>
 <span>Lead</span><span style={{ color: "#2454ff" }}>Cleanr</span>
 </div>
 <div style={{ fontSize: "18px", color: "#596675" }}>
 Browser-first lead cleaning
 </div>
 </div>
 </div>

 <div
 style={{
 display: "flex",
 flexDirection: "column",
 gap: "18px",
 maxWidth: "860px",
 }}
 >
 <div
 style={{
 fontSize: "64px",
 lineHeight: 1,
 fontWeight: 700,
 letterSpacing: "-0.04em",
 }}
 >
 Clean messy lead CSV files before CRM import
 </div>
 <div
 style={{
 fontSize: "26px",
 lineHeight: 1.35,
 color: "#596675",
 }}
 >
 Deduplicate rows, flag personal and role-based inboxes, generate
 domains, and export a cleaner file in your browser.
 </div>
 </div>

 <div
 style={{
 display: "flex",
 gap: "14px",
 flexWrap: "wrap",
 }}
 >
 {["CSV cleanup", "Email extraction", "Browser-side processing"].map(
 (label) => (
 <div
 key={label}
 style={{
 display: "flex",
 alignItems: "center",
 borderRadius: "999px",
 background: "rgba(120,230,192,0.18)",
 color: "#087a55",
 padding: "12px 18px",
 fontSize: "18px",
 fontWeight: 600,
 }}
 >
 {label}
 </div>
 ),
 )}
 </div>
 </div>
 </div>
 ),
 size,
 );
}
