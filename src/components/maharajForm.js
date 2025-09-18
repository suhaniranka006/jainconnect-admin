import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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
      setDate(editMaharaj.date || '');
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

  if (!name || !city || !date) {
    alert('Please fill in Name, City, and Date.');
    return;
  }

  const maharajData = { name, city, title, date, contactInfo };

  try {
    if (editMaharaj && editMaharaj._id) {
      console.log('Editing Maharaj with _id:', editMaharaj._id);

      // Optional: check if this _id exists in backend
      const check = await axios.get(`${API_URL}/${editMaharaj._id}`);
      console.log('Check response:', check.data);

      console.log('Editing Maharaj:', editMaharaj);
      console.log('Updating Maharaj ID:', editMaharaj._id);
console.log('API URL:', `${API_URL}/${editMaharaj._id}`);



      const res = await axios.put(`${API_URL}/${editMaharaj._id}`, maharajData);
      console.log('Update response:', res.data);
      onUpdate(res.data);
    } else {
      const res = await axios.post(API_URL, maharajData);
      console.log('Add response:', res.data);
      onAdd(res.data);
    }
    resetForm();
  } catch (err) {
    console.error('Save error:', err.response ? err.response.data : err.message);
    alert('Error while saving data. Check console.');
  }
};


  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{editMaharaj ? 'Edit Maharaj' : 'Add New Maharaj'}</h3>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="text" placeholder="Date (dd-mm-yyyy)" value={date} onChange={e => setDate(e.target.value)} required />
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
