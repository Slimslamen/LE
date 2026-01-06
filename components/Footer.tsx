"use client";

import Link from "next/link";
import Image from "next/image";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const { textsMap, isAdmin, user, draftTextsMap, draftImagesMap, saveDraftTexts, saveDraftImages, signOut } = useSupabase();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 767);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const hasDrafts = useMemo(() => {
    return Object.keys(draftTextsMap ?? {}).length > 0 || Object.keys(draftImagesMap ?? {}).length > 0;
  }, [draftTextsMap, draftImagesMap]);

  const canSave = isAdmin && !isMobile;

  const onSave = async () => {
    if (!saveDraftTexts && !saveDraftImages) return;
    setIsSaving(true);
    try {
      const [textResult, imageResult] = await Promise.all([
        saveDraftTexts ? saveDraftTexts() : Promise.resolve({ success: true as const, saved: 0 }),
        saveDraftImages ? saveDraftImages() : Promise.resolve({ success: true as const, saved: 0 }),
      ]);

      if (!textResult.success) {
        alert(textResult.error);
        return;
      }
      if (!imageResult.success) {
        alert(imageResult.error);
        return;
      }

      const total = (textResult.saved ?? 0) + (imageResult.saved ?? 0);
      if (total > 0) {
        alert(`Saved ${textResult.saved} text changes and ${imageResult.saved} image changes.`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onSignOut = async () => {
    if (!signOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/admin");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo" aria-label="Sidfot">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="flex items-center gap-2 mb-4" aria-label="Startsida">
              <div className="w-10 h-10 bg-[#66BEF0] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl text-center" aria-hidden="true">
                  LE
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  <EditableText
                    textKey="footer_brand_title"
                    value={textsMap?.footer_brand_title}
                    fallback="Lavin Elektriska"
                  />
                </h3>
                <p className="text-sm text-gray-400">
                  <EditableText
                    textKey="footer_brand_subtitle"
                    value={textsMap?.footer_brand_subtitle}
                    fallback="Auktoriserad & försäkrad"
                  />
                </p>
              </div>
            </span>
            <p className="text-gray-400 leading-relaxed">
              <EditableText
                textKey="footer_brand_description"
                value={textsMap?.footer_brand_description}
                fallback="Professionella elektriska tjänster för bostäder och kommersiella fastigheter. Din pålitliga partner för säkra, tillförlitliga elektriska lösningar."
              />
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              <EditableText
                textKey="footer_contact_heading"
                value={textsMap?.footer_contact_heading}
                fallback="Kontaktinfo"
              />
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/svg/phone-svgrepo-com.svg"
                  alt="phone icon"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-6 h-6"
                />
                <span className="text-gray-400">
                  <EditableText
                    textKey="footer_contact_phone"
                    value={textsMap?.footer_contact_phone}
                    fallback="+46729110256"
                  />
                </span>
              </div>
              <div className="flex items-center gap-3">
                 <Image
                  src="/svg/mail-svgrepo-com.svg"
                  alt="mail icon"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-6 h-6"
                />
                <span className="text-gray-400">
                  <EditableText
                    textKey="footer_contact_email"
                    value={textsMap?.footer_contact_email}
                    fallback="Le@lavinelektriska.se"
                  />
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              <EditableText textKey="footer_follow_heading" value={textsMap?.footer_follow_heading} fallback="Följ oss" />
            </h4>
            <div className="flex gap-4 mb-6">
              <Link
                href="https://www.instagram.com/lavinelektriska/?igsh=Yjk4YzhqYWx5ZXoz#"
                className="w-10 h-10 bg-[#66BEF0] rounded-lg flex items-center justify-center hover:bg-[#5aa8d4] transition-colors"
                aria-label="Instagram"
                rel="noopener noreferrer"
                target="_blank"
              >
               <Image
                  src="/svg/instagram-svgrepo-com.svg"
                  alt="instagram icon"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-6 h-6"
                />
              </Link>
              <Link
                href="https://www.facebook.com/people/Lavin-Elektriska/61555416595421/"
                className="w-10 h-10 bg-[#66BEF0] rounded-lg flex items-center justify-center hover:bg-[#5aa8d4] transition-colors"
                aria-label="Facebook"
                rel="noopener noreferrer"
                target="_blank"
              >
               <Image
                  src="/svg/facebook-176-svgrepo-com.svg"
                  alt="facebook icon"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-6 h-6"
                />
              </Link>
              <Link
                href="https://www.linkedin.com/company/lavin-elektriska/about/"
                className="w-10 h-10 bg-[#66BEF0] rounded-lg flex items-center justify-center hover:bg-[#5aa8d4] transition-colors"
                aria-label="LinkedIn"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image
                  src="/svg/linkedin-svgrepo-com.svg"
                  alt="linkedin icon"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-6 h-6"
                />
              </Link>
            </div>

            <div className="text-center flex flex-row items-center justify-center md:-ml-2.5">
              <Image
                width={24}
                height={24}
                src="/Images/Logo/Elsäkerhetsverket.png"
                loading="lazy"
                alt="Elsäkerhetsverket logotyp"
                className="w-10 h-10"
              />
              <div className="bg-orange-500 text-white py-1 rounded-full text-sm font-semibold inline-block">
                <EditableText
                  textKey="footer_approval_badge"
                  value={textsMap?.footer_approval_badge}
                  fallback="Godkända av: ELSÄKERHETSVERKET"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row md:justify-between justify-center text-center items-center">
          <p className="text-gray-400 flex-col flex text-center md:text-left">
            <EditableText
              textKey="footer_copyright"
              value={textsMap?.footer_copyright}
              fallback="©2026 Lavin Elektriska AB."
            />
            {!!user && (
              <button
                type="button"
                onClick={onSignOut}
                disabled={isSigningOut}
                className="ultimateSave w-96 cursor-pointer mt-3 text-white bg-[#66BEF0] hover:scale-95 duration-300 transition-transform rounded-lg py-1 px-3 disabled:opacity-50"
                aria-label="Sign out"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            )}
          </p>
          <div className="mt-4 md:mt-0">
            <Link
              href="/policy"
              className="text-gray-400 hover:text-[#66BEF0] transition-colors"
              aria-label="Sekretesspolicy"
              >
              <EditableText
                textKey="footer_policy_link"
                value={textsMap?.footer_policy_link}
                fallback="Sekretesspolicy"
                />
            </Link>
                {canSave && (
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving || !hasDrafts}
                    className="ultimateSave w-96 cursor-pointer mt-4 text-white bg-[#66BEF0] hover:scale-95 duration-300 transition-transform rounded-lg py-1 disabled:opacity-50 disabled:hover:text-gray-400"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
