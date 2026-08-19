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
          "/find-trainers",
          "/trainers",
          "/about",
          "/contact",
          "/pricing",
        ],
        disallow: [
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
