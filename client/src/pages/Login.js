import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from '../components/Usercontext';
import './Login.css'
import ErrorPopup from "../components/Errorpopup";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handlelogin = async () => {
      try {
        if (!username || !password){
          setError('Please fill in all fields')
          setShowErrorPopup(true);
          return;
        }
        const response = await axios.post('http://localhost:3001/login', { username, password });

        const token = response.data.token;
        sessionStorage.setItem('jwtToken', token);

        console.log('login successful:', response.data);
        console.log(sessionStorage.getItem('jwtToken'))
        login();
        setTimeout(() => {
          navigate("/vault");
        }, 10)
      } catch (error) {
        console.log('login failed:', error);
        setError('Login failed');
        setShowErrorPopup(true);
      }
    }
  
    const closeErrorPopup = () => {
      console.log('close popup')
      setShowErrorPopup(false);
    }
    


  return (
    <div>
        <div className="login-column">
            <div className="login-title">
                Log in
            </div>
            <div className="login-input">
            <input
              className="login"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlelogin()}
              placeholder="Enter Username"
            />
            <input
              className="login"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlelogin()}
              placeholder="Enter Password"
            />
            </div>
            <div className="login-btn-container">
                <button onClick={handlelogin} className="login-btn">
                    Enter
                </button>
            </div>
        </div>
        <div className="signup-column">
        <Link to={"/Signup"}>
              <div className="signup-btn-container">
              <button className="signup-btn">Create a new account</button>
              </div>
            </Link>
        </div>
        <div>
          {showErrorPopup && <ErrorPopup message={error} onClose={closeErrorPopup} />}
        </div>
    </div>
  );
}

export default Login;
