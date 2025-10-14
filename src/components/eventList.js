import React, { useEffect } from "react";
import api from "./api";

function EventList({ onEdit, onDelete, events, setEvents }) {
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err.response?.data || err.message);
      alert("Error fetching events");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Error deleting event:", err.response?.data || err.message);
      alert("Error deleting event");
    }
  };

  return (
    <div>
      <h3>Events List</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            {/* 'location' ko waapas 'City' kar dein */}
            <th>City</th> 
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              {/* 'ev.location' ko waapas 'ev.city' kar dein */}
              <td>{ev.city}</td> 
              <td>{new Date(ev.date).toLocaleDateString()}</td>
              <td>{ev.time}</td>
              <td>{ev.description}</td>
              <td>
                <button onClick={() => onEdit(ev)}>Edit</button>
                <button onClick={() => handleDelete(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventList;