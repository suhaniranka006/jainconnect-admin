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
      // Map _id to id for consistency
      const mapped = res.data.map(item => ({ ...item, id: item._id }));
      setMaharajs(mapped);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMaharajs(maharajs.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAdd = (newMaharaj) => {
    const mapped = { ...newMaharaj, id: newMaharaj._id || newMaharaj.id };
    setMaharajs([...maharajs, mapped]);
  };

  const handleUpdate = (updatedMaharaj) => {
    const mapped = { ...updatedMaharaj, id: updatedMaharaj._id || updatedMaharaj.id };
    setMaharajs(maharajs.map(m => m.id === mapped.id ? mapped : m));
    setEditMaharaj(null);
  };

  const handleEditClick = (maharaj) => {
    console.log("Editing:", maharaj); // check id exists
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
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {maharajs.map(m => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.city}</td>
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
