/** Accept only local paths, including after browser backslash normalization. */
export function safeInternalRedirect(value: string | null): string | null {
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return null;
  const url = new URL(value, "https://ezyhotels.com");
  if (url.origin !== "https://ezyhotels.com" || ["/login", "/register"].includes(url.pathname)) return null;
  return url.pathname + url.search + url.hash;
}
