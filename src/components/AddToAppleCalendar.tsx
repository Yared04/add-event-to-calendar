import React from "react";
import { EventDetails } from "./AddToGoogleCalendar";
import { Spin, message } from "antd";

const AddToAppleCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleOpenCalendar = () => {
    setLoading(true);
    try {
      const startTime = new Date(event.startTime).toISOString();
      const endTime = new Date(event.endTime).toISOString();

      // Apple Calendar deep link format
      const deepLink = `webcal://p30-caldav.icloud.com/published/2/${encodeURIComponent(
        event.title
      )}?start=${startTime}&end=${endTime}&location=${encodeURIComponent(
        event.location
      )}`;

      // Try to open the calendar app
      const opened = window.open(deepLink, "_blank");

      if (!opened) {
        throw new Error("Could not open calendar app");
      }

      messageApi.open({
        type: "success",
        content: "Opening Apple Calendar...",
      });
    } catch (err) {
      console.error("Error opening Apple Calendar:", err);
      messageApi.open({
        type: "error",
        content: "Could not open Apple Calendar. Please try again.",
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
              src="/apple_calendar_icon.svg"
              className="w-20 h-20 shadow-lg rounded-3xl"
              alt="Add Event to Apple Calendar"
            />
          </Spin>
          <span>Apple Calendar</span>
        </div>
      ) : (
        <button
          onClick={handleOpenCalendar}
          className="flex flex-col items-center space-y-3 cursor-pointer"
        >
          <img
            src="/apple_calendar_icon.svg"
            className="w-20 h-20 p-3 shadow-lg rounded-3xl"
            alt="Add Event to Apple Calendar"
          />
          <span>Apple Calendar</span>
        </button>
      )}
    </>
  );
};

export default AddToAppleCalendar;
