import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necessário para Firebase App Hosting + Next.js standalone
  output: "standalone",
  experimental: {
    // Mantém compatibilidade com o runtime do App Hosting
  },
};

export default nextConfig;
