export async function getPageTexts() {
  const res = await fetch("/api/texts", { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch texts: ${text}`);
  }
  return res.json();
}