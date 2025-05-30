const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://213.199.38.239:9000/api/:path*",
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
