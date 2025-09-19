import React, { useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://jainconnect-backened.onrender.com/api/tithis";

function TithiList({ tithis, setTithis, onEdit, onDelete }) {
  useEffect(() => { fetchTithis(); }, []);

  const fetchTithis = async () => {
    try {
      const res = await axios.get(API_URL);
      setTithis(res.data);
    } catch (err) {
      console.error('Error fetching tithis:', err.response?.data || err.message);
      alert('Error fetching tithis');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      onDelete(id);
    } catch (err) {
      console.error('Error deleting tithi:', err.response?.data || err.message);
      alert('Error deleting tithi');
    }
  };

  return (
    <div>
      <h3>Tithis List</h3>
      <table>
        <thead>
          <tr>
            <th>Tithi</th>
            <th>Date</th>
            <th>Description</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tithis.map(t => (
            <tr key={t._id}>
              <td>{t.tithi}</td>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.city}</td>
              <td>
                <button onClick={() => onEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TithiList;
