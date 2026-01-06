import Image from "next/image";
import type { BundleConfig } from "../shopInterface";

type CartState = Record<string, number>;

type ItemSelectionProps = {
  bundle: BundleConfig;
  cart: CartState;
  max: number;
  remaining?: number;
  reachedLimit: boolean;
  resolveImage: (id: string) => string;
  expandedId: string | null;
  onToggleDescription: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
};

export default function Itemselection({
  bundle,
  cart,
  max,
  remaining,
  reachedLimit,
  resolveImage,
  expandedId,
  onToggleDescription,
  incrementItem,
  decrementItem,
}: ItemSelectionProps) {
  return (
    <div className="space-y-5 w-[8rem] sm:w-auto h-[25rem] sm:h-[25rem] 2xl:h-[50rem] overflow-auto">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Välj upp till {max > 0 ? max : "valfritt antal"} produkter.</span>
        {max > 0 && <span>{remaining === 0 ? "Fullt. Vid önskemål om fler produkter, kontakta oss via mail." : `${remaining} val kvar`}</span>}
      </div>
      <div className="grid grid-cols-1 sm:w-auto sm:grid-cols-2 gap-5 content-center place-items-start sm:place-items-center col-end-1">
        {bundle.items.map((item) => {
          const qty = cart[item.id] ?? 0;
          const disableIncrement = reachedLimit && qty === 0;
          const imageSrc = resolveImage(item.id);
          const descriptionId = `bundle-item-desc-${item.id}`;
          const canShowDescription = Boolean(item.description);
          const isExpanded = expandedId === item.id && canShowDescription;
          const handleCardToggle = () => {
            if (!canShowDescription) return;
            onToggleDescription(item.id);
          };
          return (
            <article
              key={item.id}
              role={canShowDescription ? "button" : undefined}
              tabIndex={canShowDescription ? 0 : undefined}
              aria-expanded={canShowDescription ? isExpanded : undefined}
              aria-controls={canShowDescription ? descriptionId : undefined}
              onClick={handleCardToggle}
              onKeyDown={(event) => {
                if (!canShowDescription) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleCardToggle();
                }
              }}
              className={`flex flex-col rounded-xl border border-gray-200 bg-gray-50 w-96 ${
                canShowDescription
                  ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BEF0]"
                  : ""
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-xl bg-white p-3 flex items-center justify-center">
                <Image
                  src={imageSrc}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 30vw, 6rem"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col items-stretch gap-2 p-3 text-center">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">{item.name}</h5>
                  <p className="text-xs text-gray-600">{item.price} kr</p>
                </div>
                <div className="mt-auto flex items-center justify-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      decrementItem(item.id);
                    }}
                    disabled={qty === 0}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-white transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BEF0] ${
                      qty === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={`Minska antal av ${item.name}`}
                  >
                    –
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      incrementItem(item.id);
                    }}
                    disabled={disableIncrement}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-white transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BEF0] ${
                      disableIncrement ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={`Öka antal av ${item.name}`}
                  >
                    +
                  </button>
                </div>
                {canShowDescription && (
                  <div
                    id={descriptionId}
                    className={`overflow-auto text-left text-sm text-gray-600 transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="leading-relaxed">{item.description}</p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
