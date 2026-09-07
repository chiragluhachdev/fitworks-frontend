import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        // Trainer discovery moved behind a gym login; keep old links working
        // instead of 404ing anything already indexed or shared.
        source: '/find-trainers',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/trainers',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/trainers/:slug',
        destination: '/auth',
        permanent: true,
      },
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
