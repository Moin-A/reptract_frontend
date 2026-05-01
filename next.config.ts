import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1"],
  /* config options here */
};

export default nextConfig;
