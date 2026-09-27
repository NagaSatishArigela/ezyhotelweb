let pending: Promise<{ status: number; accessToken?: string }> | undefined;
export function refreshWebSession() {
  if (!pending) {
    pending = fetch('/api/auth/refresh', { method: 'POST' }).then(async response => ({
      status: response.status,
      accessToken: response.ok ? (await response.json()).accessToken as string : undefined,
    })).finally(() => { pending = undefined; });
  }
  return pending;
}
