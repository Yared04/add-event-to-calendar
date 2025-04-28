// add-event-to-calendar/src/components/AddToSamsungCalendar.tsx
import React from "react";
import { generateICS } from "../utils/ics";
import { EventDetails } from "./AddToGoogleCalendar";

const AddToSamsungCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
  const handleDownload = () => {
    const icsContent = generateICS(event);
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn" onClick={handleDownload} type="button">
      Add to Samsung Calendar
    </button>
  );
};

export default AddToSamsungCalendar;
