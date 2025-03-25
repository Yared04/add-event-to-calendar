import React, { useEffect } from "react";
import { gapi } from "gapi-script";
import { message, Spin } from 'antd';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const SCOPES = import.meta.env.VITE_SCOPES;

const AddToGoogleCalendar: React.FC<{ event: EventDetails }> = ({ event }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                scope: SCOPES,
            });
        }
        gapi.load("client:auth2", start);
    }, []);

    const convertToISO = (dateStr: string) => {
        // Ensure correct format by replacing space with '+'
        const formattedStr = dateStr.replace(" ", "+");

        // Convert to ISO format
        const date = new Date(formattedStr);
        return date.toISOString(); // Converts to "2025-03-24T21:00:00.000Z" (UTC)
    };

    const addEventToCalendar = async () => {
        setLoading(true);
        const authInstance = gapi.auth2.getAuthInstance();

        if (!authInstance.isSignedIn.get()) {
            await authInstance.signIn();
        }
        const eventDetails = {
            summary: event.title,
            description: event.details || "",
            location: event.location,
            start: { dateTime: convertToISO(event.startTime) },
            end: { dateTime: convertToISO(event.endTime) },
            colorId: 2, // Set color to light green
        };

        try {
            await gapi.client.calendar.events.insert({
                calendarId: "primary",
                resource: eventDetails,
            });

            // Trigger message asynchronously to avoid rendering issues
            setTimeout(() => {
                messageApi.open({
                    type: "success",
                    content: "Event added to Google Calendar",
                });
                setLoading(false);
            }, 0);
        } catch (error) {
            console.error("Error adding event:", error);
            setTimeout(() => {
                messageApi.open({
                    type: "error",
                    content: "Error adding event to Google Calendar. Please try again.",
                });
                setLoading(false);
            }, 0);
        }
    };

    return (
        <>
            {contextHolder}
            {loading ? (

                <div className="flex flex-col items-center space-y-3 cursor-pointer">
                    <Spin>
                        <img src="/google_calendar_icon.svg"
                            className="w-20 h-20 shadow-lg rounded-3xl"
                            alt="Add Event to Google Calendar"
                        />
                    </Spin>
                    <span>Google Calendar</span>
                </div>

            ) : (
                <button onClick={addEventToCalendar} className="flex flex-col items-center space-y-3 cursor-pointer" >
                    <img src="/google_calendar_icon.svg"
                        className="w-20 h-20 shadow-lg rounded-3xl"
                        alt="Add Event to Google Calendar"
                    />
                    <span>Google Calendar</span>
                </button>
            )}
        </>
    );
};

export default AddToGoogleCalendar;

// EventDetails Type
export interface EventDetails {
    title: string;
    details?: string;
    location: string;
    startTime: string;
    endTime: string;
}
