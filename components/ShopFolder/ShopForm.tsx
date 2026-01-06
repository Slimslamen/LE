import { useMemo, useState } from "react";
import { useForm } from "@formspree/react";
import { ShopFormProps } from "./shopInterface";



export default function ShopForm({ bundle, selectedIds, total, onSuccess }: ShopFormProps) {
  const [state, handleSubmit] = useForm("xrbkjgpz");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });

  const isValidEmail = (v: string) => /.+@.+\..+/.test(v.trim());
  const isValidPhone = (v: string) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 7;
  };
  const isValidName = (v: string) => v.trim().length > 0;
  const formValid = isValidName(name) && isValidPhone(phone) && isValidEmail(email);

  const itemNames = useMemo(() => {
    const counts = selectedIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([id, qty]) => {
        const name = bundle.items.find((i) => i.id === id)?.name;
        if (!name) return undefined;
        return qty > 1 ? `${name} x${qty}` : name;
      })
      .filter(Boolean)
      .join(", ");
  }, [bundle.items, selectedIds]);

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!formValid) {
          setTouched({ name: true, phone: true, email: true });
          return;
        }
        await handleSubmit(e);
        onSuccess?.({ name, phone, email, selected: selectedIds, total });
      }}
    >
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="quote-name">Namn</label>
        <input
          id="quote-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66BEF0] ${
            !isValidName(name) && touched.name ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Ditt namn"
          aria-invalid={!isValidName(name) && touched.name}
          aria-required="true"
        />
        {!isValidName(name) && touched.name && (
          <p className="mt-1 text-xs text-red-600">Vänligen ange ditt namn.</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="quote-phone">Telefon</label>
        <input
          id="quote-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66BEF0] ${
            !isValidPhone(phone) && touched.phone ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Ditt telefonnummer"
          aria-invalid={!isValidPhone(phone) && touched.phone}
          aria-required="true"
        />
        {!isValidPhone(phone) && touched.phone && (
          <p className="mt-1 text-xs text-red-600">Ange ett giltigt telefonnummer.</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="quote-email">E‑post</label>
        <input
          id="quote-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66BEF0] ${
            !isValidEmail(email) && touched.email ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="din@epost.se"
          aria-invalid={!isValidEmail(email) && touched.email}
          aria-required="true"
        />
        {!isValidEmail(email) && touched.email && (
          <p className="mt-1 text-xs text-red-600">Ange en giltig e‑postadress.</p>
        )}
      </div>

      <input type="hidden" name="Paket" value={bundle.name} />
      <input type="hidden" name="Tillägg" value={itemNames} />
      <input type="hidden" name="Total" value={`${total} kr`} />

      <div className="mt-2">
        <button
          type="submit"
          className={`ConfirmationBtn col-span-2 mt-1 inline-flex items-center justify-center py-3 rounded-lg transition-colors focus:outline-none ${
            formValid && !state.submitting
              ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-70"
          }`}
          aria-label="Begär offert via kontaktformuläret"
          aria-describedby={!formValid ? "quote-hint" : undefined}
          aria-busy={state.submitting}
          disabled={!formValid || state.submitting}
        >
          Begär offert
        </button>
        {!formValid && (
          <p id="quote-hint" className="mt-2 text-xs text-gray-600">
            Fyll i namn, telefon och e‑post för att begära offert.
          </p>
        )}
      </div>
    </form>
  );
}
