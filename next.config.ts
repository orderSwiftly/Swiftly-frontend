// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://tredia.vercel.app/api/:path*',
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'], // ✅ Add Cloudinary domain here
  },
};

module.exports = nextConfig; // ✅ Use CommonJS for Next.js config, not `export default`