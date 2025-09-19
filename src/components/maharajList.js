import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaharajForm from './maharajForm';

const API_URL = process.env.REACT_APP_API_URL;

function MaharajList() {
  const [maharajs, setMaharajs] = useState([]);
  const [editMaharaj, setEditMaharaj] = useState(null);

  useEffect(() => {
    fetchMaharajs();
  }, []);

  const fetchMaharajs = async () => {
    try {
      const res = await axios.get(API_URL);
      setMaharajs(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMaharajs(maharajs.filter(m => m._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
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
              <td>{m.date}</td>
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
