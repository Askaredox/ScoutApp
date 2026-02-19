
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || 'http://localhost:3000',
    generateRobotsTxt: true,
    changefreq: 'weekly',
    sitemapSize: 7000,
    additionalPaths: async () => {
    // Fetch slugs from your CMS/DB:
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const res = await fetch(`${backendUrl}/file`);
    const posts = await res.json();

    return posts.map((p) => ({
      loc: `/file/${p.id.split("#")[1]}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    }));
  },
};