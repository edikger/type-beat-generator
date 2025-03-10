// pages/sitemap.xml.js
import { format } from "date-fns";

const BASE_URL = "https://your-domain.com";

function generateSiteMap() {
  // List all URLs for your website
  const pages = ["", "/terms-of-service", "/privacy-policy"];

  const currentDate = format(new Date(), "yyyy-MM-dd");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          return `
            <url>
              <loc>${BASE_URL}${page}</loc>
              <lastmod>${currentDate}</lastmod>
              <changefreq>${page === "" ? "daily" : "monthly"}</changefreq>
              <priority>${page === "" ? "1.0" : "0.8"}</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
