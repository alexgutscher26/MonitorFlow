/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  useFileSystemPublicRoutes: true,
}
=======
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};
>>>>>>> main

export default nextConfig;
