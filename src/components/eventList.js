import React, { useEffect } from "react";
import axios from "axios";

const API_URL ="https://jainconnect-backened.onrender.com/api/events";

function EventList({ onEdit, onDelete, events, setEvents }) {
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {

        console.log("Event API URL:", API_URL);

      const res = await axios.get(API_URL);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err.response?.data || err.message);
      alert("Error fetching events");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
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
              <td>{ev.city}</td>
              <td>{ev.date}</td>
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
