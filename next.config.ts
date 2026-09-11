import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    META_PIXEL_ID: process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "",
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
