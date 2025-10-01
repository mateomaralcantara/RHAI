// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },      // <— desactiva ESLint en build
  // opcional si quieres ignorar TS en build:
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
