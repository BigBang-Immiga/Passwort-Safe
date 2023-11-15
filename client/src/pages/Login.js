import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from '../components/Usercontext';
import './Login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handlelogin = async () => {
        try {
          const response = await axios.post('http://localhost:3000/login', { username, password });
          console.log('login successful:', response.data);
          login();
          setTimeout(() => {
            navigate("/Vault");
          }, 10)
        } catch (error) {
          console.log('login failed:', error);
        }
      }


  return (
    <div>
        <div className="login-column">
            <div className="login-title">
                Log in
            </div>
            <div className="login-input">
            <input className="login" type="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username"></input>
            <input className="login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"></input>
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
    </div>
  );
}

export default Login;
