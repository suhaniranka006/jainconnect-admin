// MaharajList.js (UPDATED)

import React, { useEffect, useState } from 'react';
// Axios ko hata kar apni nayi api service import karein
import api from './api'; 
import MaharajForm from './maharajForm';

function MaharajList() {
  const [maharajs, setMaharajs] = useState([]);
  const [editMaharaj, setEditMaharaj] = useState(null);

  useEffect(() => {
    fetchMaharajs();
  }, []);

  const fetchMaharajs = async () => {
    try {
      // Sirf endpoint '/maharajs' ka istemal karein
      const res = await api.get('/maharajs');
      setMaharajs(res.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      alert('Error fetching maharajs');
    }
  };

  const handleDelete = async (id) => {
    try {
      // axios.delete ko api.delete se badal dein
      // Token apne aap headers me chala jayega
      await api.delete(`/maharajs/${id}`);
      setMaharajs(maharajs.filter(m => m._id !== id));
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Error deleting maharaj';
      alert(errorMessage);
    }
  };

  const handleAdd = (newMaharaj) => {
    setMaharajs([...maharajs, newMaharaj]);
  };

  const handleUpdate = (updatedMaharaj) => {
    setMaharajs(
      maharajs.map(m => (m._id === updatedMaharaj._id ? updatedMaharaj : m))
    );
    setEditMaharaj(null);
  };

  const handleEditClick = (maharaj) => {
    setEditMaharaj(maharaj);
  };

  const handleCancelEdit = () => {
    setEditMaharaj(null);
  };

  return (
    <div>
      <MaharajForm
        onAdd={handleAdd}
        editMaharaj={editMaharaj}
        onUpdate={handleUpdate}
        onCancel={handleCancelEdit}
      />

      <h2>Maharaj List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Title</th>
            <th>Contact Info</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {maharajs.map(m => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.city}</td>
              <td>{m.title}</td>
              <td>{m.contactInfo}</td>
              {/* Date ko behtar format me dikhane ke liye */}
              <td>{new Date(m.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(m)}>Edit</button>
                <button onClick={() => handleDelete(m._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaharajList;