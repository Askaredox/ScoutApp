const allowedOrigins = JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || "[]");

const remotePatterns = allowedOrigins.map((origin) => {
  try {
    const url = new URL(origin.startsWith("http") ? origin : `https://${origin}`);
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
    };
  } catch {
    return null;
  }
}).filter(Boolean);

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns,
  },
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.entry\.js$/,
      use: { loader: 'worker-loader' },
    });
    return config;
  },
};

module.exports = nextConfig;