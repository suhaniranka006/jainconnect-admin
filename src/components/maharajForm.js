// MaharajForm.js (UPDATED)

import React, { useState, useEffect } from 'react';
// Axios ko hata kar apni nayi api service import karein
import api from './api';

function MaharajForm({ onAdd, editMaharaj, onUpdate, onCancel }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    if (editMaharaj) {
      setName(editMaharaj.name || '');
      setCity(editMaharaj.city || '');
      setTitle(editMaharaj.title || '');
      // Date ko YYYY-MM-DD format me set karein taaki input field me dikh sake
      setDate(editMaharaj.date ? new Date(editMaharaj.date).toISOString().split('T')[0] : '');
      setContactInfo(editMaharaj.contactInfo || '');
    } else {
      resetForm();
    }
  }, [editMaharaj]);

  const resetForm = () => {
    setName('');
    setCity('');
    setTitle('');
    setDate('');
    setContactInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const maharajData = { name, city, title, date, contactInfo };

    try {
      if (editMaharaj && editMaharaj._id) {
        // axios.put ko api.put se badal dein
        const res = await api.put(`/maharajs/${editMaharaj._id}`, maharajData);
        onUpdate(res.data);
      } else {
        // axios.post ko api.post se badal dein
        const res = await api.post('/maharajs', maharajData);
        onAdd(res.data);
      }
      resetForm();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Error while saving data. Check console.';
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{editMaharaj ? 'Edit Maharaj' : 'Add New Maharaj'}</h3>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      {/* Input ka type 'date' kar dein behtar experience ke liye */}
      <input type="date" placeholder="Date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="text" placeholder="Contact Info" value={contactInfo} onChange={e => setContactInfo(e.target.value)} />
      <button type="submit">{editMaharaj ? 'Update' : 'Add'}</button>
      {editMaharaj && (
        <button type="button" onClick={() => { onCancel(); resetForm(); }}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default MaharajForm;