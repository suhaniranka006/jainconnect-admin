// =================================================================================================
// 🧘 MAHARAJ FORM COMPONENT
// =================================================================================================
// Form to Add or Edit details of a Maharaj (Monk).

import React, { useState, useEffect } from 'react';
import api from './api';

function MaharajForm({ onAdd, editMaharaj, onUpdate, onCancel }) {
  // State for form fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Effect: Pre-fill form if editing
  useEffect(() => {
    if (editMaharaj) {
      setName(editMaharaj.name || '');
      setCity(editMaharaj.city || '');
      setTitle(editMaharaj.title || '');
      // Format date for HTML input
      setDate(editMaharaj.date ? new Date(editMaharaj.date).toISOString().split('T')[0] : '');
      setContactInfo(editMaharaj.contactInfo || '');
    } else {
      resetForm();
    }
  }, [editMaharaj]);

  // Clear form
  const resetForm = () => {
    setName('');
    setCity('');
    setTitle('');
    setDate('');
    setContactInfo('');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const maharajData = { name, city, title, date, contactInfo };

    try {
      if (editMaharaj && editMaharaj._id) {
        // Update existing ID
        const res = await api.put(`/maharajs/${editMaharaj._id}`, maharajData);
        onUpdate(res.data);
      } else {
        // Create new
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
