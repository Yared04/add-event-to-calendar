import React from "react";

const GoogleCalendarButton: React.FC<{ event: EventDetails }> = ({ event }) => {
    const generateGoogleCalendarLink = () => {
        const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
        const eventTitle = encodeURIComponent(event.title);
        const eventDetails = encodeURIComponent(event.details);
        const eventLocation = encodeURIComponent(event.location);

        const startDate = new Date(event.startTime).toISOString().replace(/[-:.]/g, "").slice(0, -1) + "Z";
        const endDate = new Date(event.endTime).toISOString().replace(/[-:.]/g, "").slice(0, -1) + "Z";

        return `${baseUrl}&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${startDate}/${endDate}`;
    };

    const handleClick = () => {
        const calendarLink = generateGoogleCalendarLink();
        window.open(calendarLink);
    };

    return (
        <button onClick={handleClick}>
            Add to Google Calendar
        </button>
    );
};

export default GoogleCalendarButton;

// EventDetails Type
export interface EventDetails {
    title: string;
    details: string;
    location: string;
    startTime: string; // e.g., "2025-03-25T15:00:00Z"
    endTime: string;   // e.g., "2025-03-25T16:00:00Z"
}
