/** @type {import('next').NextConfig} */
import withPlugins from 'next-compose-plugins'
import withVideos from 'next-videos'

// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    return config
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ramawebsite.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default withPlugins([withVideos], nextConfig)
