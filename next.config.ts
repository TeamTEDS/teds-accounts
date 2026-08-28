import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
};

export default nextConfig;

// Enable `getCloudflareContext()` during local dev only — running this during
// `next build` (invoked by `opennextjs-cloudflare build`) starts a second
// workerd/Miniflare instance that causes SQLITE_BUSY crashes.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}
