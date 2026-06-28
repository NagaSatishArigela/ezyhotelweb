"use client";

import { useState } from "react";
import { Calendar, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/client/FloatingLabelInput";

const durationOptions = [3, 6, 9, 12];

export default function SearchBar() {
  const [duration, setDuration] = useState(3);

  return (
    <div className="max-w-4xl mx-auto bg-background p-6 rounded-xl shadow-lg border border-slate-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput id="location" label="City or Location" type="text" icon={MapPin} required />
        <FloatingLabelInput
          id="check-in"
          label="Check-in Date"
          type="text"
          icon={Calendar}
          onFocus={(e) => ((e.target as HTMLInputElement).type = "date")}
          onBlur={(e) => ((e.target as HTMLInputElement).type = "text")}
          required
        />
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-600 text-left mb-3">Duration (hours)</p>
        <div className="flex flex-wrap gap-3">
          {durationOptions.map((hours) => (
            <Button
              key={hours}
              variant={duration === hours ? "default" : "outline"}
              className={`h-12 text-base font-semibold ${duration === hours ? "bg-teal-500 text-white hover:bg-teal-600" : "text-slate-700"}`}
              onClick={() => setDuration(hours)}
            >
              {hours} hours
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Button size="lg" className="w-full h-14 font-bold text-lg bg-teal-500 hover:bg-teal-600">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </div>
  );
}
