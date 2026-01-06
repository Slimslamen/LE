"use client";

import { useState } from "react";
import Contact from "./Contact";
import Image from "next/image";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";

const CTA = () => {
  const [showContact, setShowContact] = useState(false);
  const { textsMap } = useSupabase();

  return (
    <section
      id="CTA"
      className="py-20 bg-linear-to-r from-[#66BEF0] to-[#4A90E2] relative overflow-hidden"
      aria-label="Call to Action"
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20" aria-hidden="true" />
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <EditableText
              width="20rem"
              textKey="cta_heading"
              value={textsMap?.cta_heading}
              fallback="Redo att lösa dina elproblem?"
            />
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            <EditableText
              width="30rem"
              textKey="cta_subheading"
              value={textsMap?.cta_subheading}
              fallback="Kontakta oss idag för gratis konsultation och kostnadsförslag. Vi finns här för att hjälpa dig med alla dina elektriska behov."
            />
          </p>
        </div>

        <div className={`grid md:grid-cols-2 gap-6 max-w-4xl ${showContact ? "-my-10" : ""} mx-auto`}>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
            <div
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <Image
                src="/svg/message-square-svgrepo-com.svg"
                alt="message icon"
                width={24}
                height={24}
                loading="lazy"
                className="w-10 h-10"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              <EditableText
                textKey="cta_card_message_title"
                value={textsMap?.cta_card_message_title}
                fallback="Skicka meddelande"
              />
            </h3>
            <p className="text-blue-100 mb-4">
              <EditableText
                textKey="cta_card_message_subtitle"
                value={textsMap?.cta_card_message_subtitle}
                fallback="Vi svarar vanligtvis inom 24 timmar"
              />
            </p>
            <div
              id="sendMessage"
              role="button"
              tabIndex={0}
              onClick={() => setShowContact(!showContact)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowContact(!showContact);
                }
              }}
              className="bg-[#66BEF0] text-white px-6 py-3 rounded-lg font-semibold inline-block cursor-pointer"
              aria-label="Skicka e-post"
              aria-expanded={showContact}
            >
              <EditableText
                textKey="cta_card_message_button"
                value={textsMap?.cta_card_message_button}
                fallback="Skicka e-post"
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
            <div
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <Image
                src="/svg/phone-svgrepo-com.svg"
                alt="phone icon"
                width={24}
                height={24}
                loading="lazy"
                className="w-10 h-10"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              <EditableText textKey="cta_card_call_title" value={textsMap?.cta_card_call_title} fallback="Ring" />
            </h3>
            <p className="text-blue-100 mb-4">
              <EditableText
                textKey="cta_card_call_subtitle"
                value={textsMap?.cta_card_call_subtitle}
                fallback="Gratis konsultation"
              />
            </p>
            <a
              id="CallPhone"
              href="tel:+46729110256"
              className="bg-[#66BEF0] text-white px-6 py-3 rounded-lg font-semibold inline-block"
              aria-label="Ring +46729110256"
            >
              <EditableText
                textKey="cta_card_call_button"
                value={textsMap?.cta_card_call_button}
                fallback="Ring +46729110256"
              />
            </a>
          </div>
        </div>
        <Contact showContent={showContact} />
      </div>
    </section>
  );
};

export default CTA;
