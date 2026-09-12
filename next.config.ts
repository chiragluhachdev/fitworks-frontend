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
  /**
   * Serve the API from our own origin.
   *
   * The browser used to call the Railway hostname directly. Indian mobile ISPs,
   * DNS filters, data-saver proxies and in-app browsers all block shared cloud
   * subdomains like *.up.railway.app, so fetch threw before reaching the server
   * and the user was told to check a connection that was working — the page
   * itself had just loaded over that same connection.
   *
   * Going through fitworks.in also removes CORS and preflights entirely: if the
   * page loaded, the API is reachable by definition.
   */
  async rewrites() {
    const origin =
      process.env.API_PROXY_ORIGIN || "https://fitworks-backend-production.up.railway.app";
    return [{ source: "/api/:path*", destination: `${origin}/api/:path*` }];
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
