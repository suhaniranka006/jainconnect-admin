import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://jainconnect-backened-2.onrender.com/api/tithis";

function TithiForm({ editTithi, onAdd, onUpdate, onCancel }) {
  const [tithi, setTithi] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editTithi) {
      setTithi(editTithi.tithi || '');
      setDate(editTithi.date || '');
      setDescription(editTithi.description || '');
    } else resetForm();
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
        const res = await axios.put(`${API_URL}/${editTithi._id}`, tithiData);
        onUpdate(res.data);
      } else {
        const res = await axios.post(API_URL, tithiData);
        onAdd(res.data);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving tithi:', err.response?.data || err.message);
      alert('Error saving tithi');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
