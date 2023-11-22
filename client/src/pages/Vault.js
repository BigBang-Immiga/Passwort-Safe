import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Vault() {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ username: '', password: '', website: '', remarks: '' });
  const [editMode, setEditMode] = useState(false);
  const [editPasswordId, setEditPasswordId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/Vault')
      .then(response => setPasswords(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddPassword = () => {
    if (editMode) {
      // Handle edit logic here
      axios.put(`http://localhost:3000/Vault/${editPasswordId}`, newPassword)
        .then(() => {
          const updatedPasswords = passwords.map(password => {
            if (password.id === editPasswordId) {
              return { id: editPasswordId, ...newPassword };
            }
            return password;
          });
          setPasswords(updatedPasswords);
        })
        .catch(error => console.error(error));
      setEditMode(false);
      setEditPasswordId(null);
    } else {
      axios.post('http://localhost:3000/Vault', newPassword)
        .then(response => {
          setNewPassword({ username: '', password: '', website: '', remarks: '' });
          setPasswords([...passwords, { id: response.data.id, ...newPassword }]);
        })
        .catch(error => console.error(error));
    }
  };

  const handleEditPassword = (id, username, password, website, remarks) => {
    setNewPassword({ username, password, website, remarks });
    setEditMode(true);
    setEditPasswordId(id);
  };

  const handleCancelEdit = () => {
    setNewPassword({ username: '', password: '', website: '', remarks: '' });
    setEditMode(false);
    setEditPasswordId(null);
  };

  return (
    <div>
      <h1>Password Safe</h1>
      <ul>
        {passwords.map(password => (
          <li key={password.id}>
            {password.username} - {password.password} - {password.website} - {password.remarks}
            <button onClick={() => handleEditPassword(password.id, password.username, password.password, password.website, password.remarks)}>Edit</button>
          </li>
        ))}
      </ul>
      <div>
        <input type="text" placeholder="Username" value={newPassword.username} onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })} />
        <input type="password" placeholder="Password" value={newPassword.password} onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })} />
        <input type="text" placeholder="Website" value={newPassword.website} onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })} />
        <input type="text" placeholder="Remarks" value={newPassword.remarks} onChange={(e) => setNewPassword({ ...newPassword, remarks: e.target.value })} />
        <button onClick={handleAddPassword}>{editMode ? 'Edit Password' : 'Add Password'}</button>
        {editMode && <button onClick={handleCancelEdit}>Cancel</button>}
      </div>
    </div>
  );
}

export default Vault;
