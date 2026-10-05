import type { Booking } from "../types";
export const currency = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    paise / 100,
  );
export const dateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
export function ticketText(booking: Booking) {
  return `Smart Parking — simulated payment
Booking ID: ${booking._id}
Parking Lot: ${booking.parkingSpaceId?.name || booking.parkingLotName}
Location: ${booking.parkingSpaceId?.location || "Unavailable"}
Spot Number: ${booking.parkingId}
Start Time: ${dateTime(booking.startTime)}
End Time: ${dateTime(booking.endTime)}
Amount: ${currency(booking.pricing.amountPaise)}
Status: ${booking.status}
`;
}
export function downloadTicket(booking: Booking) {
  const url = URL.createObjectURL(
    new Blob([ticketText(booking)], { type: "text/plain;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `parking-ticket-${booking._id}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
