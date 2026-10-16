import type { PublicPropertyDetail } from '@/lib/api';
import { DORMITORY_SELECTS, OTHER_ACCOMMODATION_TYPES, OTHER_FACILITIES } from '@/lib/accommodation';

function Details({ title, rows }: { title: string; rows: [string, string | number | undefined][] }) {
  return (
    <section className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {rows.filter(([, value]) => value !== undefined).map(([label, value]) => (
          <div key={label}><dt className="text-gray-500">{label}</dt><dd className="font-semibold text-gray-900 mt-1">{value}</dd></div>
        ))}
      </dl>
    </section>
  );
}

export default function AccommodationDetails({ property }: { property: Pick<PublicPropertyDetail, 'propertyType' | 'otherAccommodation' | 'roomTypes'> }) {
  const other = property.propertyType === 'other' ? property.otherAccommodation : null;
  return <>
    {other && <Details title="Accommodation facilities" rows={[
      ['Type of accommodation', OTHER_ACCOMMODATION_TYPES.find((type) => type.value === other.type)?.label],
      ['Number of beds', other.numberOfBeds],
      ...OTHER_FACILITIES.map(([key, label]): [string, string | undefined] => [label, other[key] === 'yes' ? 'Yes' : other[key] === 'no' ? 'No' : undefined]),
    ]} />}
    {property.roomTypes.filter((room) => room.type === 'dorm' && room.dormitory).map((room) => {
      const dorm = room.dormitory!;
      return <Details key={room.id} title={`Dormitory — ${dorm.roomName}`} rows={[
        ['Room capacity (guests allowed)', room.maxOccupancy ?? undefined],
        ['Total beds in room', dorm.totalBeds],
        ...DORMITORY_SELECTS.map(({ key, label }): [string, string | undefined] => [label, dorm[key]]),
        ['Bed dimensions (length × width)', dorm.bedLength && dorm.bedWidth ? `${dorm.bedLength} × ${dorm.bedWidth} cm` : undefined],
        ['Linen provided', dorm.linenProvided?.join(', ') || 'None'],
      ]} />;
    })}
  </>;
}
