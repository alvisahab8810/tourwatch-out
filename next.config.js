/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compress all responses with gzip
  compress: true,

  // Allow Next.js to serve images efficiently
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 3600,
  },

  // Aggressive HTTP caching for static assets
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
