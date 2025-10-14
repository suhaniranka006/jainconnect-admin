import React, { useState, useEffect } from 'react';
import api from "./api";

function EventForm({ editEvent, onAdd, onUpdate, onCancel }) {
  const [title, setTitle] = useState("");
  // 'location' ko waapas 'city' kar dein
  const [city, setCity] = useState(""); 
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title || "");
      // 'editEvent.location' ko waapas 'editEvent.city' kar dein
      setCity(editEvent.city || ""); 
      setDate(editEvent.date ? new Date(editEvent.date).toISOString().split('T')[0] : "");
      setTime(editEvent.time || "");
      setDescription(editEvent.description || "");
    } else {
      resetForm();
    }
  }, [editEvent]);

  const resetForm = () => {
    setTitle("");
    // 'setLocation' ko waapas 'setCity' kar dein
    setCity(""); 
    setDate("");
    setTime("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Yahan 'location' ki jagah waapas 'city' bhejein
    const eventData = { title, city, date, time, description }; 

    try {
      if (editEvent && editEvent._id) {
        const res = await api.put(`/events/${editEvent._id}`, eventData);
        onUpdate(res.data);
      } else {
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
      {/* Input field ko bhi waapas 'city' ke liye update karein */}
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