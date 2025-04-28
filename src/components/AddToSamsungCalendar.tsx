// add-event-to-calendar/src/components/AddToSamsungCalendar.tsx
import React from "react";
// import { generateICS } from "../utils/ics";
import { EventDetails } from "./AddToGoogleCalendar";
import { Spin, message } from "antd";

const AddToSamsungCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleOpenCalendar = () => {
    setLoading(true);
    try {
      // Format dates for Samsung Calendar
      const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toISOString().replace(/-|:|\.\d+/g, "");
      };

      const startTime = formatDate(event.startTime);
      const endTime = formatDate(event.endTime);

      // Create a data URL for the calendar event
      const calendarData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${event.title}`,
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        `LOCATION:${event.location}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      // Create a blob with the calendar data
      const blob = new Blob([calendarData], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);

      // Try to open the calendar app using intent
      const intentUrl = `intent://calendar/event?action=android.intent.action.EDIT&title=${encodeURIComponent(
        event.title
      )}&location=${encodeURIComponent(
        event.location
      )}&start=${startTime}&end=${endTime}#Intent;scheme=content;package=com.android.calendar;end`;

      // First try the intent URL
      const opened = window.open(intentUrl, "_blank");

      if (!opened) {
        // If intent fails, try the data URL
        const a = document.createElement("a");
        a.href = url;
        a.download = "event.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      messageApi.open({
        type: "success",
        content: "Opening Samsung Calendar...",
      });
    } catch (err) {
      console.error("Error opening Samsung Calendar:", err);
      messageApi.open({
        type: "error",
        content: "Could not open Samsung Calendar. Please try again.",
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
