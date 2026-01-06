import type { BundleConfig } from "../shopInterface";

type ItemSummaryProps = {
  bundle: BundleConfig;
  cartIsEmpty: boolean;
  selectedEntries: Array<[string, number]>;
  decrementItem: (id: string) => void;
  incrementItem: (id: string) => void;
  reachedLimit: boolean;
  total: number;
  clearCart: () => void;
  max: number;
  remaining?: number;
};

export default function Itemsummary({
  bundle,
  cartIsEmpty,
  selectedEntries,
  decrementItem,
  incrementItem,
  reachedLimit,
  total,
  clearCart,
  max,
  remaining,
}: ItemSummaryProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>Grundpris</span>
          <span className="font-semibold">{bundle.basePrice} kr</span>
        </div>
        <div className="mt-4 space-y-3">
          {cartIsEmpty && <p className="text-sm text-gray-600">Din kundvagn är tom just nu.</p>}
          {selectedEntries.map(([id, qty]) => {
            const item = bundle.items.find((entry) => entry.id === id);
            if (!item) return null;
            return (
              <div key={id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{qty} st · {item.price} kr</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrementItem(id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BEF0]"
                    aria-label={`Minska antal av ${item.name}`}
                  >
                    –
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => incrementItem(id)}
                    disabled={reachedLimit}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BEF0] ${
                      reachedLimit ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={`Öka antal av ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-gray-900">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-semibold">Från {total} kr</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-white space-x-12">
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BEF0]"
        >
          Töm kundvagn
        </button>
        {max > 0 && <span>{remaining === 0 ? "Inget mer kan läggas till" : `Ytterligare ${remaining} kan läggas till`}</span>}
      </div>
    </div>
  );
}
