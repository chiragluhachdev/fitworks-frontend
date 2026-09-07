import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://fitworks.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/for-gyms",
          "/for-trainers",
          "/about",
          "/contact",
          "/pricing",
        ],
        disallow: [
          // Trainer discovery is gym-only; these public pages were removed.
          "/find-trainers",
          "/trainers",
          "/admin",
          "/admin/*",
          "/auth",
          "/auth/*",
          "/gym",
          "/gym/*",
          "/trainer",
          "/trainer/*",
          "/api",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
