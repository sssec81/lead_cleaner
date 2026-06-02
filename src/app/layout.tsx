import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leadcleanr.com"),
  title: {
    default: "LeadCleanr | Clean Messy Lead Lists Instantly",
    template: "%s | LeadCleanr",
  },
  description:
    "Paste text or upload a CSV to extract emails, phone numbers, URLs, domains, and remove duplicates in your browser.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
