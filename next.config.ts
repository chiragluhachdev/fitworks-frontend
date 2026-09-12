import type { NextConfig } from "next";

const rawPixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "1604943784468462";
const activePixelId = rawPixelId === "604943784468462" ? "1604943784468462" : rawPixelId;

const nextConfig: NextConfig = {
  env: {
    META_PIXEL_ID: activePixelId,
    NEXT_PUBLIC_META_PIXEL_ID: activePixelId,
  },
  images: {
    remotePatterns: [
      {
        // All user uploads (trainer photos, gym logos, verification docs)
        // are served from Cloudinary. Without this, next/image blocks them
        // and the page renders a broken image instead.
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/login.php',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*.php',
        destination: '/',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
