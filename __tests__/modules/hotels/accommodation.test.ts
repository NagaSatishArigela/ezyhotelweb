import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import AccommodationDetails from '@/components/server/AccommodationDetails';
import { PROPERTY_TYPES, OTHER_FACILITIES, type OtherAccommodation, type DormitoryDetails } from '@/lib/accommodation';
import { normalizeFilters } from '@/modules/hotels/filters';
import { filterHotels } from '@/modules/hotels/controller';
import { publicPropertiesApi, type PublicRoomType } from '@/lib/api';

describe('Guest accommodation support', () => {
  it('exposes service types in the requested order and accepts new URL filters', () => {
    expect(PROPERTY_TYPES.map((type) => type.label)).toEqual(['Hotels', 'Resorts', 'Villas', 'Guest Houses', 'Farm Houses', 'Homestays', 'PGs', 'Lodges', 'Dormitories', 'Banquet/Convention Hall', 'Others']);
    expect(normalizeFilters({ propertyType: 'dormitory', city: 'Delhi' })).toEqual({ propertyType: 'dormitory', city: 'Delhi' });
    expect(normalizeFilters({ propertyType: 'invalid', city: 'Delhi' })).toEqual({ city: 'Delhi' });
  });

  it('keeps canonical and historical amenity filters working with demo listings', () => {
    expect(filterHotels({ amenities: 'wifi,ac' })).toEqual(filterHotels({ amenities: 'WiFi,AC' }));
    expect(filterHotels({ propertyType: 'hotel' })).toEqual(filterHotels({}));
    expect(filterHotels({ propertyType: 'dormitory' })).toEqual([]);
  });

  it('passes service filters to the public API without removing other filters', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ items: [], total: 0, page: 1, limit: 20 })));
    try {
      await publicPropertiesApi.list({ propertyType: 'guest_house', city: 'Delhi' });
      const url = new URL(String(fetch.mock.calls[0][0]), 'http://localhost');
      expect(url.searchParams.get('propertyType')).toBe('guest_house');
      expect(url.searchParams.get('city')).toBe('Delhi');
    } finally { fetch.mockRestore(); }
  });

  it('renders older records with no new fields without adding empty sections', () => {
    expect(renderToStaticMarkup(createElement(AccommodationDetails, { property: { propertyType: 'hotel', roomTypes: [] } }))).toBe('');
  });

  it.each(['container_home', 'tents_glamping', 'tree_house'] as const)('shows facilities and explicit No answers for %s', (type) => {
    const otherAccommodation = { type, numberOfBeds: 3, ...Object.fromEntries(OTHER_FACILITIES.map(([key]) => [key, 'no'])) } as OtherAccommodation;
    const html = renderToStaticMarkup(createElement(AccommodationDetails, { property: { propertyType: 'other', otherAccommodation, roomTypes: [] } }));
    expect(html).toContain('Accommodation facilities');
    expect(html).toContain('Number of beds');
    expect(html).toContain('>No</dd>');
    for (const [, label] of OTHER_FACILITIES) expect(html).toContain(label.replaceAll('&', '&amp;'));
  });

  it('shows the saved dormitory specifications and capacity', () => {
    const dormitory = { roomName: 'D-101', totalBeds: 24, bedLength: 200, bedWidth: 90, bedType: 'Single bunk', privacyScreen: 'Yes', linenProvided: ['Bedsheet', 'Pillow'] } as DormitoryDetails;
    const room = { id: 'dorm', type: 'dorm', maxOccupancy: 24, dormitory } as PublicRoomType;
    const html = renderToStaticMarkup(createElement(AccommodationDetails, { property: { propertyType: 'dormitory', roomTypes: [room] } }));
    expect(html).toContain('Dormitory — D-101');
    expect(html).toContain('200 × 90 cm');
    expect(html).toContain('Single bunk');
    expect(html).toContain('Bedsheet, Pillow');
  });
});
