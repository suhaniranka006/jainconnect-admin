import React, { useState, useEffect } from "react";
import api from "./api"; // Aapne yeh bilkul sahi kiya

// API_URL constant ki ab zaroorat nahi hai, use hata dein

function EventForm({ editEvent, onAdd, onUpdate, onCancel }) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title || "");
      setCity(editEvent.city || "");
      // Date ko YYYY-MM-DD format me set karein taaki input field me dikh sake
      setDate(editEvent.date ? new Date(editEvent.date).toISOString().split('T')[0] : "");
      setTime(editEvent.time || "");
      setDescription(editEvent.description || "");
    } else {
      resetForm();
    }
  }, [editEvent]);

  const resetForm = () => {
    setTitle("");
    setCity("");
    setDate("");
    setTime("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { title, city, date, time, description };

    try {
      if (editEvent && editEvent._id) {
        // PUT request: Sirf endpoint '/events/:id' ka istemal karein
        const res = await api.put(`/events/${editEvent._id}`, eventData);
        onUpdate(res.data);
      } else {
        // POST request: Sirf endpoint '/events' ka istemal karein
        const res = await api.post("/events", eventData);
        onAdd(res.data);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err.response?.data || err.message);
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