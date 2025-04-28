// add-event-to-calendar/src/components/AddToSamsungCalendar.tsx
import React from "react";
// import { generateICS } from "../utils/ics";
import { EventDetails } from "./AddToGoogleCalendar";
import { Spin, message } from "antd";

// Tizen Calendar types
interface TizenCalendar {
  add(
    event: CalendarEvent,
    successCallback: (id: string) => void,
    errorCallback: (error: Error) => void
  ): void;
}

interface CalendarEvent {
  description: string;
  summary: string;
  location: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurrence: null;
}

declare global {
  interface Window {
    tizen?: {
      calendar: {
        getDefaultCalendar(
          type: string,
          successCallback: (calendar: TizenCalendar) => void,
          errorCallback: (error: Error) => void
        ): void;
      };
    };
  }
}

const AddToSamsungCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const convertToISO = (dateStr: string) => {
    try {
      console.log("Received date string:", dateStr); // Debug log

      // If the date string is already in ISO format, return it
      if (dateStr.includes("T") && dateStr.includes("Z")) {
        return dateStr;
      }

      // Handle moment.js formatted dates (e.g., "2024-03-24T21:00:00+00:00")
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.log("Invalid date object:", date); // Debug log
        throw new Error("Invalid date format");
      }
      return date.toISOString();
    } catch (error) {
      console.error("Error converting date:", error);
      throw new Error("Invalid date format");
    }
  };

  const handleOpenCalendar = () => {
    setLoading(true);
    try {
      console.log("Event data:", event); // Debug log
      const startTime = convertToISO(event.startTime);
      const endTime = convertToISO(event.endTime);

      // Format date for Google Calendar URL (YYYYMMDDTHHmmssZ)
      const formatDateForUrl = (isoString: string) => {
        return isoString
          .replace(/-/g, "")
          .replace(/:/g, "")
          .replace(/\.\d+Z$/, "Z");
      };

      // Create calendar event URL
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.title
      )}&dates=${formatDateForUrl(startTime)}/${formatDateForUrl(
        endTime
      )}&location=${encodeURIComponent(event.location)}`;

      window.open(calendarUrl, "_blank");

      messageApi.open({
        type: "success",
        content: "Opening calendar...",
      });
    } catch (err) {
      console.error("Error opening calendar:", err);
      messageApi.open({
        type: "error",
        content:
          "Could not open calendar. Please check the event dates and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  //   const handleDownload = () => {
  //     setLoading(true);
  //     const icsContent = generateICS(event);
  //     const blob = new Blob([icsContent], { type: "text/calendar" });
  //     const url = URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "event.ics";
  //     a.click();
  //     URL.revokeObjectURL(url);
  //     setLoading(false);
  //   };

  return (
    <>
      {contextHolder}
      {loading ? (
        <div className="flex flex-col items-center space-y-3 cursor-pointer">
          <Spin>
            <img
              src="/samsung_calendar_icon.svg"
              className="w-20 h-20 shadow-lg rounded-3xl"
              alt="Add Event to Samsung Calendar"
            />
          </Spin>
          <span>Samsung Calendar</span>
        </div>
      ) : (
        <button
          onClick={handleOpenCalendar}
          className="flex flex-col items-center space-y-3 cursor-pointer"
        >
          <img
            src="/samsung_calendar_icon.svg"
            className="w-20 h-20 p-3 shadow-lg rounded-3xl"
            alt="Add Event to Samsung Calendar"
          />
          <span>Samsung Calendar</span>
        </button>
      )}
    </>
  );
};

export default AddToSamsungCalendar;
