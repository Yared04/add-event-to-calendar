// add-event-to-calendar/src/components/AddToSamsungCalendar.tsx
import React from "react";
import { EventDetails } from "./AddToGoogleCalendar";
import { Spin, message } from "antd";
import { generateICS } from "../utils/ics";

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

// Add Telegram WebApp type definition
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
    Telegram: {
      WebApp: {
        downloadFile: (blob: Blob, fileName: string) => void;
      };
    };
  }
}

const AddToSamsungCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDownload = () => {
    setLoading(true);
    try {
      const icsContent = generateICS(event);
      const blob = new Blob([icsContent], { type: "text/calendar" });

      // Use Telegram's downloadFile function
      window.Telegram.WebApp.downloadFile(blob, "event.ics");

      messageApi.open({
        type: "success",
        content:
          "Calendar file downloaded. You can now import it into your calendar.",
      });
    } catch (err) {
      console.error("Error downloading calendar file:", err);
      messageApi.open({
        type: "error",
        content: "Could not download calendar file. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
          onClick={handleDownload}
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
