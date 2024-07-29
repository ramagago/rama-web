/** @type {import('next').NextConfig} */
import withPlugins from 'next-compose-plugins'
import withVideos from 'next-videos'

// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    return config
  },
  reactStrictMode: true,
  images: {
    domains: [
      'ramawebsite.s3.us-east-2.amazonaws.com',
      'ramawebsite.s3.amazonaws.com',
    ],
  },
}

export default withPlugins([withVideos], nextConfig)
