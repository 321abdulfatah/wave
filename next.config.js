/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    // MediaPipe ships node-targeted requires that webpack should not try to bundle.
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, crypto: false }
    return config
  },
}
