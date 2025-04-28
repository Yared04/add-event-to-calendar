// add-event-to-calendar/src/utils/ics.ts
import { EventDetails } from "../components/AddToGoogleCalendar";

export function generateICS(event: EventDetails) {
  // Format: YYYYMMDDTHHmmssZ (UTC)
  const formatDate = (iso: string) =>
    iso.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DTSTART:${formatDate(event.startTime)}`,
    `DTEND:${formatDate(event.endTime)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
