/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    domains: [
      "image.tmdb.org", // TMDB
      "books.google.com", // Google Books covers
      "books.googleusercontent.com", // Google Books covers
      "i.scdn.co", // Spotify
    ],
  },
};

export default nextConfig;
