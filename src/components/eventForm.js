import React, { useState, useEffect } from "react";
import axios from "axios";

// Fallback in case .env variable is missing
const API_URL ="https://jainconnect-backened.onrender.com/api/events";

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
      setDate(editEvent.date || "");
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
        
        console.log("Event API URL:", API_URL);
        // PUT request
        const res = await axios.put(`${API_URL}/${editEvent._id}`, eventData);
        onUpdate(res.data);
      } else {
        // POST request
        const res = await axios.post(API_URL, eventData);
        onAdd(res.data);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err.response?.data || err.message);
      alert("Error while saving event.");
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
