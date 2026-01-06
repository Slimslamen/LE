import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import ShopForm from "./ShopForm";
import { RequestQuotePayload, ShopBundleConfiguratorProps } from "./shopInterface";
import Itemselection from "./BundleConfig/Itemselection";

type ShopFormSuccessData = Omit<RequestQuotePayload, "bundle">;
type CartState = Record<string, number>;

export default function ShopBundleConfigurator({ bundle, onClose, onRequestQuote }: ShopBundleConfiguratorProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function ConfiguratorContent({
    bundle,
    onClose,
    onRequestQuote,
    closeBtnRef,
  }: {
    bundle: ShopBundleConfiguratorProps["bundle"];
    onClose: ShopBundleConfiguratorProps["onClose"];
    onRequestQuote: ShopBundleConfiguratorProps["onRequestQuote"];
    closeBtnRef: Ref<HTMLButtonElement>;
  }) {
    const [step, setStep] = useState(0);
    const [cart, setCart] = useState<CartState>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const selectedEntries = useMemo(() => Object.entries(cart).filter(([, qty]) => qty > 0), [cart]);

    const selectedCount = useMemo(() => selectedEntries.reduce((sum, [, qty]) => sum + qty, 0), [selectedEntries]);

    const selectedIds = useMemo(() => {
      const ids: string[] = [];
      for (const [id, qty] of selectedEntries) {
        for (let i = 0; i < qty; i += 1) ids.push(id);
      }
      return ids;
    }, [selectedEntries]);

    const extrasTotal = useMemo(() => {
      return selectedEntries.reduce((sum, [id, qty]) => {
        const item = bundle.items.find((i) => i.id === id);
        if (!item) return sum;
        return sum + item.price * qty;
      }, 0);
    }, [bundle.items, selectedEntries]);

    const total = useMemo(() => bundle.basePrice + extrasTotal, [bundle.basePrice, extrasTotal]);

    const max = bundle.maxItems ?? 0;
    const reachedLimit = max > 0 && selectedCount >= max;
    const remaining = max > 0 ? Math.max(0, max - selectedCount) : undefined;

    const incrementItem = (id: string) => {
      setCart((prev) => {
        const currentTotal = Object.values(prev).reduce((sum, qty) => sum + qty, 0);
        if (max > 0 && currentTotal >= max) return prev;
        const nextQty = (prev[id] ?? 0) + 1;
        setExpandedId(id);
        return { ...prev, [id]: nextQty };
      });
    };

    const decrementItem = (id: string) => {
      setCart((prev) => {
        const current = prev[id] ?? 0;
        if (current <= 0) return prev;
        const nextQty = current - 1;
        const next = { ...prev };
        if (nextQty <= 0) {
          delete next[id];
          setExpandedId((prevExpanded) => (prevExpanded === id ? null : prevExpanded));
        } else next[id] = nextQty;
        return next;
      });
    };

    const clearCart = () => {
      setCart({});
      setExpandedId(null);
    };

    const goNext = () => setStep((s) => Math.min(2, s + 1));
    const goPrev = () => setStep((s) => Math.max(0, s - 1));

    const stepLabels = ["Välj produkter", "Din kundvagn", "Uppgifter"];
    const cartIsEmpty = selectedEntries.length === 0;

    const resolveImage = (id: string) => {
      const item = bundle.items.find((i) => i.id === id);
      if (!item) return bundle.icon ?? "/svg/box-svgrepo-com.svg";
      return item.image ?? bundle.icon ?? "/svg/box-svgrepo-com.svg";
    };

    const toggleDescription = (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    };

    const renderStepContent = () => {
      if (step === 0) {
        return (
          <Itemselection
            bundle={bundle}
            cart={cart}
            max={max}
            remaining={remaining}
            reachedLimit={reachedLimit}
            resolveImage={resolveImage}
            expandedId={expandedId}
            onToggleDescription={toggleDescription}
            incrementItem={incrementItem}
            decrementItem={decrementItem}
          />
        );
      }

      return (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-sm font-semibold text-gray-900">Sammanfattning</h4>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Grundpris</span>
                <span className="font-semibold">{bundle.basePrice} kr</span>
              </div>
              {selectedEntries.map(([id, qty]) => {
                const item = bundle.items.find((i) => i.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="flex items-center justify-between">
                    <span>
                      {item.name} <span className="text-xs text-gray-500">x{qty}</span>
                    </span>
                    <span className="font-semibold">{item.price * qty} kr</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm font-semibold text-gray-900">
              <span>Uppskattat totalpris</span>
              <span className="text-lg font-bold">{total} kr</span>
            </div>
          </div>
          <div>
            <ShopForm
              bundle={bundle}
              selectedIds={selectedIds}
              total={total}
              onSuccess={({ name, phone, email, selected, total: t }: ShopFormSuccessData) => {
                onRequestQuote?.({ name, phone, email, selected, total: t, bundle: bundle.name });
                onClose?.();
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        className="fixed inset-0 z-[1000]"
        role="dialog"
        aria-modal="true"
        aria-label={`${bundle.name} – konfigurator`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div
          className="w-[23rem] sm:w-[60rem] relative mx-auto  mt-20 mb-6 max-w-4xl rounded-2xl bg-white shadow-2xl sm:mt-20"
          onClick={(event) => event.stopPropagation()}
        >
          <header className=" flex flex-wrap items-center rounded-tl-lg rounded-tr-lg justify-between px-6 pt-4 pb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{bundle.name}</h3>
              <p className="text-sm text-gray-600">Steg {step + 1} av 2 · {stepLabels[step]}</p>
            </div>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="ShopClose absolute cursor-pointer right-6 h-9 w-9 rounded-full bg-[#66BEF0] font-bold text-white transition hover:scale-95 focus:outline-none"
              aria-label="Stäng konfigurator"
            >
              X
            </button>
          </header>

          <main className="px-6 py-5">
            {renderStepContent()}
          </main>

          <footer className="flex items-center justify-between gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={step === 0 ? onClose : goPrev}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm text-white hover:bg-gray-100"
            >
              {step === 0 ? "Avbryt" : "Tillbaka"}
            </button>
            {step < 1 && (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Nästa
              </button>
            )}
          </footer>
        </div>
      </div>
    );
  }

  return (
    <ConfiguratorContent
      key={bundle.name}
      bundle={bundle}
      onClose={onClose}
      onRequestQuote={onRequestQuote}
      closeBtnRef={closeBtnRef}
    />
  );
}
