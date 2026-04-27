import type { Metadata } from "next";
import { Oswald, Barlow, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/auth";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "RepTrack — Train Smarter. Hit Harder.",
  description: "The gym OS built for athletes who track everything. 1,200+ programmes, elite coaching, and real-time progress analytics.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={cn("h-full", oswald.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
