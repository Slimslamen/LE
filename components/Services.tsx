"use client";
import EditableImage from "./AdminEdit/EditableImage";
import { useEffect, useState } from "react";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";

interface Service {
  id: number;
  title: string;
  image: string;
  description: string;
}

const Services = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { textsMap, imagesMap } = useSupabase();

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.matchMedia("(max-width: 850px)").matches);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const services: Service[] = [
    {
      id: 1,
      title: "Laddstolpar",
      image: imagesMap?.["services_background_pic_1"] ?? "",
      description:
        "Noggrant utförda installationer av laddstolpar gör det enkelt att ladda elbilen snabbt, säkert och hållbart.",
    },
    {
      id: 2,
      title: "Byggström",
      image: imagesMap?.["services_background_pic_2"] ?? "",
      description:
        "Tillfälliga och säkra elinstallationer för byggarbetsplatser, anpassade efter projektets behov och gällande krav.",
    },
    {
      id: 3,
      title: "Elbesiktning",
      image: imagesMap?.["services_background_pic_3"] ?? "",
      description:
        "Noggrann elbesiktning som säkerställer att installationer uppfyller gällande säkerhetskrav och fungerar som de ska.",
    },
    {
      id: 4,
      title: "Felsökningar",
      image: imagesMap?.["services_background_pic_4"] ?? "",
      description:
        "Professionell felsökning och reparation av ditt elsystem, inklusive åtgärd av kortslutningar, strömavbrott och andra elektriska fel.",
    },
    {
      id: 5,
      title: "Konsultation",
      image: imagesMap?.["services_background_pic_5"] ?? "",
      description:
        "Rådgivning och planering för trygga, effektiva och hållbara el-lösningar anpassade efter dina behov.",
    },
    {
      id: 6,
      title: "Elinstallationer",
      image: imagesMap?.["services_background_pic_6"] ?? "",
      description:
        "Dina elinstallationer uppdateras med den senaste tekniken och moderna lösningar för bästa resultat, anpassat för just dina behov och din vardag.",
    },
  ];

  const handleCardClick = (id: number): void => {
    if (!isMobile) return; // Only allow toggle on mobile
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div id="services" className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-5 sm:px-0 pt-8 pb-40">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <EditableText textKey="services_heading" value={textsMap?.services_heading} fallback="Våra tjänster" />
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            <EditableText
              textKey="services_subheading"
              value={textsMap?.services_subheading}
              fallback="Från enkla reparationer till komplexa installationer erbjuder vi omfattande elektriska tjänster för bostäder och kommersiella fastigheter."
              width="30rem"
            />
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:gap-20 gap-8 justify-items-center content">
          {services.slice(0, 65).map((service) => (
            <div
              key={service.id}
              onClick={() => handleCardClick(service.id)}
              onKeyDown={(e) => {
                if (!isMobile) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(service.id);
                }
              }}
              data-expanded={isMobile && expandedCard === service.id}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : -1}
              aria-disabled={!isMobile}
              className={`group relative h-96 md:w-[65vh] 2xl:w-[45vh] rounded-2xl overflow-hidden cursor-pointer md:cursor-default shadow-lg transition-all duration-500 ease-out
                ${isMobile && expandedCard === service.id ? "h-160 z-50 md:h-96" : ""}
                md:hover:w-[120%] md:hover:z-50
                  `}
            >
              {/* Background Image (Editable for admins) */}
              <EditableImage
                imageKey={`services_background_pic_${service.id}`}
                value={service.image}
                alt="auto"
                fill
                priority="eager"
                className="absolute inset-0 w-full h-full object-cover"
                editButtonClassName="w-40 absolute right-10"
              />

              {/* Overlay with blur */}
              <div
                className={`absolute inset-0 transition-all duration-500
                ${
                  isMobile && expandedCard === service.id
                    ? "bg-black/20 backdrop-blur-none"
                    : "bg-black/40 backdrop-blur-sm"
                }
                md:hover:backdrop-blur-none md:hover:bg-black/20
              `}
              />

              {/* Hover/Active Description */}
              <p
                className={`absolute left-6 right-6 bottom-20 text-white/95 text-lg md:text-base leading-snug transition-all duration-300 w-5/6
                ${isMobile && expandedCard === service.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                md:group-hover:opacity-100 md:group-hover:translate-y-0`}
              >
                <EditableText
                  textKey={`services_item${service.id}_desc`}
                  value={textsMap?.[`services_item${service.id}_desc`]}
                  fallback={service.description}
                  width={"30rem"}
                />
              </p>

              {/* Title */}
              <div className="absolute bottom-6 left-6 text-white font-semibold text-2xl">
                <EditableText
                  textKey={`services_item${service.id}_title`}
                  value={textsMap?.[`services_item${service.id}_title`]}
                  fallback={service.title}
                  width={"15rem"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
