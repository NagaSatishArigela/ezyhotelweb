const AMENITIES = [
  ['wifi', 'WiFi', 'wi-fi'], ['ac', 'Air conditioning', 'AC'], ['parking', 'Parking'],
  ['pool', 'Swimming pool', 'Pool'], ['gym', 'Gym / Fitness', 'Gym'],
  ['restaurant', 'Restaurant'], ['bar', 'Bar / Lounge'], ['spa', 'Spa'],
  ['reception_24', '24hr Reception'], ['room_service', 'Room service'], ['laundry', 'Laundry'],
  ['conference', 'Conference room'], ['rooftop', 'Rooftop access'],
  ['couples', 'Couples welcome', 'Couples Allowed'], ['pets', 'Pets allowed'],
  ['wheelchair', 'Wheelchair access'], ['cctv', 'CCTV security'], ['ev_charging', 'EV charging'],
] as const;

export function amenityId(value: string): string {
  const normalized = value.trim().toLowerCase();
  return AMENITIES.find((entry) => entry.some((alias) => alias.toLowerCase() === normalized))?.[0] ?? normalized;
}

export function amenityLabel(value: string): string {
  return AMENITIES.find((entry) => entry[0] === amenityId(value))?.[1] ?? value;
}
