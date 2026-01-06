"use client";

import { useState } from "react";
import Reveal from "../../components/Reveal";
import ShopBundleConfigurator from "../../components/ShopFolder/ShopBundleConfigurator";
import SecondHeader from "../../components/SeconHeader";
import ShopCards from "../../components/ShopFolder/ShopCards";
import Footer from "../../components/Footer";
import ShopConfirmationModal from "../../components/ShopFolder/ShopConfirmationModal";


const BUNDLES = [
  {
    id: "elinstallationer",
    name: "Elinstallationer",
    icon: "/svg/box-svgrepo-com.svg",
    blurb: "Startpaket för ett rum eller mindre uppgraderingar.",
    basePrice: 1495,
    maxItems: 25,
    items: [
      { id: "panellampa", name: "Led Energie panellampa dimbar infälld montering", price: 2490, image: "/Images/Products/Panellampa.png", description: "12W med 900 lumen och justerbar färgtemperatur (varm, neutral eller kallvitt ljus). Passar bra i kök, hall, kontor och andra rum där du vill ha jämnt och behagligt ljus."},
      { id: "1-vägsuttag", name: "Schneider Exxact Surface 1-vägsuttag UTP", price: 1690, image: "/Images/Products/1-vägsuttag.png", description: "Ett stilrent och robust vägguttag för infällt montage med UTP-anslutning. Passar perfekt för anslutning av nätverksuttag i hem och kontor. Enkel att installera och kompatibel med övriga Exxact-produkter." },
      { id: "2-vägsuttag", name: "Schneider Exxact Surface 2-vägsuttag UTP", price: 1290, image: "/Images/Products/2-vägsuttag.png", description: "Ett praktiskt vägguttag med två UTP-portar för nätverksanslutning. Stilren design och enkel installation gör det perfekt för hem, kontor eller andra utrymmen där du behöver ansluta flera nätverksenheter." },
      { id: "DIM-01", name: "Plejd Universaldimmer Bluetooth DIM-01", price: 690, image: "/Images/Products/DIM-01.png", description: "En smart och flexibel dimmer som styr dina lampor via Bluetooth. Passar många typer av belysning och gör det enkelt att justera ljusstyrkan direkt i mobilen eller med befintliga knappar. Perfekt för att skapa rätt stämning hemma eller på jobbet." },
      { id: "DIM-02", name: "Plejd Universaldimmer Bluetooth DIM-02", price: 1290, image: "/Images/Products/DIM-02.png", description: "En smart dimmer som styr belysning trådlöst via Bluetooth. Passar många olika lampor och gör det enkelt att justera ljuset med mobilen eller befintliga omkopplare. Perfekt för att skapa rätt ljus i hemmet eller arbetsplatsen." },
      { id: "1-vägs", name: "Schneider Exxact Vägguttag 1-vägs", price: 1890, image: "/Images/Products/1-vägs.png", description: "Ett stilrent och lättmonterat vägguttag med en uttagsplats. Passar för standard elkontakter i hem, kontor eller andra utrymmen. Enkel att installera och kompatibel med övriga Exxact-moduler." },
      { id: "2-vägs", name: "Schneider Exxact Vägguttag 2-vägs", price: 1490, image: "/Images/Products/2-vägs.png", description: "Ett stilrent och lättmonterat vägguttag med två uttagsplatser för elkontakter. Passar perfekt i hem, kontor eller andra utrymmen där du behöver flera eluttag. Enkel installation och kompatibel med övriga Exxact-moduler." },
      { id: "Strömställare", name: "Schneider Exxact Primo Strömställare Kron komplett", price: 1290, image: "/Images/Products/Strömställare.png", description: "En komplett och stilren dubbel strömbrytare för kontroll av två olika ljuskällor eller kretsar. Passar i hem och kontor, lätt att installera och ger pålitlig funktion för din belysning. Enkel design som passar de flesta miljöer." },
      { id: "Strömställare2", name: "Schneider Exxact Primo Strömställare Trapp Komplett", price: 1890, image: "/Images/Products/Strömställare.png", description: "?" },
      { id: "Dimmer", name: "Plejd Smart Plug Dimmer", price: 1490, image: "/Images/Products/Dimmer.png", description: "?" },
    ],
  },
  // {
  //   id: "Elbesiktning",
  //   name: "Elbesiktning",
  //   icon: "/svg/shield-svgrepo-com.svg",
  //   blurb: "Besikta ditt hus eller anläggning",
  //   basePrice: 3495,
  //   maxItems: 0,
  //   items: [],
  // },
  {
    id: "Laddboxar",
    name: "Laddboxar",
    icon: "/svg/zap-svgrepo-com.svg",
    blurb: "För full uppgradering och toppmodern bekvämlighet.",
    basePrice: 7495,
    maxItems: 3,
    items: [
      { id: "led-pack", name: "LED-lampor (4-pack)", price: 249, description: "test8" },
      { id: "smart-outlet", name: "Smart vägguttag", price: 399, description: "test9" },
      { id: "dimmer", name: "Dimmer-brytare", price: 349, description: "test10" },
      { id: "smoke-detector", name: "Brandvarnare", price: 299, description: "test11" },
      { id: "surge", name: "Överspänningsskydd", price: 199, description: "test12" },
    ],
  },
];

export default function Shop() {
  const [activeBundle, setActiveBundle] = useState<(typeof BUNDLES)[number] | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div>
      <SecondHeader />
      <div className="static h-[90rem]  md:h-[60rem] pb-20 bg-lineaer-to-br from-gray-50 to-blue-50">
        <div className="Moviebg relative min-h-[20rem] md:min-h-[35rem] mb-12 overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/Videos/Working.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />

          <Reveal className="relative z-10">
            <header className="text-center px-4 py-12 md:py-20">
              <h1 className="text-4xl font-bold text-gray-50 drop-shadow mb-3">Välj paket och anpassa</h1>
              <p className="text-gray-100/90 max-w-2xl mx-auto drop-shadow">
                Tre färdiga el‑paket som du kan skräddarsy med valfria produkter. Perfekt för att planera en offert.
              </p>
            </header>
          </Reveal>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-[28rem] max-w-7xl w-full px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {BUNDLES.map((b) => (
              <Reveal key={b.id}>
                <ShopCards bundle={b} onSelect={() => setActiveBundle(b)} />
              </Reveal>
            ))}
          </div>
        </div>

        {activeBundle && (
          <ShopBundleConfigurator
            bundle={activeBundle}
            onClose={() => setActiveBundle(null)}
            onRequestQuote={() => {
              setShowConfirmation(true);
            }}
          />
        )}
      </div>
      {showConfirmation && <ShopConfirmationModal onClose={() => setShowConfirmation(false)} />}
      <Footer />
    </div>
  );
}
