const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_S3_FILESYSTEM_URL || 'localhost',
      process.env.NEXT_PUBLIC_S3_EVENTS_URL || 'localhost',
    ], // Add your domain here
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