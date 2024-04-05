/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{hostname: "localhost"}]
  },
};

export default nextConfig;
