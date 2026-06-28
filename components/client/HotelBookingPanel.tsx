"use client";

import { useState, useEffect } from "react";
import { ChevronUp, Check, ArrowRight, Phone, Clock, Users, BedDouble, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Plan { hours: number; price: number; }

interface HotelBookingPanelProps {
  basePrice: number;
  hotelId: number;
  plans: Plan[];
}

const TIME_SLOTS = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addHours(dateStr: string, timeStr: string, hours: number): string {
  const [h, mPart] = timeStr.split(":");
  const isPM = timeStr.includes("PM");
  let hour = parseInt(h);
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  const base = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);
  base.setHours(base.getHours() + hours);
  return base.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "2-digit",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export default function HotelBookingPanel({ basePrice, hotelId, plans }: HotelBookingPanelProps) {
  const [selectedHours, setSelectedHours] = useState(3);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [checkInDate, setCheckInDate] = useState(todayStr());
  const [checkInTime, setCheckInTime] = useState("12:00 PM");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const matchedPlan = plans.find((p) => p.hours === selectedHours);
  const pricePerHour = Math.round(basePrice / 3);
  const unitPrice = matchedPlan?.price ?? Math.round(pricePerHour * selectedHours);
  const totalPrice = unitPrice * rooms;
  const totalWithTax = Math.round(totalPrice * 1.18);

  // suppressHydrationWarning on the checkout display — value depends on client clock
  const checkOutStr = mounted ? addHours(checkInDate, checkInTime, selectedHours) : addHours(todayStr(), "12:00 PM", selectedHours);

  const handleReserve = () => {
    const params = new URLSearchParams({
      date: checkInDate,
      time: checkInTime,
      hours: String(selectedHours),
      rooms: String(rooms),
      guests: String(guests),
      price: String(totalWithTax),
    });
    window.location.href = `/booking/${hotelId}?${params.toString()}`;
  };

  const GuestRoomSelector = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <BedDouble className="w-3 h-3" /> Rooms
        </p>
        <div className="flex items-center justify-between">
          <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-orange-400 transition-colors flex items-center justify-center">−</button>
          <span className="font-black text-gray-900">{rooms}</span>
          <button onClick={() => setRooms(Math.min(5, rooms + 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-orange-400 transition-colors flex items-center justify-center">+</button>
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <Users className="w-3 h-3" /> Guests
        </p>
        <div className="flex items-center justify-between">
          <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-orange-400 transition-colors flex items-center justify-center">−</button>
          <span className="font-black text-gray-900">{guests}</span>
          <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-orange-400 transition-colors flex items-center justify-center">+</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-6">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 p-3 px-6 text-white text-center">
              <p className="text-sm font-bold tracking-tight uppercase">Get up to 25% off on Bookings</p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Hourly Rate Plans</h3>

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

              {/* Rooms + Guests */}
              <GuestRoomSelector />

              {/* Quick-select plan cards */}
              <div className="grid grid-cols-2 gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.hours}
                    onClick={() => setSelectedHours(plan.hours)}
                    className={`relative p-3 rounded-xl border-2 text-left transition-all ${selectedHours === plan.hours ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-gray-50 hover:border-orange-200"}`}
                  >
                    <span className="text-[10px] font-bold text-gray-500 block">{plan.hours} Hours</span>
                    <span className="text-base font-black text-gray-900">₹{plan.price}</span>
                    {rooms > 1 && <span className="text-[9px] text-gray-400 block">× {rooms} rooms</span>}
                    {selectedHours === plan.hours && (
                      <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="space-y-2 px-1">
                <div className="flex justify-between items-end">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Or pick exact hours</label>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{selectedHours}</span>
                    <span className="text-xs font-black text-gray-400 uppercase ml-1">Hrs</span>
                  </div>
                </div>
                <Slider value={[selectedHours]} onValueChange={(v) => setSelectedHours(v[0])} min={1} max={24} step={1} className="cursor-pointer py-3" />
                <div className="flex justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest">
                  <span>Min 1h</span><span>Max 24h</span>
                </div>
              </div>

              <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-tight">Flexible Check-in Active</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Save up to 25%</span>
              </div>

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
                        <p className="text-[10px] font-black text-gray-900 leading-tight">
                          {mounted ? new Date(checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "—"}, {checkInTime}
                        </p>
                      </div>
                      <div className="text-[8px] font-black text-gray-400 px-2 py-1 bg-white rounded-full border border-gray-100 uppercase tracking-widest shrink-0">
                        {selectedHours}h
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Check-out</p>
                        <p className="text-[10px] font-black text-gray-900 leading-tight" suppressHydrationWarning>{checkOutStr}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
                      {rooms} Room{rooms > 1 ? "s" : ""} · {guests} Guest{guests > 1 ? "s" : ""}
                    </p>
                    <div className="bg-white border border-gray-100 rounded-2xl p-3 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>₹{unitPrice} × {rooms} room{rooms > 1 ? "s" : ""}</span>
                        <span className="text-gray-900">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>Taxes & fees (18%)</span>
                        <span className="text-gray-900">₹{totalWithTax - totalPrice}</span>
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

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors cursor-pointer group">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
              <Phone className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex-1">
              <p className="font-black text-[10px] text-gray-900 uppercase tracking-widest">Need help booking?</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 tracking-tighter">Call our experts 24/7</p>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3" /> {selectedHours}h · {rooms} room · {guests} guest{guests > 1 ? "s" : ""}
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
