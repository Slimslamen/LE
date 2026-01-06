import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShopConfirmationModalProps } from "./shopInterface";
import Image from "next/image";
const useNavigate = () => {
  const router = useRouter();
  return (href: string) => router.push(href);
};

export default function ShopConfirmationModal({ onClose }: ShopConfirmationModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    closeBtnRef.current?.focus();
    interface OnKeyHandler {
      (event: KeyboardEvent): void;
    }

    const onKey: OnKeyHandler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Offert skickad"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div
        className="relative z-10 w-30rem max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b bg-linear-to-r from-gray-50 to-blue-50">
          <h3 className="text-lg font-semibold text-gray-900">Tack!</h3>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="cursor-pointer ShopClose w-9 h-9 rounded-full text-white font-bold bg-[#66BEF0] hover:scale-95 flex items-center justify-center focus:outline-none"
            aria-label="Stäng"
          >
            X
          </button>
        </header>

        <div className="px-6 py-8 text-center">
          <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#66BEF0]/10">
            <Image
              src="/svg/LavinCheck.svg"
              alt="Check icon"
              width={24}
              height={24}
              loading="lazy"
              className="w-8 h-8 absolute top-2 right-2"
            />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Din beställning har lagts!</p>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Vi återkommer så snabbt vi kan. Under tiden kan du återgå till startsidan.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            aria-label="Gå till startsidan"
          >
            Gå till startsidan
          </button>
        </div>
      </div>
    </div>
  );
}
