// =================================================================================================
// 📅 TITHI LIST COMPONENT
// =================================================================================================
// Displays list of upcoming Tithis.

// TithiList.js (UPDATED)

import React, { useEffect } from 'react';
// Axios ko hata kar apni nayi api service import karein
import api from './api';

function TithiList({ tithis, setTithis, onEdit, onDelete }) {
  useEffect(() => { fetchTithis(); }, []);

  const fetchTithis = async () => {
    try {
      // Sirf endpoint '/tithis' ka istemal karein
      const res = await api.get('/tithis');
      setTithis(res.data);
    } catch (err) {
      console.error('Error fetching tithis:', err.response?.data || err.message);
      alert('Error fetching tithis');
    }
  };

  const handleDelete = async (id) => {
    try {
      // axios.delete ko api.delete se badal dein
      // Token apne aap headers me chala jayega
      await api.delete(`/tithis/${id}`);
      onDelete(id);
    } catch (err) {
      console.error('Error deleting tithi:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Error deleting tithi';
      alert(errorMessage);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tithis.map(t => (
            <tr key={t._id}>
              <td>{t.tithi}</td>
              {/* Date ko behtar format me dikhane ke liye */}
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.description}</td>
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