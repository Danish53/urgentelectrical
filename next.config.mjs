/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production builds minify JS/CSS via SWC (helps SEO minify checks).
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.urgentelectrical.services",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "urgentelectrical.services",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            // 1 year + subdomains. Browsers only honor this over HTTPS.
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // —— Locations: aliases / unpublished areas → live pages ——
      {
        source: "/locations/arnold",
        destination: "/locations/electrician-arnold-nottingham",
        permanent: true,
      },
      {
        source: "/locations/nottingham-city-centre",
        destination: "/locations/nottingham",
        permanent: true,
      },
      {
        source: "/locations/newark-on-trent",
        destination: "/locations/newarkontrent",
        permanent: true,
      },
      {
        source: "/locations/derby-city-centre",
        destination: "/locations/electricians-derby",
        permanent: true,
      },
      {
        source: "/locations/derby",
        destination: "/locations/electricians-derby",
        permanent: true,
      },
      {
        source: "/locations/leicester-city-centre",
        destination: "/locations/leicester",
        permanent: true,
      },
      {
        source: "/locations/lincoln-city-centre",
        destination: "/locations",
        permanent: false,
      },
      {
        source: "/locations/lincoln",
        destination: "/locations",
        permanent: false,
      },
      {
        source: "/locations/long-eaton",
        destination: "/locations",
        permanent: false,
      },
      {
        source: "/locations/sandiacre",
        destination: "/locations",
        permanent: false,
      },
      {
        source: "/locations/spondon",
        destination: "/locations",
        permanent: false,
      },
      {
        source: "/locations/mickleover",
        destination: "/locations",
        permanent: false,
      },

      // —— Services: legacy / copy slugs → CMS API slugs ——
      {
        source: "/services/emergency-response-24-7",
        destination: "/services/emergency-response-247",
        permanent: true,
      },
      {
        source: "/services/fire-alarm-inspection-and-testing",
        destination: "/services/fire-alarm-inspection-testing",
        permanent: true,
      },
      {
        source: "/services/emergency-lighting-periodic-inspection-and-testing",
        destination: "/services/emergency-lighting-periodic-inspection-testing-certificate",
        permanent: true,
      },
      {
        source: "/services/socket-replacement",
        destination: "/services/socket-replacment",
        permanent: true,
      },

      // —— Pages: bookable service slugs wrongly under /pages → /services ——
      {
        source: "/pages/emergency-response-24-7",
        destination: "/services/emergency-response-247",
        permanent: true,
      },
      {
        source: "/pages/electrical-installation-condition-report-eicr",
        destination: "/services/electrical-installation-condition-report-eicr",
        permanent: true,
      },
      {
        source: "/pages/portable-appliance-testing-pat",
        destination: "/services/portable-appliance-testing-pat",
        permanent: true,
      },
      {
        source: "/pages/fire-alarm-inspection-and-testing",
        destination: "/services/fire-alarm-inspection-testing",
        permanent: true,
      },
      {
        source: "/pages/fire-alarm-inspection-testing",
        destination: "/services/fire-alarm-inspection-testing",
        permanent: true,
      },
      {
        source: "/pages/domestic-electrical-fault-investigation",
        destination: "/services/domestic-electrical-fault-investigation",
        permanent: true,
      },
      {
        source: "/pages/fuse-box-consumer-unit-replacement",
        destination: "/services/fuse-box-consumer-unit-replacement",
        permanent: true,
      },
      {
        source: "/pages/socket-replacement",
        destination: "/services/socket-replacment",
        permanent: true,
      },
      {
        source: "/pages/emergency-lighting-periodic-inspection-and-testing",
        destination: "/services/emergency-lighting-periodic-inspection-testing-certificate",
        permanent: true,
      },
      {
        source: "/pages/domestic-electrician",
        destination: "/services/domestic-electrical-fault-investigation",
        permanent: true,
      },
      {
        source: "/pages/eicr-nottingham",
        destination: "/services/electrical-installation-condition-report-eicr",
        permanent: true,
      },

      // —— Missing image assets → existing public files ——
      {
        source: "/og-image.jpg",
        destination: "/featured/emergency-24.jpg",
        permanent: false,
      },
      {
        source: "/about/journey.jpg",
        destination: "/featured/emergency-24.jpg",
        permanent: false,
      },
      {
        source: "/assets/urgent_electrical_logo.svg",
        destination: "/logo.jpg",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
