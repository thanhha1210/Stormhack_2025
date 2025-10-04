module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Replace with your image domain if needed
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // Set your NextAuth URL
    DATABASE_URL: process.env.DATABASE_URL, // Set your database URL
  },
};