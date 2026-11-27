import type { NextConfig } from "next";

const isNativeBuild = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = isNativeBuild
  ? {
      output: "export",
      trailingSlash: true,
      distDir: ".next-native",
      images: {
        unoptimized: true,
      },
    }
  : {
      images: {
        remotePatterns: [
          { protocol: "https", hostname: "lh3.googleusercontent.com" },
        ],
      },
    };

export default nextConfig;
