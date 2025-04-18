const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'scout-filesystem.s3.amazonaws.com',
      'scout-announcements.s3.amazonaws.com'
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