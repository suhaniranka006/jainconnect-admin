import React, { useState } from "react";
import MaharajList from "./components/maharajList";
import EventList from "./components/eventList";
import EventForm from "./components/eventForm";

function App() {
  // Events ke liye state
  const [editEvent, setEditEvent] = useState(null);
  const [events, setEvents] = useState([]);

  // ---- EVENT HANDLERS ----
  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]); // ✅ POST ke baad naya add karo
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(
      events.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    ); // ✅ PUT ke baad update karo
    setEditEvent(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((ev) => ev._id !== id)); // ✅ DELETE ke baad hatao
  };

  return (
    <div className="App">
      <h1>JainConnect Admin Panel</h1>

      {/* Maharaj Panel */}
      <section>
        <h2>Maharaj Panel</h2>
        <MaharajList />
      </section>

      {/* Events Panel */}
      <section>
        <h2>Events Panel</h2>
        <EventForm
          editEvent={editEvent}
          onAdd={handleAddEvent}
          onUpdate={handleUpdateEvent}
          onCancel={() => setEditEvent(null)}
        />
        <EventList
          onEdit={setEditEvent}
          onDelete={handleDeleteEvent}
          events={events}
          setEvents={setEvents}
        />
      </section>
    </div>
  );
}

export default App;
