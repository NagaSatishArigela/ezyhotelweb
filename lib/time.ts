/** Converts a "hh:mm AM/PM" time slot (as used by the booking panels) to 24-hour "HH:mm". */
export function to24Hour(timeStr: string): string {
  const [time, period] = timeStr.split(" ");
  let [hour] = time.split(":").map(Number);
  const [, minute] = time.split(":");
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}
