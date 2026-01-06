"use client";

import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";
import EditableImage from "./AdminEdit/EditableImage";
import Image from "next/image";
// import { MoneySend, TruckFast } from "iconsax-astro";

const Hero = () => {
  const { textsMap, imagesMap } = useSupabase();

  const heroBg = imagesMap?.hero_background ?? "";
  return (
    <section id="home" className="relative min-h-screen overflow-hidden" aria-label="Startsida hero">
      {/* Responsive background image without LQIP */}
      <div
        className="absolute inset-0 w-full h-full max-w-full bg-linear-to-br from-slate-900 via-slate-800 to-[#66BEF0]"
        aria-hidden="true"
      >
        <EditableImage
          imageKey="hero_background"
          value={heroBg}
          alt="auto"
          fill
          priority="eager"
          sizes="45rem"
          className="object-cover object-center"
          editButtonClassName="w-40 absolute right-10"
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/30 pointer-events-none z-0" aria-hidden="true" />
        <div className="absolute inset-0 bg-linear-to-t from-[#66BEF0]/20 to-transparent pointer-events-none z-0" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-fade-in text-white">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              {/* <EditableText
                textKey="hero_title_line1"
                value={textsMap?.hero_title_line1}
                fallback="Lavin Elektriska AB"
                textClassName="bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent"
                width="15rem"
              /> */}
              <br />
              <EditableText
                textKey="hero_title_line2"
                value={textsMap?.hero_title_line2}
                fallback="Din pålitliga elpartner"
                textClassName="sm:h-18 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent"
                width="15rem"
              />
            </h1>
            <div className="space-y-6 mb-8 text-lg">
              <p className="text-gray-200 leading-relaxed">
                <EditableText textKey="hero_p1" value={textsMap?.hero_p1} fallback="Text laddar..." width="35rem" />
              </p>
              <p className="text-gray-300 leading-relaxed">
                <EditableText textKey="hero_p2" value={textsMap?.hero_p2} fallback="Text laddar..." width="35rem" />
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#CTA"
                id="Offert"
                className="border-2 text-center bg-[#66BEF0] border-[#66BEF0] text-white backdrop-blur-sm px-8 py-3 rounded-xl text-lg font-semibold hover:text-white transform hover:scale-95 transition-all duration-300 hover:shadow-lg"
                aria-label="Få gratis offert"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("CTA");
                  if (element) {
                    const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                <EditableText textKey="hero_cta" value={textsMap?.hero_cta} fallback="Gratis offert" />
              </a>
            </div>
            <div className="smallerbox grid grid-cols-1 sm:grid-cols-3 gap-4 smallerBox" aria-label="Företagsfördelar">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <Image
                  width={32}
                  height={32}
                  src="/svg/checkCircle.svg"
                  alt="check circle icon"
                  loading="eager"
                  className="w-6 h-6"
                />
                <span className="text-sm font-medium">
                  <EditableText
                    textKey="hero_feature1_title"
                    value={textsMap?.hero_feature1_title}
                    fallback="Elinstallationer"
                  />
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <Image
                  width={32}
                  height={32}
                  src="/svg/checkCircle.svg"
                  alt="check circle icon"
                  loading="eager"
                  className="w-6 h-6"
                />
                <span className="text-sm font-medium">
                  <EditableText
                    textKey="hero_feature2_title"
                    value={textsMap?.hero_feature2_title}
                    fallback="Renoveringar"
                  />
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <Image
                  width={32}
                  height={32}
                  src="/svg/checkCircle.svg"
                  alt="check circle icon"
                  loading="eager"
                  className="w-6 h-6"
                />
                <span className="text-sm font-medium">
                  <EditableText
                    textKey="hero_feature3_title"
                    value={textsMap?.hero_feature3_title}
                    fallback="Nyproduktioner"
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="animate-fade-in lg:block">
            <div
              className="bg-white/10 backdrop-blur-2xl p-8 rounded-2xl border border-white/20 shadow-2xl"
              aria-label="Varför välja oss?"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                <EditableText
                  textKey="hero_right_title"
                  value={textsMap?.hero_right_title}
                  fallback="Varför välja oss?"
                />
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#66BEF0] rounded-lg flex items-center justify-center">
                    {/* <TruckFast size={27} color="#ffff" /> */}
                    <Image
                      width={32}
                      height={32}
                      src="/svg/truck-speed-svgrepo-com.svg"
                      alt="truck speed icon"
                      className="w-10 h-10"
                      loading="eager"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      <EditableText
                        textKey="hero_right_item1_title"
                        value={textsMap?.hero_right_item1_title}
                        fallback="Snabb respons"
                      />
                    </p>
                    <p className="text-gray-300 text-sm">
                      <EditableText
                        textKey="hero_right_item1_sub"
                        value={textsMap?.hero_right_item1_sub}
                        fallback="Svarar inom 24 timmar"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#66BEF0] rounded-lg flex items-center justify-center">
                    <Image
                      width={32}
                      height={32}
                      src="/svg/money-send-svgrepo-com.svg"
                      alt="Money send icon"
                      className="w-10 h-10"
                      loading="eager"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      <EditableText
                        textKey="hero_right_item2_title"
                        value={textsMap?.hero_right_item2_title}
                        fallback="Transparent prissättning"
                      />
                    </p>
                    <p className="text-gray-300 text-sm">
                      <EditableText
                        textKey="hero_right_item2_sub"
                        value={textsMap?.hero_right_item2_sub}
                        fallback="Inga dolda kostnader"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#66BEF0] rounded-lg flex items-center justify-center">
                    <Image
                      width={32}
                      height={32}
                      src="/svg/list-checks-svgrepo-com.svg"
                      alt="list checks icon"
                      className="w-10 h-10"
                      loading="eager"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      <EditableText
                        textKey="hero_right_item3_title"
                        value={textsMap?.hero_right_item3_title}
                        fallback="Kvalitetsgaranti"
                      />
                    </p>
                    <p className="text-gray-300 text-sm">
                      <EditableText
                        textKey="hero_right_item3_sub"
                        value={textsMap?.hero_right_item3_sub}
                        fallback="Garanti på allt arbete"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
