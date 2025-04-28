// add-event-to-calendar/src/components/AddToSamsungCalendar.tsx
import React from "react";
// import { generateICS } from "../utils/ics";
import { EventDetails } from "./AddToGoogleCalendar";
import { Spin } from "antd";

const AddToSamsungCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [loading, setLoading] = React.useState(false);

  const handleOpenCalendar = () => {
    setLoading(true);
    // const icsContent = generateICS(event);
    const deepLink = `content://com.android.calendar/time/${new Date(
      event.startTime
    ).getTime()}`;
    window.open(deepLink, "_blank");
    setLoading(false);
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
