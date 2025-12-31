// =================================================================================================
// 📝 EVENT FORM COMPONENT
// =================================================================================================
// This component renders a form to Add or Edit an event.
// Props:
// - editEvent: The event object to edit (null if adding new).
// - onAdd: Function to call when a new event is added.
// - onUpdate: Function to call when an event is updated.
// - onCancel: Function to call when cancel button is clicked.

import React, { useState, useEffect } from 'react';
import api from "./api";

function EventForm({ editEvent, onAdd, onUpdate, onCancel }) {
  // 1. Local State for Form Fields
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // 2. Effect: Populate form if editing
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title || "");
      setCity(editEvent.city || "");
      // Format date to YYYY-MM-DD for input type="date"
      setDate(editEvent.date ? new Date(editEvent.date).toISOString().split('T')[0] : "");
      setTime(editEvent.time || "");
      setDescription(editEvent.description || "");
    } else {
      resetForm();
    }
  }, [editEvent]);

  // Helper to clear form
  const resetForm = () => {
    setTitle("");
    setCity("");
    setDate("");
    setTime("");
    setDescription("");
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload
    const eventData = { title, city, date, time, description };

    try {
      if (editEvent && editEvent._id) {
        // UPDATE existing event
        const res = await api.put(`/events/${editEvent._id}`, eventData);
        onUpdate(res.data);
      } else {
        // CREATE new event
        const res = await api.post("/events", eventData);
        onAdd(res.data);
      }
      resetForm();
    } catch (err) {
      console.error("DETAILED VALIDATION ERROR:", JSON.stringify(err.response?.data, null, 2));
      const errorMessage = err.response?.data?.message || "Error while saving event.";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editEvent ? "Edit Event" : "Add Event"}</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        placeholder="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">{editEvent ? "Update" : "Add"}</button>
      {editEvent && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default EventForm;
