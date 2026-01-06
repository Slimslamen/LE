"use client";

import Image from "next/image";
import { useState } from "react";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { textsMap, isAdmin } = useSupabase();

  const faqs = [
    {
      id: 1,
      question: "Hur lång tid tar en typisk elinstallation?",
      answer1:
        "Tiden beror på uppdragets omfattning. Ett enklare jobb, som att installera ett eluttag eller byta en strömbrytare, tar oftast 1–2 timmar.",
      answer2:
        "Större projekt som en komplett eldragning i en villa eller lokal kan ta allt från ett par dagar till flera veckor, beroende på storlek, tillgänglighet och kundens önskemål. Vi ger alltid en tydlig tidsuppskattning innan vi sätter igång, så du vet vad du kan förvänta dig.",
    },
    {
      id: 2,
      question: "Hur mycket kostar en elektriker per timme?",
      answer1:
        "Timpriset för en elektriker efter ROT-avdrag ligger vanligtvis på 500–700 kr per timme. Priset kan variera något beroende på arbetets omfattning, region och typ av uppdrag. För akuta jobb eller jourarbeten kan timpriset vara högre.",
      answer2: "Du får alltid tydliga priser innan arbetet startar, så du vet exakt vad du betalar för.",
    },
    {
      id: 3,
      question: "Hur kan jag sänka min elförbrukning?",
      answer1: "Med rätt elinstallationer kan du spara både energi och pengar – utan att tumma på komforten:",
      answer2:
        "Byt till LED-belysning för att minska elförbrukningen.;Använd rörelsesensorer i rum som sällan används.;Installera smarta termostater för att styra värmen mer effektivt.;Använd smarta uttag och timers för att stänga av apparater automatiskt och minska onödig standbyförbrukning.",
    },
    {
      id: 4,
      question: "Är det billigare med ROT-avdrag?",
      answer1:
        " Ja, och under 2025 är det ännu mer fördelaktigt! ROT-avdraget är tillfälligt höjt till 50 % av arbetskostnaden för arbeten som betalas mellan 12 maj och 31 december 2025. Det gäller de flesta elarbeten hemma – från uttag och belysning till laddboxar och elrenoveringar.",
      answer2:
        "Exempel: Arbetskostnad: 7 500 kr;ROT-avdrag (50 %): – 3 750 kr.; Du betalar: 3 750 kr.;ROT-ansökan hanteras åt dig, och avdraget syns direkt på fakturan.",
    },
    {
      id: 5,
      question: "Hur vet jag att ert företag är godkänt och arbetar säkert?",
      answer1:
        "Ja, vi är fullständigt auktoriserade av Elsäkerhetsverket och har omfattande ansvarsförsäkring. All vårt arbete följer svenska elkoder och säkerhetsbestämmelser.",
      answer2: "Du kan enkelt kontrollera vår registrering direkt på elsäkerhetsverket hemsida.",
    },
    {
      id: 6,
      question: "Vilka elarbeten får jag göra själv i hemmet?",
      answer1:
        "Som privatperson får du göra vissa enklare elarbeten själv, men bara om du har kunskap och gör det säkert. Till exempel får du:",
      answer2:
        "Byta glödlampor och lamphållare;Byta porslinssäkringar eller återställa en automatsäkring;Montera skarvsladdar;Byta stickproppar eller sladdströmbrytare;Repara trasiga skarv- och apparatsladdar;Byta ett befintligt vägguttag eller en strömbrytare (max 16 A) - Kom ihåg att alltid bryta strömmen innan du börjar och kontrollera ditt arbete. Är du minsta osäker – kontakta en behörig elektriker.",
    },
    {
      id: 7,
      question: "Ger ni garanti på ert arbete?",
      answer1:
        "Ja, vi ger full garanti på allt vårt arbete och använder endast kvalitetsmaterial från välkända tillverkare. Garantitiden varierar beroende på typ av installation.",
      answer2: "",
    },
    {
      id: 8,
      question: "Vad händer om elen är felkopplad?",
      answer1:
        "En felkopplad elinstallation kan orsaka kortslutning, elchock och i värsta fall brand. Därför är det avgörande att fasta installationer alltid utförs av en behörig elektriker. Då får du en säker anläggning som uppfyller både Elsäkerhetsverkets regler och försäkringsbolagens krav.",
      answer2:
        "Visste du att varje år omkommer 2–3 personer i Sverige till följd av elolyckor, och att hundratals skadas? Många av dessa olyckor sker i hemmet och anmäls aldrig, ofta på grund av felaktiga eller osäkra installationer",
    },
    {
      id: 9,
      question: "Kan ni hjälpa till med elbesiktning?",
      answer1:
        "Ja, vi utför professionella elbesiktningar för både bostäder och kommersiella fastigheter. Vi hjälper er att identifiera potentiella problem och säkerställa att er installation möter alla säkerhetskrav.",
      answer2: "",
    },
    {
      id: 10,
      question: "Vad kostar en laddstolpeinstallation?",
      answer1:
        "Kostnaden varierar beroende på typ av laddstolpe, elcentralens placering och eventuella uppgraderingar som behövs. Vi erbjuder gratis kostnadsförslag för alla laddstolpeinstallationer.",
      answer2: "",
    },
  ];

  interface ToggleFAQ {
    (index: number): void;
  }

  const toggleFAQ: ToggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50" id="FAQ" aria-label="Vanliga frågor">
      <div className="container mx-auto px-4">
        <div className="HeadContainer text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <EditableText textKey="faq_heading" value={textsMap?.faq_heading} fallback="Vanliga frågor" />
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            <EditableText
              textKey="faq_subheading"
              value={textsMap?.faq_subheading}
              fallback="Här hittar du svar på de mest vanliga frågorna om våra tjänster."
              width="30rem"
            />
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5" role="list">
          {faqs.map((faq, index) => {
            const questionKey = `faq_item${faq.id}_question`;
            const answer1Key = `faq_item${faq.id}_answer1`;
            const answer2Key = `faq_item${faq.id}_answer2`;

            const questionText = textsMap?.[questionKey] ?? faq.question;
            const answer1Text = textsMap?.[answer1Key] ?? faq.answer1;
            const answer2Text = textsMap?.[answer2Key] ?? faq.answer2;

            return (
              <div key={faq.id} className="mb-4 relative" role="listitem">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleFAQ(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFAQ(index);
                    }
                  }}
                  className="w-full bg-[#66BEF0] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left flex items-center justify-between group cursor-pointer"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                >
                  <h3 className="text-lg font-semibold text-white transition-colors">
                    <EditableText width="25rem" textKey={questionKey} value={textsMap?.[questionKey]} fallback={questionText} />
                  </h3>
                  <div
                    className="w-8 h-8 bg-opacity-10 rounded-lg flex items-center justify-center shrink-0 ml-4"
                    aria-hidden="true"
                  >
                    {openIndex === index ? (
                      <Image
                        src="/svg/minus-svgrepo-com.svg"
                        alt="miuus icon"
                        width={24}
                        height={24}
                        loading="lazy"
                        className="w-8 h-8 absolute top-6 right-6"
                      />
                    ) : (
                      <Image
                        src="/svg/plus-svgrepo-com.svg"
                        alt="plus icon"
                        width={24}
                        height={24}
                        loading="lazy"
                        className="w-8 h-8 absolute top-6 right-6"
                      />
                    )}
                  </div>
                </div>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  aria-hidden={openIndex !== index}
                  className={`bg-white rounded-b-xl shadow-inner text-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-250 opacity-100 p-6" : "max-h-0 opacity-0 p-0"
                  }`}
                >
                  <p>
                    <EditableText width="30rem" textKey={answer1Key} value={textsMap?.[answer1Key]} fallback={answer1Text} />
                  </p>

                  {!isAdmin && answer2Text !== "" && answer2Text.includes(";") ? (
                    <div>
                      <br />
                      <ul className="list-disc pl-6">
                        {answer2Text.split(";").map((item, i) => {
                          const kontaktSplit = item.split(
                            "Byta ett befintligt vägguttag eller en strömbrytare (max 16 A) -"
                          );
                          const ROTSplit = item.split(
                            "ROT-ansökan hanteras åt dig, och avdraget syns direkt på fakturan."
                          );
                          const ElSplit = item.split(
                            "Använd smarta uttag och timers för att stänga av apparater automatiskt och minska onödig standbyförbrukning."
                          );

                          if (kontaktSplit.length > 1) {
                            return (
                              <div key={i}>
                                <li>
                                  {kontaktSplit[0].trim() +
                                    "Byta ett befintligt vägguttag eller en strömbrytare (max 16 A)"}
                                </li>
                                <div className="mt-4" />
                                <p>
                                  <EditableText
                                    width="30rem"
                                    textKey="faq_note_safety"
                                    value={textsMap?.faq_note_safety}
                                    fallback="Kom ihåg att alltid bryta strömmen innan du börjar och kontrollera ditt arbete. Är du minsta osäker, kontakta en behörig elektriker."
                                  />
                                </p>
                              </div>
                            );
                          }

                          if (ROTSplit.length > 1) {
                            return (
                              <div key={i}>
                                <div className="mt-4" />
                                <p>
                                  <EditableText
                                    width="30rem"
                                    textKey="faq_note_rot"
                                    value={textsMap?.faq_note_rot}
                                    fallback="ROT-ansökan hanteras åt dig, och avdraget syns direkt på fakturan. Trygg el och mer pengar kvar i plånboken."
                                  />
                                </p>
                              </div>
                            );
                          }

                          if (ElSplit.length > 1) {
                            return (
                              <div key={i}>
                                <li>
                                  {ElSplit[0].trim() +
                                    "Använd smarta uttag och timers för att stänga av apparater automatiskt och minska onödig standbyförbrukning."}
                                </li>
                                <div className="mt-4" />
                                <p>
                                  <EditableText
                                    width="30rem"
                                    textKey="faq_note_savings"
                                    value={textsMap?.faq_note_savings}
                                    fallback="Små justeringar kan ge stora besparingar, och resultatet syns redan på nästa elräkning."
                                  />
                                </p>
                              </div>
                            );
                          }

                          return <li key={i}>{item}</li>;
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <br />
                      <p>
                        <EditableText width="30rem" textKey={answer2Key} value={textsMap?.[answer2Key]} fallback={answer2Text} />
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
