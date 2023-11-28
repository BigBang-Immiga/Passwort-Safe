import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Vault.css'

function Vault() {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({ username: '', password: '' });

  const getData = () => {
    axios.get('http://localhost:3001/get-vault', {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwtToken")
      }
    })
      .then(response => setPasswords(response.data))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getData()
  }, []);

  const addPassword = () => {
    const token = sessionStorage.getItem('jwtToken');
    
    axios.post('http://localhost:3001/post-vault', newPassword, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => { //TODO: send user_id to the database (data)
        setNewPassword({ username: '', password: '', website: '', remarks: '' });
        getData()
      })
      .catch(error => console.error(error));
  };
  

  return (
    <div>
      <div className='title'>
      <h1>Password Safe</h1>
      </div>
      <div className='input'>
        <input className='username' type="text" placeholder="Username" value={newPassword.username} onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })} />
        <input className='password' type="password" placeholder="Password" value={newPassword.password} onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })} />
        <input className='website' type="text" placeholder="Website" value={newPassword.website} onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })} />
        <input className='remarks' type="text" placeholder="Remarks" value={newPassword.remarks} onChange={(e) => setNewPassword({ ...newPassword, remarks: e.target.value })} />
        <button onClick={addPassword}>Add</button>
      </div>
      <div className='secret'>
        <div className='table-container'>
          <table className='secret-table'>
            <thead>
              <tr className='title-row'>
                <th>Username</th>
                <th>Password</th>
                <th>Website</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map(password => (
                <tr key={password.id}>
                  <td>{password.username}</td>
                  <td>{password.password}</td>
                  <td>{password.website}</td>
                  <td>{password.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default Vault;
