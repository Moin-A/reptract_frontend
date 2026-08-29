import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Bare hostnames only (no protocol/port). Covers the local tenant hosts —
  // lvh.me and any *.lvh.me tenant subdomain — so the dev server serves its
  // internal assets to those origins and the app hydrates there. Without this,
  // cross-origin dev requests are blocked and React never hydrates (dead UI).
  allowedDevOrigins: ["lvh.me", "*.lvh.me", "127.0.0.1"],
  /* config options here */
};

export default nextConfig;
