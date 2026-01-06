"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import EditableText from "./AdminEdit/EditableText";
import { useSupabase } from "@/Context/supabaseContext";

const Header = () => {
  const { textsMap } = useSupabase()
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // if scrolling down and passed threshold -> hide
          if (currentY > lastScrollY.current && currentY > 100) {
            setHidden(true);
          } else if (currentY < lastScrollY.current) {
            // scrolling up -> show
            setHidden(false);
          }
          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-white shadow-sm sticky top-0 z-50 transform transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        {/* Main navigation */}
        <nav className="" aria-label="Huvudnavigation">
          <Link href="/" className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="md:w-52 mr-[-7px]">
                <h1 className="text-[#66BEF0] archivo-black-regular md:block">
                  <EditableText
                    textKey="header_lavin"
                    value={textsMap?.header_lavin}
                    fallback="LAVIN"
                    width={"10rem"}
                  />
                </h1>
              </div>
              <div className="w-50 md:w-30 mt-2 rounded-lg flex items-center justify-center ml-8 md:ml-0">
                <Image
                  width={500}
                  height={500}
                  src="/Images/Logo/LE.png"
                  alt="Lavin Elektriska logotyp"
                  loading="eager"
                  className="rounded-[80px] mb-2"
                />
              </div>
              <div className="ml-5">
                <h1 className="text-[#66BEF0] archivo-black-regular md:block">
                  <EditableText
                    textKey="header_elektriska"
                    value={textsMap?.header_elektriska}
                    fallback="ELEKTRISKA"
                    width={"10rem"}
                  />
                </h1>
              </div>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
