import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rdxehpbrxxthyodnmrek.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/gallery/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
