/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "books.google.com", // allow Google Books covers
        "image.tmdb.org",    // for TMDB images
      ],
    },
  };

export default nextConfig;


