// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
  },
};

module.exports = nextConfig; // Use CommonJS for Next.js config, not `export default`