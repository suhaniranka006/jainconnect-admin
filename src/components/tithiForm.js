// =================================================================================================
// 📅 TITHI FORM COMPONENT
// =================================================================================================
// Form to Add or Edit Tithi (Jain Calendar) info.

import React, { useState, useEffect } from 'react';
import api from './api';

function TithiForm({ editTithi, onAdd, onUpdate, onCancel }) {
  const [tithi, setTithi] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Auto-fill form on edit
  useEffect(() => {
    if (editTithi) {
      setTithi(editTithi.tithi || '');
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
        const res = await api.put(`/tithis/${editTithi._id}`, tithiData);
        onUpdate(res.data);
      } else {
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
