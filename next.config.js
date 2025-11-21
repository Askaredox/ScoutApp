const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS),
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