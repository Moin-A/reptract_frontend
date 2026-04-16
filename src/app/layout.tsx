import type { Metadata } from "next";
import { Oswald, Barlow } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepTrack — Train Smarter. Hit Harder.",
  description: "The gym OS built for athletes who track everything. 1,200+ programmes, elite coaching, and real-time progress analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${oswald.variable} ${barlow.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
