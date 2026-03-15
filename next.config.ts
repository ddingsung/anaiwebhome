import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/anaiwebhome",
  images: { unoptimized: true },
};

export default nextConfig;
