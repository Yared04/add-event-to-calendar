import React from "react";
import AddToGoogleCalendar, {
  EventDetails,
} from "./components/AddToGoogleCalendar";
import AddToSamsungCalendar from "./components/AddToSamsungCalendar";
import AddToAppleCalendar from "./components/AddToAppleCalendar";
import { useSearchParams } from "react-router-dom";

const App: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [event, setEvent] = React.useState<EventDetails>({
    title: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  React.useEffect(() => {
    const title = searchParams.get("title") || "";
    const location = searchParams.get("loc") || "";
    const startTime = searchParams.get("start_date") || "";
    const endTime = searchParams.get("end_date") || "";
    setEvent({ title, location, startTime, endTime });
  }, [searchParams]);

  return (
    <div className="mx-auto flex max-w-lg flex-col justify-center items-center space-y-4 p-4 min-h-svh">
      <p className="text-lg">Add event to:</p>
      <div className="flex flex-wrap justify-center gap-8">
        <AddToGoogleCalendar event={event} />
        <AddToSamsungCalendar event={event} />
        <AddToAppleCalendar event={event} />
      </div>
    </div>
  );
};

export default App;
