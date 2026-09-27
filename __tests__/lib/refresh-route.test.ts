import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/refresh/route';
afterEach(() => vi.unstubAllGlobals());
const request = () => new NextRequest('https://web.test/api/auth/refresh', { method: 'POST', headers: { Cookie: 'pph_refresh=test-refresh' } });
it.each([429, 500, 503])('preserves cookies when the upstream returns %s', async status => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })));
  const response = await POST(request());
  expect(response.status).toBe(status === 429 ? 429 : 502);
  expect(response.headers.get('set-cookie')).toBeNull();
});
it('sets both rotated cookies without an additional network verification that can strand the session', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accessToken: 'new-access', refreshToken: 'new-refresh' })));
  vi.stubGlobal('fetch', fetch);
  const response = await POST(request());
  expect(response.status).toBe(200);
  expect(response.cookies.get('pph_refresh')?.value).toBe('new-refresh');
  expect(fetch).toHaveBeenCalledTimes(1);
});
it('clears cookies for a definitively revoked refresh token', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
  const response = await POST(request());
  expect(response.status).toBe(401);
  expect(response.cookies.get('pph_refresh')?.value).toBe('');
});
