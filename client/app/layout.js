import "./globals.css";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";
import ConditionalHeader from "./components/common/conditionalHeader";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sora",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata = {
  title: "FlashLoom",
  description: "Study material in. Flashcards out.",
};

const themeInit = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink">
        <Providers>
          <ConditionalHeader />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
