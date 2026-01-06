"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const { textsMap } = useSupabase()

  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  type SectionId = "home" | "services" | "about" | "FAQ" | "CTA";

  type AnchorClickEvent = React.MouseEvent<HTMLAnchorElement>;

  const scrollToSection = (e: AnchorClickEvent, id: SectionId): void => {
    e.preventDefault();
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
      const y: number = element.getBoundingClientRect().top + window.pageYOffset - 60; // 60px offset
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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
      <div className="container mx-auto">
        {/* Main navigation */}
        <nav className="hidden sm:block" aria-label="Huvudnavigation">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="md:w-52 mr-5">
                <h1 className="text-[#66BEF0] archivo-black-regular md:block">
                  LAVIN
                </h1>
              </div>
              <div className="md:w-40 mt-2 rounded-lg flex items-center justify-center md:ml-0">
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
                  ELEKTRISKA
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center text-center" role="navigation" aria-label="Sekundär navigation">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, "home")}
                className="text-gray-900 hover:text-[#66BEF0] transition-colors"
                tabIndex={0}
              >
                Hem
              </a>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="text-gray-900 hover:text-[#66BEF0] transition-colors"
                tabIndex={0}
              >
                Tjänster
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
                className="text-gray-900 hover:text-[#66BEF0] transition-colors"
                tabIndex={0}
              >
                Erfarenhet
              </a>
              <a
                href="#FAQ"
                onClick={(e) => scrollToSection(e, "FAQ")}
                className="text-gray-900 hover:text-[#66BEF0] transition-colors"
                tabIndex={0}
              >
                FAQ
              </a>
              <a
                href="#CTA"
                onClick={(e) => scrollToSection(e, "CTA")}
                className="text-gray-900 hover:text-[#66BEF0] transition-colors"
                tabIndex={0}
              >
                Kontakt
              </a>
              {/* <Link href="/Shop" id='ShopBtn' className="text-white hover:scale-95 transition-all duration-300 transform bg-[#66BEF0] py-1 rounded-lg ml-5" tabIndex="0">
                Shop
              </Link> */}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
