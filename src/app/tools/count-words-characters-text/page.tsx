import type { Metadata } from "next";

import { CountWordsCharactersTool } from "@/components/count-words-characters-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
 ...buildToolMetadata({
 title: "Word and Character Counter",
 description:
 "Count words, characters, sentences, and paragraphs instantly. Text remains in your browser and is never uploaded for processing.",
 path: "/tools/count-words-characters-text",
 keywords: [
 "word counter",
 "character counter",
 "count words",
 "text length checker",
 ],
 }),
 robots: { index: false, follow: true },
};

export default function CountWordsCharactersPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Count Words & Characters", url: "/tools/count-words-characters-text" },
 ]}
 />
 <ToolJsonLd
 title="Word and Character Counter"
 description="Instantly count words, characters, sentences, and paragraphs in your text. A fast, free, browser-side tool for writers and marketers."
 path="/tools/count-words-characters-text"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Text Metrics"
 title="Count words and characters instantly."
 intro="Paste your article, essay, or social media post to see real-time statistics. Check if your text meets length requirements without sending your data to a server."
 quote="Hit your exact character limit every time."
 tool={
 <div className="flex flex-col gap-12">
 <CountWordsCharactersTool />
 
 </div>
 }
 />
 </>
 );
}
