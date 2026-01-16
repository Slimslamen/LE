"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";
import Link from "next/link";

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { textsMap } = useSupabase();

  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  type SectionId = "home" | "services" | "about" | "FAQ" | "CTA";

  type AnchorClickEvent = React.MouseEvent<HTMLAnchorElement>;

  const scrollToSection = (e: AnchorClickEvent, id: SectionId): void => {
    e.preventDefault();
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
      const y: number = element.getBoundingClientRect().top + window.pageYOffset - -80; // 60px offset
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

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`bg-transparent md:bg-white shadow-sm sticky top-0 z-50 transform transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
      role="banner"
    >
      <div className="container mx-auto">
        {/* Main navigation */}
        <nav className=" bg-transparent sm:block" aria-label="Huvudnavigation">
          <div className="bg-white relative h-28 sm:h-auto flex items-center justify-between">
            <div className="sm:flex items-center">
              <div className="md:w-52 mr-5">
                <h1 className="text-[#66BEF0] archivo-black-regular hidden md:block">LAVIN</h1>
              </div>
              <div className="absolute top-5 sm:top-0 sm:relative w-32 h-20 md:w-40 md:h-40 rounded-lg sm:flex sm:items-center sm:justify-center md:ml-0">
                <Image
                  src="/Images/Logo/LE.png"
                  alt="Lavin Elektriska logotyp"
                  fill
                  quality={100}
                  fetchPriority="high"
                  priority
                  className="rounded-[80px] mb-2 object-contain"
                />
              </div>
                {/* <button
                  type="button"
                  className="absolute right-5 top-10 hamBtn bg-[#66BEF0] h-10 w-20 rounded-lg md:hidden block items-center justify-center text-white"
                  aria-label="Öppna meny"
                  aria-controls="mobile-menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button> */}
              <div className="ml-5">
                <h1 className="text-[#66BEF0] archivo-black-regular hidden md:block">ELEKTRISKA</h1>
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

      {/* Mobile slide-in menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[1000] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
 

        {/* Panel */}
        <div
          className={`absolute inset-0 bg-white shadow-xl border-l border-slate-200
            transition-transform duration-400 ease-out ${menuOpen ? "translate-x-0" : ""}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white pb-10 rounded-br-lg rounded-bl-lg">
            <div className="flex items-center justify-between py-10 px-5 border-b border-slate-200">
              <button
                type="button"
                className="absolute top-5 right-5 inline-flex items-center w-20 justify-center text-white rounded-lg"
                aria-label="Stäng meny"
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-bold text-xl">X</span>
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-4 bg-white" aria-label="Mobil navigation">
              <Link href={"./shop"}>Shop</Link>
              <Link href={"./policy"}>Sekretess policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
