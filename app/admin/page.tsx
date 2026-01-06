"use client";

import SecondHeader from "../../components/SeconHeader";
import Footer from "../../components/Footer";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSupabase } from "../../Context/supabaseContext";
export default function AdminPage() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signInWithPassword } = useSupabase();

  return (
    <div>
      <SecondHeader />
      <div className="h-[70vh] md:h-[80vh] 2xl:h-[80vh] bg-white">
        <link rel="canonical" href="https://lavinelektriska.se/admin" />

        {/* Hero */}
        <section className="bg-linear-to-br from-[#66BEF0] to-[#4A90E2] py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-white/90 max-w-2xl">Ange din e‑post och ditt lösenord för att fortsätta.</p>
          </div>
        </section>

        {/* Login Form */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);

                  const { error } = await signInWithPassword(email, password);

                  if (error) {
                    setError(error.message);
                    setLoading(false);
                    return;
                  }
                  setLoading(false);
                  router.push("/");
                }}
                aria-label="Admin inloggningsformulär"
              >
                <div className="space-y-4">
                  <label className="block" htmlFor="email">
                    <span className="text-sm text-gray-700">E‑post</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="w-9 h-9 rounded-md bg-[#66BEF0]/10 flex items-center justify-center">
                        <Image
                          width={24}
                          height={24}
                          src="/svg/mail-blue-svgrepo-com.svg"
                          loading="lazy"
                          alt="mail logotyp"
                          className="w-6 h-6"
                        />
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#66BEF0]"
                        placeholder="namn@exempel.se"
                      />
                    </div>
                  </label>

                  <label className="block" htmlFor="password">
                    <span className="text-sm text-gray-700">Lösenord</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="w-9 h-9 rounded-md bg-[#66BEF0]/10 flex items-center justify-center">
                        <Image
                          width={24}
                          height={24}
                          src="/svg/lock-svgrepo-com.svg"
                          loading="lazy"
                          alt="lock logotyp"
                          className="w-6 h-6"
                        />
                      </span>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#66BEF0]"
                        placeholder="••••••••"
                      />
                    </div>
                  </label>

                  {error && (
                    <div className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-md bg-[#66BEF0] text-white px-3 py-2 font-medium hover:bg-[#5aa8d4] transition"
                    disabled={loading}
                  >
                    {loading ? "Loggar in…" : "Logga in"}
                  </button>

                  {/* <div className="text-center">
                    <a href="#" className="text-sm text-gray-600 hover:text-[#66BEF0]">
                      Glömt lösenord?
                    </a>
                  </div> */}
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
