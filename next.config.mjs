/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.urgentelectrical.services",
        pathname: "/serviceImage/**",
      },
    ],
  },
};

export default nextConfig;
