/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.urgentelectrical.services",
        pathname: "/serviceImage/**",
      },
      {
        protocol: "https",
        hostname: "www.urgentelectrical.services",
        pathname: "/service-categories/**",
      },
    ],
  },
};

export default nextConfig;
