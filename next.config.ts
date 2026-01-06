import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cache optimized images for 1 hour
    minimumCacheTTL: 60 * 60,
    remotePatterns: (() => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        try {
          const hostname = new URL(supabaseUrl).hostname;
          return [
            {
              protocol: "https" as const,
              hostname,
              pathname: "/storage/v1/object/public/**",
            },
            {
              protocol: "https" as const,
              hostname,
              pathname: "/storage/v1/object/sign/**",
            },
          ];
        } catch {
          // fall through
        }
      }

      // fallback (works for standard Supabase project URLs)
      return [
        {
          protocol: "https" as const,
          hostname: "**.supabase.co",
          pathname: "/storage/v1/object/**",
        },
      ];
    })(),
  },
};

export default nextConfig;
