import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { '@libsql/client': '@libsql/client' }];
    return config;
  },
};

export default nextConfig;
