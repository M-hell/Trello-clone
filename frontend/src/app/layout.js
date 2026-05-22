import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import AppProviders from "@/components/providers/app-providers";

import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Trello Flow",
  description: "Production-grade Trello-style task management dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
