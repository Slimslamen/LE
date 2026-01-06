"use client";

import Image from "next/image";
import { useEffect } from "react";

type BundleItem = {
  id: string | number;
  name: string;
};

type Bundle = {
  icon: string;
  name: string;
  blurb: string;
  basePrice: number | string;
  maxItems: number;
  items: BundleItem[];
};

interface ShopCardsProps {
  bundle: Bundle;
  onSelect: () => void;
}

export default function ShopCards({ bundle, onSelect }: ShopCardsProps) {
  useEffect(() => {
    console.log(bundle.icon);
  }, []);

  return (
    <div
      className={`${
        bundle.name === "Standardpaket" ? "outline-[#66BEF0] outline-1" : ""
      } bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col 2xl:h-[30rem] h-[30rem]`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="relative w-12 h-12 rounded-xl bg-[#66BEF0] flex items-center justify-center">
          <Image
            src={bundle.icon}
            alt="Ficon"
            width={24}
            height={24}
            loading="lazy"
            className="w-8 h-8 absolute top-2 right-1"
          />
        </span>
        <h2 className="text-2xl font-semibold text-gray-900">{bundle.name}</h2>
      </div>

      <p className="text-gray-600 mb-6">{bundle.blurb}</p>

      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900">från {bundle.basePrice} kr</div>
        <div className="text-sm text-gray-500">inkl. grundinstallation • upp till {bundle.maxItems} val</div>
      </div>

      <ul className="text-sm text-gray-700 space-y-2 mb-6">
        {bundle.items.slice(0, 3).map((it) => (
          <li key={it.id} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66BEF0]" aria-hidden="true" />
            {it.name}
          </li>
        ))}
        {bundle.items.length > 3 && <li className="text-gray-500">… och fler val i konfiguratorn</li>}
      </ul>

      <div className="mt-auto">
        <button
          onClick={onSelect}
          className="w-full bg-[#66BEF0] text-white py-3 rounded-lg font-semibold hover:bg-[#22aeff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#66BEF0] focus:ring-offset-2 focus:ring-offset-white"
          aria-label={`Anpassa ${bundle.name}`}
        >
          Anpassa paket
        </button>
      </div>
    </div>
  );
}
