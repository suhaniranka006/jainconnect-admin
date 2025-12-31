// =================================================================================================
// 📋 EVENT LIST COMPONENT
// =================================================================================================
// This component displays a table of all events.
// It fetches data on mount and provides Edit/Delete buttons.

import React, { useEffect } from "react";
import api from "./api";

function EventList({ onEdit, onDelete, events, setEvents }) { // Props passed from Parent Page

  // 1. Fetch Events on Load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data); // Update state in parent
    } catch (err) {
      console.error("Error fetching events:", err.response?.data || err.message);
      alert("Error fetching events");
    }
  };

  // 2. Handle Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      onDelete(id); // Update UI locally
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
            <th>City</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* 3. Loop through events and render rows */}
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
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