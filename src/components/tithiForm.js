// TithiForm.js (UPDATED)

import React, { useState, useEffect } from 'react';
// Axios ko hata kar apni nayi api service import karein
import api from './api';

function TithiForm({ editTithi, onAdd, onUpdate, onCancel }) {
  const [tithi, setTithi] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editTithi) {
      setTithi(editTithi.tithi || '');
      // Date ko YYYY-MM-DD format me set karein taaki input field me dikh sake
      setDate(editTithi.date ? new Date(editTithi.date).toISOString().split('T')[0] : '');
      setDescription(editTithi.description || '');
    } else {
      resetForm();
    }
  }, [editTithi]);

  const resetForm = () => {
    setTithi('');
    setDate('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tithiData = { tithi, date, description };

    try {
      if (editTithi && editTithi._id) {
        // axios.put ko api.put se badal dein
        const res = await api.put(`/tithis/${editTithi._id}`, tithiData);
        onUpdate(res.data);
      } else {
        // axios.post ko api.post se badal dein
        const res = await api.post('/tithis', tithiData);
        onAdd(res.data);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving tithi:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Error saving tithi';
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editTithi ? 'Edit Tithi' : 'Add Tithi'}</h3>
      <input
        type="text"
        placeholder="Tithi"
        value={tithi}
        onChange={e => setTithi(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button type="submit">{editTithi ? 'Update' : 'Add'}</button>
      {editTithi && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default TithiForm;