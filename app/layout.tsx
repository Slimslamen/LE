import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/Context/supabaseContext";

export const metadata: Metadata = {
  title: "Lavin Elektriska",
  description: "Lavin Elektriska levererar trygg och kvalitativ elservice. Elinstallationer i gamla och nya fastigheter, plus elkonsultation, med dig i fokus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseHostname = (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      return url ? new URL(url).hostname : null;
    } catch {
      return null;
    }
  })();
  return (
    <html lang="en">
      <head>
        {supabaseHostname && (
          <>
            <link rel="preconnect" href={`https://${supabaseHostname}`}/>
            <link rel="dns-prefetch" href={`//${supabaseHostname}`} />
          </>
        )}
      </head>
      <SupabaseProvider>
        <body>{children}</body>
      </SupabaseProvider>
    </html>
  );
}
