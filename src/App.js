import React, { useState } from "react";
import MaharajList from "./components/maharajList";
import EventList from "./components/eventList";
import EventForm from "./components/eventForm";
import TithiForm from "./components/tithiForm";
import TithiList from "./components/tithiList";

function App() {
  // ----- Events State -----
  const [editEvent, setEditEvent] = useState(null);
  const [events, setEvents] = useState([]);

  // ----- Tithis State -----
  const [editTithi, setEditTithi] = useState(null);
  const [tithis, setTithis] = useState([]);

  // ----- Event Handlers -----
  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev)));
    setEditEvent(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((ev) => ev._id !== id));
  };

  // ----- Tithi Handlers -----
  const handleAddTithi = (newTithi) => {
    setTithis([...tithis, newTithi]);
  };

  const handleUpdateTithi = (updatedTithi) => {
    setTithis(tithis.map((t) => (t._id === updatedTithi._id ? updatedTithi : t)));
    setEditTithi(null);
  };

  const handleDeleteTithi = (id) => {
    setTithis(tithis.filter((t) => t._id !== id));
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

      {/* Tithis Panel */}
      <section>
        <h2>Tithis Panel</h2>
        <TithiForm
          editTithi={editTithi}
          onAdd={handleAddTithi}
          onUpdate={handleUpdateTithi}
          onCancel={() => setEditTithi(null)}
        />
        <TithiList
          tithis={tithis}
          setTithis={setTithis}
          onEdit={setEditTithi}
          onDelete={handleDeleteTithi}
        />
      </section>
    </div>
  );
}

export default App;
