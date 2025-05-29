/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://213.199.38.239:9000/api/:path*',
        basePath: false
      }
    ]
  }
}

module.exports = nextConfig 