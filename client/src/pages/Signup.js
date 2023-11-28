import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/signup', { username, password });
      console.log('user created successfully:', response.data);
      setTimeout(() => {
        navigate("/login");
      }, 10);
    } catch (error) {
      console.log('user creation failed:', error);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createUser();
    }
  }

  return (
    <div>
      <h1 className="title">Signup</h1>
      <div className="login-input">
        <input
          className="login"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Username"
        />
        <input
          className="login"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Password"
        />
        <br />
        <br />
        <button className="login-btn" onClick={createUser}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;
