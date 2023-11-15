import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ username: '', password: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/Safe')
      .then(response => setPasswords(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddPassword = () => {
    axios.post('http://localhost:3001/Safe', newPassword)
      .then(response => {
        setNewPassword({ username: '', password: '' });
        setPasswords([...passwords, { id: response.data.id, ...newPassword }]);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Password Safe</h1>
      <ul>
        {passwords.map(password => (
          <li key={password.id}>
            {password.username} - {password.password} - {password.website} - {password.remarks}
          </li>
        ))}
      </ul>
      <div>
        <input type="text" placeholder="Username" value={newPassword.username} onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })} />
        <input type="password" placeholder="Password" value={newPassword.password} onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })} />
        <input type="text" placeholder="Website" value={newPassword.website} onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })} />
        <input type="text" placeholder="Remarks" value={newPassword.remarks} onChange={(e) => setNewPassword({ ...newPassword, remarks: e.target.value })} />
        <button onClick={handleAddPassword}>Add Password</button>
      </div>
    </div>
  );
}


export default App;
