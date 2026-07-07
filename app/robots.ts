import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tattoos-by-jake-llewellyn-11261f.duckbyte.co/sitemap.xml",
  };
}
