import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorPopup from "../components/Errorpopup";
import './Signup.css'

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [error, setError] = useState('');

  const createUser = async () => {
    try {
      if (!username || !password){
        setError('Please fill in all fields')
        setShowErrorPopup(true);
        return;
      } if (passwordStrength === 'Weak'){
        console.log('Password is weak');
        setError('Password is weak');
        setShowErrorPopup(true);
        return;
      }
      const response = await axios.post('http://localhost:3001/signup', { username, password });
      console.log('user created successfully:', response.data);
      setTimeout(() => {
        navigate("/vault");
      }, 10);
    } catch (error) {
      console.log('user creation failed:', error);
      setError('user creation failed');
      setShowErrorPopup(true);
    }
  }

  const closeErrorPopup = () => {
    console.log('close popup')
    setShowErrorPopup(false);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createUser();
    }
  }

  const checkPasswordStrength = (value) =>{
    
    const minLength = value.length >= 8;
    const uppercase = /[A-Z]/.test(value);
    const lowercase = /[a-z]/.test(value);
    const number = /\d/.test(value);
    const specialcharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);

    const strong = minLength && uppercase && lowercase && number && specialcharacter;

    setPasswordStrength(strong ? 'Strong' : 'Weak');
  }

  useEffect(() => {
    checkPasswordStrength(password);
}, [password]);

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
        <div className="password-strength" style={{ backgroundColor: passwordStrength === 'Strong' ? 'green' : 'red' }}></div>
        <br />
        <br />
        <button className="login-btn" onClick={createUser}>
          Signup
        </button>
      </div>
      <div>
          {showErrorPopup && <ErrorPopup message={error} onClose={closeErrorPopup} />}
        </div>
    </div>
  );
}

export default Signup;
