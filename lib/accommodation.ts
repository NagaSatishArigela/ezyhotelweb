export const PROPERTY_TYPES = [
  { value: 'hotel', label: 'Hotels' },
  { value: 'resort', label: 'Resorts' },
  { value: 'villa', label: 'Villas' },
  { value: 'guest_house', label: 'Guest Houses' },
  { value: 'farm', label: 'Farm Houses' },
  { value: 'homestay', label: 'Homestays' },
  { value: 'pg', label: 'PGs' },
  { value: 'lodge', label: 'Lodges' },
  { value: 'dormitory', label: 'Dormitories' },
  { value: 'banquet', label: 'Banquet/Convention Hall' },
  { value: 'other', label: 'Others' },
] as const

export const OTHER_ACCOMMODATION_TYPES = [
  { value: 'container_home', label: 'Container Home' },
  { value: 'tents_glamping', label: 'Tents & Glamping' },
  { value: 'tree_house', label: 'Tree Houses & Elevated Stays' },
] as const

export const OTHER_FACILITIES = [
  ['windows', 'Windows are available'],
  ['bathroom', 'Bathroom available'],
  ['roofInstallation', 'Roof installation'],
  ['rainWaterProtection', 'Rain water protection'],
  ['sunRoof', 'Sun roof'],
  ['electricity', 'Electricity available'],
  ['familiesAllowed', 'Families are allowed'],
  ['groupPartiesAllowed', 'Group parties are allowed'],
  ['soloAccommodationAllowed', 'Solo accommodation allowed'],
  ['childrenBeds', 'Children beds'],
  ['hotWater', 'Hot water service'],
  ['accommodationService', 'Accommodation service'],
  ['lockDoor', 'Lock door'],
  ['privacyProtection', 'Privacy protection'],
  ['pillowBlanket', 'Pillow & blanket'],
  ['luggageStorage', 'Luggage storage'],
  ['housekeeping', 'Housekeeping'],
  ['chargingSockets', 'Charging sockets'],
] as const

export const DORMITORY_SELECTS = [
  { key: 'accommodationAllowedFor', label: 'Accommodation allowed for', options: ['Male dormitory', 'Female dormitory', 'Mixed-gender dormitory', 'Private room for family / group'] },
  { key: 'category', label: 'Dormitory category', options: ['Standard', 'Deluxe', 'AC', 'Non-AC', 'Capsule / Pod', 'Bunk-bed room'] },
  { key: 'bedType', label: 'Bed type', options: ['Single bunk', 'Upper bunk', 'Lower bunk', 'Single bed', 'Capsule / Pod'] },
  { key: 'bedAllocation', label: 'Bed allocation', options: ['Upper', 'Lower', 'Any available bed'] },
  { key: 'sleepingArrangement', label: 'Sleeping arrangement', options: ['Shared room', 'Private dormitory room'] },
  { key: 'attachedBathroom', label: 'Attached bathroom', options: ['Yes', 'No'] },
  { key: 'bathroomType', label: 'Bathroom type', options: ['Attached', 'Common'] },
  { key: 'lockerAvailability', label: 'Locker availability', options: ['Individual locker', 'Shared locker', 'None'] },
  { key: 'mattressType', label: 'Mattress type', options: ['Standard', 'Orthopedic', 'Other'] },
  { key: 'chargingPoint', label: 'Charging point', options: ['Each bed', 'Shared'] },
  { key: 'readingLight', label: 'Reading light', options: ['Each bed', 'Shared'] },
  { key: 'privacyScreen', label: 'Curtain or privacy screen', options: ['Yes', 'No'] },
] as const


export type PublicPropertyType = typeof PROPERTY_TYPES[number]["value"];

export interface OtherAccommodation {
  type: typeof OTHER_ACCOMMODATION_TYPES[number]["value"];
  numberOfBeds: number;
  windows: "yes" | "no";
  bathroom: "yes" | "no";
  roofInstallation: "yes" | "no";
  rainWaterProtection: "yes" | "no";
  sunRoof: "yes" | "no";
  electricity: "yes" | "no";
  familiesAllowed: "yes" | "no";
  groupPartiesAllowed: "yes" | "no";
  soloAccommodationAllowed: "yes" | "no";
  childrenBeds: "yes" | "no";
  hotWater: "yes" | "no";
  accommodationService: "yes" | "no";
  lockDoor: "yes" | "no";
  privacyProtection: "yes" | "no";
  pillowBlanket: "yes" | "no";
  luggageStorage: "yes" | "no";
  housekeeping: "yes" | "no";
  chargingSockets: "yes" | "no";
}

export interface DormitoryDetails {
  roomName: string;
  totalBeds: number;
  bedLength: number;
  bedWidth: number;
  linenProvided: string[];
  accommodationAllowedFor: string;
  category: string;
  bedType: string;
  bedAllocation: string;
  sleepingArrangement: string;
  attachedBathroom: string;
  bathroomType: string;
  lockerAvailability: string;
  mattressType: string;
  chargingPoint: string;
  readingLight: string;
  privacyScreen: string;
}

export function propertyTypeLabel(value: string | null | undefined): string | undefined {
  return PROPERTY_TYPES.find((type) => type.value === value)?.label ?? value ?? undefined;
}
