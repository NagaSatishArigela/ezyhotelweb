import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from '@/app/api/session/route';
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const request = () => new NextRequest('https://web.example.test/api/session', { method: 'DELETE', headers: { Cookie: 'pph_refresh=synthetic-refresh; pph_session=synthetic-access' } });
it('revokes the cookie-backed session after a browser reload', async () => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.test');
  const call = vi.fn().mockResolvedValue(new Response('{}', { status: 200 })); vi.stubGlobal('fetch', call);
  const result = await DELETE(request());
  expect(call).toHaveBeenCalledWith('https://api.example.test/auth/logout', expect.objectContaining({ method: 'POST', body: JSON.stringify({ refreshToken: 'synthetic-refresh' }) }));
  expect(result.status).toBe(200);
  expect(result.cookies.get('pph_refresh')?.value).toBe('');
  expect(result.cookies.get('pph_session')?.value).toBe('');
});
it('does not falsely claim revocation when backend is unavailable', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const result = await DELETE(request());
  expect(result.status).toBe(502); expect(result.headers.get('set-cookie')).toBeNull();
});
it('clears an already expired/rejected refresh token', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
  expect((await DELETE(request())).status).toBe(200);
});
it('clears local cookies when no refresh cookie remains', async () => {
  const call = vi.fn(); vi.stubGlobal('fetch', call);
  expect((await DELETE(new NextRequest('https://web.example.test/api/session', { method: 'DELETE' }))).status).toBe(200);
  expect(call).not.toHaveBeenCalled();
});
