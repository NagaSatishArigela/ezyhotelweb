"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, Clock, Users, BedDouble, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { PublicBookingPolicy, PublicRoomType } from "@/lib/api";
import { to24Hour } from "@/lib/time";

interface RealHotelBookingPanelProps {
  propertyId: string;
  roomTypes: PublicRoomType[];
  bookingPolicy: PublicBookingPolicy | null;
  minBookingHours: number | null;
}

const TIME_SLOTS = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
];

const ROOM_TYPE_LABELS: Record<string, string> = {
  ac: "AC Room",
  nonac: "Non-AC Room",
  dorm: "Dorm",
  suite: "Suite",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function RealHotelBookingPanel({
  propertyId,
  roomTypes,
  bookingPolicy,
  minBookingHours,
}: RealHotelBookingPanelProps) {
  const router = useRouter();
  const bookableRoomTypes = roomTypes.filter((r) => r.hourlyRatePaise != null || r.fulldayRatePaise != null);

  const allowHourly = bookingPolicy === "hourly" || bookingPolicy === "both";
  const allowFullday = bookingPolicy === "fullday" || bookingPolicy === "both";
  const defaultBookingType: "hourly" | "fullday" = allowHourly ? "hourly" : "fullday";

  const [bookingType, setBookingType] = useState<"hourly" | "fullday">(defaultBookingType);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(bookableRoomTypes[0]?.id ?? "");
  const [selectedHours, setSelectedHours] = useState(minBookingHours ?? 3);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [checkInDate, setCheckInDate] = useState(todayStr());
  const [checkInTime, setCheckInTime] = useState("12:00 PM");
  const [guests, setGuests] = useState(2);

  if (bookableRoomTypes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-sm text-gray-500">
        No room types are available for booking right now.
      </div>
    );
  }

  const selectedRoomType = bookableRoomTypes.find((r) => r.id === selectedRoomTypeId) ?? bookableRoomTypes[0];

  const hourlyRupees = selectedRoomType.hourlyRatePaise != null ? selectedRoomType.hourlyRatePaise / 100 : null;
  const fulldayRupees = selectedRoomType.fulldayRatePaise != null ? selectedRoomType.fulldayRatePaise / 100 : null;

  const baseTotal =
    bookingType === "hourly"
      ? Math.round((hourlyRupees ?? 0) * selectedHours)
      : Math.round(fulldayRupees ?? 0);
  const taxAmount = Math.round(baseTotal * 0.18);
  const totalWithTax = baseTotal + taxAmount;

  const checkOutStr = (() => {
    const time24 = to24Hour(checkInTime);
    const checkIn = new Date(`${checkInDate}T${time24}:00`);
    const hoursToAdd = bookingType === "hourly" ? selectedHours : 24;
    const checkOut = new Date(checkIn.getTime() + hoursToAdd * 3600000);
    return checkOut.toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "2-digit",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  })();

  const handleReserve = () => {
    const params = new URLSearchParams({
      roomTypeId: selectedRoomType.id,
      bookingType,
      date: checkInDate,
      time: checkInTime,
      hours: String(bookingType === "hourly" ? selectedHours : 24),
      guests: String(guests),
    });
    router.push(`/booking/${propertyId}?${params.toString()}`);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-6">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 p-3 px-6 text-white text-center">
              <p className="text-sm font-bold tracking-tight uppercase">Book this property</p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {allowHourly && allowFullday && (
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                  {(["hourly", "fullday"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setBookingType(type)}
                      className={`py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${
                        bookingType === type ? "bg-orange-500 text-white" : "text-gray-500"
                      }`}
                    >
                      {type === "hourly" ? "By the Hour" : "Full Day"}
                    </button>
                  ))}
                </div>
              )}

              {/* Room type */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Room Type</label>
                <div className="relative">
                  <select
                    value={selectedRoomTypeId}
                    onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                    className="w-full appearance-none text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400 transition-colors pr-7"
                  >
                    {bookableRoomTypes.map((room) => (
                      <option key={room.id} value={room.id}>
                        {ROOM_TYPE_LABELS[room.type] ?? room.type} {room.maxOccupancy ? `(up to ${room.maxOccupancy} guests)` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={todayStr()}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Check-in Time</label>
                  <div className="relative">
                    <select
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full appearance-none text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400 transition-colors pr-7"
                    >
                      {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Guests
                </p>
                <div className="flex items-center justify-between">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-orange-400 transition-colors flex items-center justify-center">−</button>
                  <span className="font-black text-gray-900">{guests}</span>
                  <button onClick={() => setGuests(Math.min(selectedRoomType.maxOccupancy ?? 10, guests + 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-orange-400 transition-colors flex items-center justify-center">+</button>
                </div>
              </div>

              {/* Hours slider (hourly only) */}
              {bookingType === "hourly" && (
                <div className="space-y-2 px-1">
                  <div className="flex justify-between items-end">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Duration</label>
                    <div className="text-right">
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">{selectedHours}</span>
                      <span className="text-xs font-black text-gray-400 uppercase ml-1">Hrs</span>
                    </div>
                  </div>
                  <Slider
                    value={[selectedHours]}
                    onValueChange={(v) => setSelectedHours(v[0])}
                    min={minBookingHours ?? 1}
                    max={24}
                    step={1}
                    className="cursor-pointer py-3"
                  />
                  <div className="flex justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    <span>Min {minBookingHours ?? 1}h</span><span>Max 24h</span>
                  </div>
                </div>
              )}

              {/* Booking summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center cursor-pointer px-1" onClick={() => setIsSummaryOpen(!isSummaryOpen)}>
                  <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Your Booking Summary</h4>
                  <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${isSummaryOpen ? "" : "rotate-180"}`} />
                </div>
                {isSummaryOpen && (
                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-[1.5rem] border border-gray-50 shadow-inner">
                    <div className="flex justify-between items-start px-1 gap-2">
                      <div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Check-in</p>
                        <p className="text-[10px] font-black text-gray-900 leading-tight" suppressHydrationWarning>
                          {new Date(checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}, {checkInTime}
                        </p>
                      </div>
                      <div className="text-[8px] font-black text-gray-400 px-2 py-1 bg-white rounded-full border border-gray-100 uppercase tracking-widest shrink-0">
                        {bookingType === "hourly" ? `${selectedHours}h` : "Full day"}
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Check-out</p>
                        <p className="text-[10px] font-black text-gray-900 leading-tight" suppressHydrationWarning>{checkOutStr}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-1">
                      <BedDouble className="w-3 h-3" /> {ROOM_TYPE_LABELS[selectedRoomType.type] ?? selectedRoomType.type} · {guests} Guest{guests > 1 ? "s" : ""}
                    </p>
                    <div className="bg-white border border-gray-100 rounded-2xl p-3 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>{bookingType === "hourly" ? `₹${hourlyRupees} × ${selectedHours}h` : "Full day rate"}</span>
                        <span className="text-gray-900">₹{baseTotal}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>Taxes & fees (18%)</span>
                        <span className="text-gray-900">₹{taxAmount}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-gray-900">
                        <span>Total</span>
                        <span>₹{totalWithTax}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between px-1">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{totalWithTax}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">incl. taxes & fees</span>
                </div>
                <button
                  onClick={handleReserve}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-14 px-10 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-orange-100 active:scale-95 transition-all"
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3" /> {bookingType === "hourly" ? `${selectedHours}h` : "Full day"} · {guests} guest{guests > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-orange-600 tracking-tighter">₹{totalWithTax}</span>
              <span className="bg-green-100 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">incl. tax</span>
            </div>
          </div>
          <button
            onClick={handleReserve}
            className="bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 active:scale-95 transition-all"
          >
            Reserve
          </button>
        </div>
      </div>
    </>
  );
}
